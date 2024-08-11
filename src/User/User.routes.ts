import { Router } from 'express';
import { getUserIdByEmailCont, getUsersByUsernameCont, userLoginCont, userRegistrationCont, updateAvatarCont } from './User.controller';
import verifyToken from '../UtilityClass/UtilityFunctions';


const userRouter = Router();

//TypeError: Body not allowed for GET or HEAD requests
userRouter
    .post('/registration', userRegistrationCont)
    .put('/login', userLoginCont)
    .put('/get_user', getUserIdByEmailCont)
    .get('/search/:username', getUsersByUsernameCont)
    .put('/avatar', verifyToken, updateAvatarCont)

export default userRouter