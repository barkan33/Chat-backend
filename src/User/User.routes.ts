import { Router } from 'express';
import { getUserIdByEmailCont, getUsersByUsernameCont, userLoginCont, userRegistrationCont, updateAvatarCont } from './User.controller';

const userRouter = Router();

//TypeError: Body not allowed for GET or HEAD requests
userRouter
    .post('/registration', userRegistrationCont)
    .put('/login', userLoginCont)
    .put('/get_user', getUserIdByEmailCont)
    .get('/search/:username', getUsersByUsernameCont)
    .put('/:userId/avatar', updateAvatarCont)

export default userRouter