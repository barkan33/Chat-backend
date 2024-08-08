import { MongoClient } from "mongodb";
export default class MongoConnection {
    private static _instance: MongoConnection;
    private mongo: MongoClient;
    private constructor() {
        this.mongo = new MongoClient(process.env.CONNECTION_STRING as string);
    }

    public static getInstance(): MongoConnection {
        if (!MongoConnection._instance) {
            MongoConnection._instance = new MongoConnection();
        }
        return MongoConnection._instance;
    }

    public getMongoClient(): MongoClient { return this.mongo }

}