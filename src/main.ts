import 'dotenv/config'; // apply env vars
import express from 'express';
import chatRouter from './Message/Message.routes';
import cors from 'cors';
import { connectToDb } from './Message/Message.db';

const http = require('http');
const socketIo = require('socket.io');


//config
//process.env.PORT --> the live server port
const PORT = process.env.PORT || 9876;

//create the server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

//using routes
app.use('/chat', chatRouter);

const usersSockets = new Map();

io.on('connection', (socket: any) => {
    console.log('A user connected');

    socket.on('join', (userId: any) => {
        usersSockets.set(userId, socket);
    });

    socket.on('message', (message: any) => {
        console.log('New message:', message);
        const receiverSocket = usersSockets.get(message.receiverId);
        if (receiverSocket) {
            receiverSocket.emit('message', message);
        }
    });

    socket.on('disconnect1', () => {
        console.log('A user disconnected');
        usersSockets.delete(socket.id);
        // for (const [userId, userSocket] of usersSockets) {
        //     if (userSocket === socket) {
        //         usersSockets.delete(userId);
        //         break;
        //     }
        // }
    });
});

//run the server
connectToDb().then(() => {
    app.listen(PORT, () => console.log(`[Server] http://localhost:${PORT}`));
});