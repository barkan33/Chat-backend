import { Router } from 'express';
import { getUserIdByEmailCont, userLoginCont, userRegistrationCont } from './User.controller';

const userRouter = Router();

//TypeError: Body not allowed for GET or HEAD requests
userRouter
    .post('/registration', userRegistrationCont)
    .put('/login', userLoginCont)
    .put('/get_user', getUserIdByEmailCont)

export default userRouter