import { Router } from 'express';
import { getAllMessagesCont, getBySenderIdCont, sendMessage } from './Message.controller';

const chatRouter = Router();

chatRouter
    .get('/', getAllMessagesCont)
    .get("/chat/:senderId/:receiverId", getBySenderIdCont)
    .post('/', sendMessage)
// .put('/:id')

export default chatRouter