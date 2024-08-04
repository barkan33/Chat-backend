import { MongoClient, ObjectId } from "mongodb";
import { Message } from "./Message.type";

const DB_INFO = {
    host: process.env.CONNECTION_STRING as string,
    db: process.env.DB_NAME,
    collection: 'Chats'
}
let mongo: MongoClient;

export async function connectToDb() {
    mongo = new MongoClient(DB_INFO.host);
    await mongo.connect();
}
export async function getMessages(query = {}, projection = {}): Promise<Message[]> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        await mongo.connect();
        const messages: Message[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.collection).find(query, { projection }).sort({ createdAt: -1 }).toArray()).map(doc => ({
            _id: doc._id,
            sender: doc.sender,
            receiver: doc.receiver,
            content: doc.content,
            createdAt: doc.createdAt,
        }));
        return messages

    } catch (error) {
        throw error;
    }
    finally {
        mongo.close();
    }
}

export async function addMessage(message: Message) {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).insertOne(message);
    } catch (error) {
        throw error;
    }
    finally {
        mongo.close();
    }
}

export async function updateDoc(id: string, message: Message) {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).updateOne(
            { _id: new ObjectId(id) },
            { $set: message }
        );
    } catch (error) {
        throw error;
    }
    finally {
        mongo.close();
    }
}

export async function getDocCount(query = {}) {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        await mongo.connect();
        return await mongo.db(DB_INFO.db).collection(DB_INFO.collection).countDocuments(query);
    } catch (error) {
        throw error;
    }
    finally {
        mongo.close();
    }
}

