import { Router } from 'express';
import { createChatCont, getChatByIdCont, getChatByParticipantsCont, getMessagesCont, sendMessageCont, userLoginCont, userRegistrationCont } from './Message.controller';

const chatRouter = Router();

chatRouter
    .post('/newchat', createChatCont)
    .get('/chat/participants', getChatByParticipantsCont)
    .get('/chat/id', getChatByIdCont)
    .get('/messages', getMessagesCont)
    .post('/messages', sendMessageCont)
    .post('/registration', userRegistrationCont)
    .put('/login', userLoginCont)

export default chatRouter