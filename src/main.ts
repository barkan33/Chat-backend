import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './Message/Message.routes';
import userRouter from './User/User.routes';
import { connectToDb } from './Message/Message.db';
import verifyToken from './UtilityClass/UtilityFunctions';


dotenv.config();


declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}




const app = express();
const PORT = process.env.PORT || 9999;

// const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com']; //TODO: Check this
// const corsOptions = {
//     origin: function (origin: any, callback: CallableFunction) {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());

app.use('/chats', verifyToken, chatRouter);
app.use('/users', userRouter);

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
})
