import { NextFunction, Request, Response } from 'express';
import { Chat, Message } from './Message.type';
import { ObjectId } from 'mongodb';
import { createChatMod, getChatByParticipantsMod, getChatsByIdMod, getMessagesMod, sendMessageMod } from './Message.model';

export async function createChatCont(req: Request, res: Response) {

    const { receiverId } = req.body
    const senderId = req.userId; // Получение userId из объекта запроса
    if (!senderId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        if (!senderId || !receiverId)
            return res.status(400).json({ message: 'senderId and receiverId are required to create chat' });
        else {
            const chatId = await createChatMod(senderId, receiverId);
            res.status(201).json({ chatId });
        }
    }
    catch (error) {
        res.status(500).json({ error: "createChatCont:" + error });
    }
}
export async function getChatByParticipantsCont(req: Request, res: Response) {
    try {
        const { receiverId } = req.body
        const senderId = req.userId; // Получение userId из объекта запроса
        if (!senderId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!receiverId)
            return res.status(400).json({ message: 'senderId and receiverId are required to get chat' });
        else {
            const chatId = await getChatByParticipantsMod([new ObjectId(senderId), new ObjectId(receiverId)]);
            if (!chatId)
                res.status(404).json({});
            res.status(200).json({ chatId });
        }
    }
    catch (error) {
        res.status(500).json({ error: "getChatByParticipantsCont" + error });
    }
}

export async function getChatsByIdCont(req: Request, res: Response) {

    try {
        const senderId = req.userId; // Получение userId из объекта запроса
        if (!senderId)
            return res.status(401).json({ message: 'Unauthorized' });

        const chatIds: Chat[] | null = await getChatsByIdMod(senderId);
        res.status(200).json({ chatIds });

    }
    catch (error) {
        res.status(500).json({ error: "getChatByIdCont" + error });
    }
}

export async function sendMessageCont(req: Request, res: Response) {
    try {
        const { chatId, content } = req.body
        const senderId = req.userId; // Получение userId из объекта запроса
        if (!senderId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!chatId || !content || !senderId)
            return res.status(400).json({ message: 'chatId, content and senderId are required to send message' });

        if (chatId.length != 24)
            return res.status(403).json({ message: 'invalid chat id' });
        if (senderId.length != 24)
            return res.status(403).json({ message: 'invalid sender id' });

        else {
            await sendMessageMod(chatId, senderId, content, Date.now());
            res.status(201).json({ message: 'message sent successfully' });

        }
    }
    catch (error) {
        res.status(500).json({ error: "sendMessageCont" + error });
    }
}
export async function getMessagesCont(req: Request, res: Response) {
    try {
        const chatId: string = req.body.chatId;
        //add userId
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
