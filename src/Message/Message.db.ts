import dotenv from 'dotenv';
import { Collection, MongoClient, ObjectId } from "mongodb";
import { Chat, Message } from "./Message.type";
import MongoConnection from '../UtilityClass/MongoConnection';
dotenv.config();

const DB_INFO = {
    db: process.env.DB_NAME,
    Chats: "Chats",
    Messages: "Messages"
}

let mongo: MongoClient;

let changeStream;
// Define an asynchronous function to manage the change stream
async function run() {

    mongo = MongoConnection.getInstance().getMongoClient();
    const database = mongo.db("Chat_DB");
    const chats: Collection<Document> = database.collection("Chats");

    changeStream = chats.watch();

    for await (const change of changeStream) {
        switch (change.operationType) {
            case 'insert':
                //console.log('New fullDocument:', change.fullDocument);
                // console.log('insert chat ID:', change.documentKey._id);
                break;
            case 'update':
                const senderId = JSON.stringify(change.updateDescription.updatedFields).split('senderId')[1].substring(3, 27)

                const chatId = change.documentKey._id;
                if (chatId) {
                    const chat = await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).findOne({ _id: chatId });
                    console.log('chat', chat)
                    if (chat) {
                        // Filter participants to exclude the sender
                        const participants = chat.participants.filter((participant: ObjectId) => participant.toString() !== senderId.toString());

                        // Send notifications to other participants
                        pushNotificationToUser(participants, `New message in your chat with ${senderId}`);
                    }
                }

                break;
            case 'delete':
                // console.log('Deleted chat ID:', change.documentKey._id);
                break;
        }
    }
    await changeStream.close();
}
run().catch(console.log);
export async function connectToDb() {
    try {
        mongo = MongoConnection.getInstance().getMongoClient();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
export async function createChat(senderId: string, receiverId: string): Promise<ObjectId> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        let existingChat = await getChatByParticipants([new ObjectId(senderId), new ObjectId(receiverId)]);
        if (existingChat) {
            throw new Error("Chat already exists in database");
        }
        let chat: Chat = { participants: [new ObjectId(senderId), new ObjectId(receiverId)] }
        return (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).insertOne(chat)).insertedId;
    } catch (error) {
        throw error;
    }

}
export async function getChatByParticipants(participants: ObjectId[]): Promise<Chat | null> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        const chat: Chat[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).find({ participants: { $all: participants } }).toArray()).map(doc => ({
            _id: doc._id,
            participants: doc.participants,
            messages: doc.messages
        }));
        return chat[0];


    } catch (error) {
        return null;
    }
}
export async function getChatsById(senderId: string): Promise<Chat[] | null> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {

        const chatWithUserDetails = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).aggregate([
            {
                $match: { participants: { $in: [new ObjectId(senderId)] } }
            },
            {
                $lookup: {
                    from: "Users",
                    localField: 'participants',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    participants: 1,
                    userDetails: {
                        _id: 1,
                        username: 1,
                        email: 1,
                        avatarURL: 1,
                    }
                }
            }
        ]).toArray()).map(doc => ({
            _id: doc._id,
            participants: doc.participants,
            userDetails: doc.userDetails
        }));


        return chatWithUserDetails;

    } catch (error) {
        throw error
    }
}
// export async function getChatsById(senderId: string): Promise<Chat[] | null> {
//     if (!mongo) {
//         throw new Error("Database is not connected");
//     }
//     try {
//         const chat: Chat[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).find({ participants: { $in: [new ObjectId(senderId)] } }).toArray()).map(doc => ({
//             _id: doc._id,
//             participants: doc.participants,
//             messages: doc.messages
//         }));
//         return chat;

//     } catch (error) {
//         return null;
//     }
// }

export async function getChatsByQuery(query = {}, projection = {}): Promise<Chat[]> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {

        const chats: Chat[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).find(query, projection).sort({ createdAt: -1 }).toArray()).map(doc => ({
            _id: doc._id,
            participants: doc.participants,
            messages: doc.messages
        }));
        return chats

    } catch (error) {
        throw error;
    }
}

export async function sendMessage(chatId: string, message: Message) {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {

        return await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).updateOne(
            { _id: new ObjectId(chatId) },
            { $push: { messages: message as any } }
        );
    } catch (error) {
        throw error;
    }
}
export async function getMessages(chatId: string): Promise<Message[]> {

    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        const chat: Chat[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).find({ _id: new ObjectId(chatId) }).toArray()).map(doc => ({
            _id: doc._id,
            participants: doc.participants,
            messages: doc?.messages
        }));

        return chat ? chat[0].messages as Message[] : [];
    } catch (error) {
        throw error;

    }
}


function pushNotificationToUser(arg0: any, arg1: string) {
    console.log('Function pushNotificationToUser not implemented.');

}

