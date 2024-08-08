import { Router } from 'express';
import { createChatCont, getChatsByIdCont, getChatByParticipantsCont, getMessagesCont, sendMessageCont } from './Message.controller';

const chatRouter = Router();

//TypeError: Body not allowed for GET or HEAD requests
chatRouter
    .post('/newchat', createChatCont)
    .post('/chat/participants', getChatByParticipantsCont)
    .get('/chats', getChatsByIdCont)
    .post('/get_chat', getMessagesCont)
    .post('/messages', sendMessageCont)

export default chatRouter