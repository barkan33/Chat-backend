import { Router } from 'express';
import { createChatCont, getChatsByIdCont, getChatByParticipantsCont, getMessagesCont, sendMessageCont } from './Message.controller';

const chatRouter = Router();

//TypeError: Body not allowed for GET or HEAD requests
chatRouter
    .post('/newchat', createChatCont)
    .post('/chat/participants', getChatByParticipantsCont)
    .get('/', getChatsByIdCont)
    .put('/messages', getMessagesCont)
    .post('/messages', sendMessageCont)

export default chatRouter