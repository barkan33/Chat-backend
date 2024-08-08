import dotenv from 'dotenv';
import { MongoClient, ObjectId } from "mongodb";
import MongoConnection from '../UtilityClass/MongoConnection';
import { User } from './User.type';
dotenv.config();

const DB_INFO = {
    db: process.env.DB_NAME,
    Users: "Users"
}

let mongo: MongoClient = MongoConnection.getInstance().getMongoClient();

export async function userRegistration(email: string, password: string, username: string): Promise<ObjectId | null> {
    console.log("userRegistration");
    console.log(mongo);

    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        const existingUser = await mongo.db(DB_INFO.db).collection(DB_INFO.Users).findOne({ email });
        if (existingUser) {
            return null
        }
        return (await mongo.db(DB_INFO.db).collection(DB_INFO.Users).insertOne({ email, password, username })).insertedId;
    } catch (error) {
        throw error;
    } finally {
        // mongo.close();
    }
}
export async function userLogin(email: string, password: string): Promise<ObjectId | undefined> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        const user = await mongo.db(DB_INFO.db).collection(DB_INFO.Users).findOne({ email, password });

        return user?._id;
    } catch (error) {
        throw error;
    } finally {
        // mongo.close();
    }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        const user: User[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Users).find({ email: email }).toArray()).map(doc => ({
            _id: doc._id,
            email: doc.email as string,
            username: doc.username as string
        }));
        return user[0];
    } catch (error) {
        throw error;
    } finally {
        // mongo.close();
    }
}
export async function getUsersByUsername(username: string): Promise<User[] | undefined> {
    if (!mongo) {
        throw new Error("Database is not connected");
    }
    try {
        console.log("username", username);

        const users: User[] = (await mongo.db(DB_INFO.db).collection(DB_INFO.Users).find({ username: { $regex: `${username}`, $options: 'i' } }).toArray()).map(doc => ({
            _id: doc._id,
            email: doc.email as string,
            username: doc.username as string
        }));
        console.log("users", users);

        return users;
    } catch (error) {
        throw error;
    } finally {
        // mongo.close();
    }
}
