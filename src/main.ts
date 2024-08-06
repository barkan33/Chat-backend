import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './Message/Message.routes';
import { connectToDb } from './Message/Message.db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;

app.use(cors());
app.use(express.json());

app.use('/chat_system', chatRouter);

connectToDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
})

// app.listen(PORT, () => {
//     console.log(`Сервер запущен на порту ${PORT}`);
// });
