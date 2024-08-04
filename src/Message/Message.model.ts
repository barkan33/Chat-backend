import { ObjectId } from "mongodb";
import { addMessage, getMessages, updateDoc } from "./Message.db";
import { Message } from "./Message.type.js";
export async function getMessagesMod(): Promise<Message[]> {

    const msg: Message[] = await getMessages();
    return msg;
}

export async function getSenderById(senderId: string, receiverId: string) {
    let query = { sender: new ObjectId(senderId), receiver: new ObjectId(receiverId) }
    let [message] = await getMessages(query);
    if (!message) {
        return null;
    }
    return message;
}

export async function insertMessage(senderId: string, receiverId: string, content: string, createdAt: number) {
    let message: Message = { sender: new ObjectId(senderId), receiver: new ObjectId(receiverId), content, createdAt };
    return await addMessage(message);
}

// export async function update(id: string, content: string,) {

//     return await updateDoc(id, content);
// }
