import { ObjectId } from "mongodb";
import { getUserByEmail, getUsersByUsername, userLogin, userRegistration, updateAvatar } from "./User.db";
import { User } from "./User.type";

export async function userRegistrationMod(email: string, password: string, username: string, avatarURL: string): Promise<ObjectId | null> {
    return await userRegistration(email, password, username, avatarURL);
}
export async function userLoginMod(email: string, password: string): Promise<ObjectId | undefined> {
    return await userLogin(email, password);
}
export async function getUserByEmailMod(email: string): Promise<User | undefined> {
    return await getUserByEmail(email);
}
export async function getUsersByUsernameMod(email: string): Promise<User[] | undefined> {
    return await getUsersByUsername(email);
}
export async function updateAvatarMod(senderId: string, avatarURL: string) {
    return await updateAvatar(senderId, avatarURL);
}