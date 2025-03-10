import express from 'express';
import {
    registerController,
    loginController,
    verifyOtpController,
    refreshTokenController,
    logoutController,
    listUserController
} from '../controllers/auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';

const authRouter = express.Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/verify-otp', verifyOtpController);
authRouter.post('/refresh-token', refreshTokenController);
authRouter.post('/logout', authMiddleware, logoutController);
authRouter.get('/list-user', authMiddleware, listUserController);

export default authRouter;