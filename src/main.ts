import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './Message/Message.routes';
import userRouter from './User/User.routes';
import { connectToDb } from './Message/Message.db';
import jwt from 'jsonwebtoken';


dotenv.config();


declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}

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
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;

const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com'];
const corsOptions = {
    origin: function (origin: any, callback: CallableFunction) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/chat_system', verifyToken, chatRouter);
app.use('/user_system', userRouter);

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
})
