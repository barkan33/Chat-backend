import { Request, Response } from 'express';
import { getUserByEmailMod, getUsersByUsernameMod, userLoginMod, userRegistrationMod } from './User.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
dotenv.config();

const secretKey = process.env.JWT_SECRET || 'your_secret_key';


export async function userRegistrationCont(req: Request, res: Response) {
    try {
        console.log("userRegistrationCont START");

        const { email, password, username, avatarURL } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const insertedId: ObjectId | null = await userRegistrationMod(email, password, username);

        if (!insertedId)
            return res.status(409).json({ message: 'User with this email already exists' });

        const token = jwt.sign({ userId: insertedId }, secretKey, { expiresIn: '1h' });
        res.status(201).json({ token, insertedId });
        console.log("User registered successfully");

    }
    catch (error) {
        res.status(500).json({ From: 'userRegistrationCont', error });
    }
    finally {
        console.log("userRegistrationCont END");
    }
}
export async function userLoginCont(req: Request, res: Response) {
    try {
        console.log("userLoginCont START");

        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });


        const userId = await userLoginMod(email, password);

        if (!userId)
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ token, userId });

    }
    catch (error) {
        res.status(500).json({ From: "userLoginCont", error });
    }
    finally {
        console.log("userLoginCont END");
    }
}
export async function getUserIdByEmailCont(req: Request, res: Response) {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: 'Email is required' });

        const user = await getUserByEmailMod(email);
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ From: "getUserIdByEmailCont", error });
    }

}
export async function getUsersByUsernameCont(req: Request, res: Response) {
    try {
        console.log("getUsersByUsernameCont START");

        let username = (req.params.username);
        console.log("username", req.params.usernames);

        if (!username)
            return res.status(400).json({ message: 'Username is required' });

        const users = await getUsersByUsernameMod(username);

        res.status(200).json({ users });

    }
    catch (error) {
        res.status(500).json({ From: "getUsersByUsernameCont", error });
    }
    finally {
        console.log("getUsersByUsernameCont END");
    }
}
