import { ObjectId } from "mongodb";
import { getUserByEmail, userLogin, userRegistration } from "./User.db";
import { User } from "./User.type";

export async function userRegistrationMod(email: string, password: string): Promise<ObjectId | null> {
    return await userRegistration(email, password);
}
export async function userLoginMod(email: string, password: string): Promise<ObjectId | undefined> {
    return await userLogin(email, password);
}
export async function getUserByEmailMod(email: string): Promise<User | undefined> {
    return await getUserByEmail(email);
}