import { Request, Response } from 'express';
import { generateAndSendOtpService, verifyOtpService } from '@services/otp.service';

export const sendOtpController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return
        }
        const result = await generateAndSendOtpService(email);
        if (result.success) {
            res.status(200).json(result);
            return
        } else {
            res.status(result.status || 400).json(result);
            return
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
        return
    }
};

export const verifyOtpController = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ success: false, message: 'Email and OTP are required' });
            return
        }
        const result = await verifyOtpService(email, otp);
        if (result.success) {
            res.status(200).json(result);
            return
        } else {
            res.status(result.status || 400).json(result);
            return
        }
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
        return
    }
};