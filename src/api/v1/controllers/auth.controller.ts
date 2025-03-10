import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenService
} from '@services/auth.service'
import {
    registerUserService,
    loginUserService,
    listUserService,
    logoutUserService
} from '@services/user.service';
import {
    sendOtpEmail,
    generateAndSendOtpService,
    verifyOtpService,
} from '@services/otp.service'

const registerController = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body
        const response = await registerUserService(username, email, password)
        if (response.success) {
            res.cookie('accessToken', response.data.access_token,
                {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 2
                });

            res.cookie('refreshToken', response.data.refresh_token,
                {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 2
                });
            res.status(200).json(response);
            return
        }

    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

const loginController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const response = await loginUserService(username, password);

        if (response.success) {
            res.cookie('accessToken', response.data.access_token,
                {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 2
                });

            res.cookie('refreshToken', response.data.refresh_token,
                {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 2
                });
            res.status(200).json(response);
            return
        }
        res.status(401).json(response);
        return
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
}

const listUserController = async (req: Request, res: Response) => {
    try {
        const response = await listUserService();
        res.status(200).json(response);
        return
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

const logoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        const response = await logoutUserService();
        res.status(200).json(response);
        return
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};



// Auth
const refreshTokenController = async (req: Request, res: Response) => {
    console.log('Cookies:', req.cookies);
    const { refreshToken } = req.cookies;
    const response = await refreshTokenService(refreshToken);

    if (response.success) {
        res.cookie('accessToken', response.access_token,
            {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 60 * 60 * 2,
                path: '/'

            });

        res.status(200).json(response);
        return
    }
    res.status(401).json(response);
    return
};


const verifyOtpController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const result = await verifyOtpService(email, otp);
        if (!result.success) {
            res.status(result.status || 400).json(result);
            return;
        }
        const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ _id: user._id, roleId: user.roleId });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 2,
            path: '/'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 60 * 60 * 2,
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: 'OTP verified and tokens generated',
            data: { access_token: accessToken, refresh_token: refreshToken }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};
export {
    registerController,
    loginController,
    listUserController,
    logoutController,
    verifyOtpController,
    refreshTokenController
}
