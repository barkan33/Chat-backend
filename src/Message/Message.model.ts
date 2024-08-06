import { ObjectId } from "mongodb";
import { Message } from "./Message.type";
import { createChat, getChatById, getChatByParticipants, getChatsByQuery, getMessages, sendMessage, userLogin, userRegistration } from "./Message.db";

export async function createChatMod(senderId: string, receiverId: string) {
    return await createChat(senderId, receiverId);
}
export async function getChatByParticipantsMod(participants: ObjectId[]) {
    return await getChatByParticipants(participants);
}
export async function getChatByIdMod(chatId: string) {
    return await getChatById(chatId);
}
export async function getChatsByQueryMod(query: string, projection: string) {
    return await getChatsByQuery(query, projection);
}

export async function sendMessageMod(chatId: string, senderId: string, content: string, createdAt: number) {
    let message: Message = { _id: new ObjectId(), senderId: new ObjectId(senderId), content, createdAt };
    return await sendMessage(chatId, message);
}
export async function getMessagesMod(chatId: string) {
    return await getMessages(chatId);
}

export async function userRegistrationMod(email: string, password: string) {
    try {
        return await userRegistration(email, password);
    }
    catch (error) {
        throw error;
    }
}
export async function userLoginMod(email: string, password: string) {
    console.log("userLoginMod", email, password);

    return await userLogin(email, password);
}