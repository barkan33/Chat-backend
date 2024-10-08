import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
export default verifyToken;

export const encryptPass = async (pass: string) => {
    const hash = crypto.createHash('sha256');
    hash.update(pass);
    const digest = hash.digest('hex');
    return digest;
};