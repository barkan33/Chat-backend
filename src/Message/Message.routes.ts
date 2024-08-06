import { Router } from 'express';
import { createChatCont, getChatByIdCont, getChatByParticipantsCont, getMessagesCont, sendMessageCont, userLoginCont, userRegistrationCont } from './Message.controller';

const chatRouter = Router();

//TypeError: Body not allowed for GET or HEAD requests
chatRouter
    .post('/newchat', createChatCont)
    .post('/chat/participants', getChatByParticipantsCont)
    .get('/chat/:id', getChatByIdCont)
    .post('/get_chat', getMessagesCont)
    .post('/messages', sendMessageCont)
    .post('/registration', userRegistrationCont)
    .put('/login', userLoginCont)

export default chatRouter