import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";
import { Chat, Message } from "./Message.type";
import MongoConnection from '../UtilityClass/MongoConnection';
dotenv.config();

const DB_INFO = {
    db: process.env.DB_NAME,
    Chats: "Chats",
    Messages: "Messages"
}

let mongo: MongoClient;

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
        const chat: Chat[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Chats).find({ participants: { $in: [new ObjectId(senderId)] } }).toArray()).map(doc => ({
            _id: doc._id,
            participants: doc.participants,
            messages: doc.messages
        }));
        return chat;

    } catch (error) {
        return null;
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


