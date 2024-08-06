import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";
import { Chat, Message } from "./Message.type";
dotenv.config();

const DB_INFO = {
    host: process.env.CONNECTION_STRING as string,
    db: process.env.DB_NAME,
    Chats: "Chats",
    Messages: "Messages",
    Users: "Users"
}

let mongo: MongoClient;

export async function connectToDb() {
    try {
        mongo = new MongoClient(DB_INFO.host);
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
    finally {
        // mongo.close();
    }
}
export async function getChatByParticipants(participants: ObjectId[]): Promise<Chat | null> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        //TODO: check NULLPointerException && is that fint() works 
        const chat: Chat[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).find({ participants: { $all: participants } }).toArray()).map(doc => ({
            _id: doc._id,
            participants: doc.participants,
            messages: doc.messages
        }));
        return chat[0];


    } catch (error) {
        return null;
    }
    finally {
        // mongo.close();
    }
}
export async function getChatById(chatId: string): Promise<Chat | null> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        //TODO: check NULLPointerException && is that fint() works 
        const chat: Chat[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).find({ _id: new ObjectId(chatId) }).toArray()).map(doc => ({
            _id: doc._id,
            participants: doc.participants,
            messages: doc.messages
        }));
        return chat[0];

    } catch (error) {
        return null;
    }
    finally {
        // mongo.close();
    }
}

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
    finally {
        // mongo.close();
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
    finally {
        // mongo.close();
    }
}
export async function getMessages(chatId: string) {

    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        const chat = await getChatById(chatId);
        if (!chat) {
            throw new Error("Chat not found");
        }
        return chat.messages ? chat.messages : [] as Message[];
    } catch (error) {
        throw error;

    } finally {
        // mongo.close();
    }
}



export async function userRegistration(email: string, password: string) {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        const existingUser = await mongo.db(DB_INFO.db).collection(DB_INFO.Users).findOne({ email });
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        return (await mongo.db(DB_INFO.db).collection(DB_INFO.Users).insertOne({ email, password })).insertedId;//TODO: encyption
    } catch (error) {
        throw error;
    } finally {
        // mongo.close();
    }
}
export async function userLogin(email: string, password: string) {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        console.log("userLogin", email, password);

        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Users).findOne({ email, password });//TODO: encyption
        console.log("userLogin", user);

        if (!user) {
            return -1;
        }
        return user._id;
    } catch (error) {
        throw error;
    } finally {
        // mongo.close();
    }
}

