import e, { Request, Response } from 'express';
import { Message } from './Message.type';
import { ObjectId } from 'mongodb';
import { createChatMod, getChatByIdMod, getChatByParticipantsMod, getChatsByQueryMod, getMessagesMod, sendMessageMod, userLoginMod, userRegistrationMod } from './Message.model';


export async function createChatCont(req: Request, res: Response) {

    let senderId: string = req.body.senderId;
    let receiverId: string = req.body.receiverId;
    try {
        if (!senderId || !receiverId)
            return res.status(400).json({ message: 'senderId and receiverId are required to create chat' });
        else {
            let chatId = await createChatMod(senderId, receiverId);
            res.status(201).json({ chatId });
        }
    }
    catch (error) {
        res.status(500).json({ error: "createChatCont:" + error });
    }
}
export async function getChatByParticipantsCont(req: Request, res: Response) {
    try {
        let senderId: string = req.body.senderId;
        let receiverId: string = req.body.receiverId;
        if (!senderId || !receiverId)
            return res.status(400).json({ message: 'senderId and receiverId are required to get chat' });
        else {
            let chatId = await getChatByParticipantsMod([new ObjectId(senderId), new ObjectId(receiverId)]);
            res.status(201).json({ chatId });
        }
    }
    catch (error) {
        res.status(500).json({ error: "getChatByParticipantsCont" + error });
    }
}

export async function getChatByIdCont(req: Request, res: Response) {
    try {
        let chatId: string = req.body.chatId;
        if (!chatId)
            return res.status(400).json({ message: 'chatId is required to get chat' });
        else {
            let messages = await getChatByIdMod(chatId);
            res.status(200).json({ messages });
        }
    }
    catch (error) {
        res.status(500).json({ error: "getChatByIdCont" + error });
    }
}

export async function sendMessageCont(req: Request, res: Response) {
    try {
        let chatId: string = req.body.chatId;
        let senderId: string = req.body.senderId;
        let receiverId: string = req.body.receiverId;
        let content: string = req.body.content;
        if (!chatId || !content || !senderId || !receiverId)
            return res.status(400).json({ message: 'chatId, content and senderId are required to send message' });

        if (chatId.length != 24)
            return res.status(403).json({ message: 'invalid chat id' });
        if (senderId.length != 24)
            return res.status(403).json({ message: 'invalid sender id' });
        if (receiverId.length != 24)
            return res.status(403).json({ message: 'invalid receiver id' });

        else {
            await sendMessageMod(chatId, senderId, receiverId, content, Date.now());
            res.status(201).json({ message: 'message sent successfully' });

        }
    }
    catch (error) {
        res.status(500).json({ error: "sendMessageCont" + error });
    }
}
export async function getMessagesCont(req: Request, res: Response) {
    try {
        let chatId: string = req.body.chatId;
        if (!chatId)
            return res.status(400).json({ message: 'chatId is required to get messages' });
        else {
            let messages: Message[] = await getMessagesMod(chatId);
            if (!messages)
                return res.status(404).json({ message: 'messages not found' });
            messages.sort((a: Message, b: Message) => {

                if (a.createdAt < b.createdAt)
                    return -1;
                if (a.createdAt > b.createdAt)
                    return 1;
                return 0;
            });
            res.status(200).json({ messages });
        }
    }
    catch (error) {
        res.status(500).json({ error: "getMessagesCont" + error });
    }

}

export async function userRegistrationCont(req: Request, res: Response) {
    try {
        let email: string = req.body.email;
        let password: string = req.body.password;
        if (!email || !password)
            return res.status(400).json({ message: 'email and password are required' });
        else {
            let insertedId = await userRegistrationMod(email, password);
            res.status(201).json({ _id: insertedId });
            console.log("User registered successfully");
        }
    }
    catch (error) {
        res.status(500).json({ From: 'Error registering user', error });
    }
}
export async function userLoginCont(req: Request, res: Response) {
    try {
        let email: string = req.body.email;
        let password: string = req.body.password;
        console.log("userLoginCont", email, password);

        if (!email || !password)
            return res.status(400).json({ message: 'email and password are required' });
        else {
            let userId = await userLoginMod(email, password);
            if (userId === -1)
                return res.status(401).json({ message: 'Invalid email or password' });
            res.status(200).json({ userId, message: 'User logged in successfully' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
}