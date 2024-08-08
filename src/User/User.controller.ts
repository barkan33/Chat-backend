import { Request, Response } from 'express';
import { getUserByEmailMod, userLoginMod, userRegistrationMod } from './User.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your_secret_key';


export async function userRegistrationCont(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const insertedId: ObjectId | null = await userRegistrationMod(email, password);

        if (!insertedId)
            return res.status(409).json({ message: 'User with this email already exists' });

        const token = jwt.sign({ userId: insertedId }, secretKey, { expiresIn: '1h' });
        res.status(201).json({ token });
        console.log("User registered successfully");

    }
    catch (error) {
        res.status(500).json({ From: 'userRegistrationCont', error });
    }
}
export async function userLoginCont(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });


        const userId = await userLoginMod(email, password);

        if (!userId)
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token });

    }
    catch (error) {
        res.status(500).json({ From: "userLoginCont", error });
    }
}
export async function getUserIdByEmailCont(req: Request, res: Response) {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: 'Email is required' });

        const userId = await getUserByEmailMod(email);
        if (!userId)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ userId });
    }
    catch (error) {
        res.status(500).json({ From: "getUserIdByEmailCont", error });
    }
}

