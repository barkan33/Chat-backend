import { Request, Response } from 'express';
import { getMessagesMod, getSenderById, insertMessage } from './Message.model';
import { Message } from './Message.type';
import { ObjectId } from 'mongodb';
export async function getAllMessagesCont(req: Request, res: Response): Promise<void> {
    try {
        const messages: Message[] = await getMessagesMod()
        res.status(200).json({ messages });
    }
    catch (error) {
        res.status(500).json({ error });
    }

}
export async function getBySenderIdCont(req: Request, res: Response) {
    try {
        let senderId: string = req.params.senderId;
        let receiverId: string = req.params.receiverId;

        if (senderId.length != 24)
            return res.status(403).json({ message: 'invalid sender id' });
        if (receiverId.length != 24)
            return res.status(403).json({ message: 'invalid receiver id' });

        let messages = await getSenderById(senderId, receiverId);

        if (!messages)
            res.status(404).json({ message: 'messages not found' });
        else
            res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function sendMessage(req: Request, res: Response) {
    try {
        let senderId: string = req.body.senderId;
        let receiverId: string = req.body.receiverId;
        let content: string = req.body.content;

        if (senderId.length != 24)
            return res.status(403).json({ message: 'invalid sender id' });
        if (receiverId.length != 24)
            return res.status(403).json({ message: 'invalid receiver id' });


        let result = await insertMessage(senderId, receiverId, content, Date.now());

        if (!result.acknowledged)
            res.status(500).json({ message: 'internal server error. please try again' });
        else
            res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error });
    }
}