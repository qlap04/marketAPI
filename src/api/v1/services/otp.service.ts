import User from '@models/user.model';
import nodemailer from 'nodemailer';
import { OTP_EXPIRY, EMAIL_MAIN, EMAIL_PASSWORD } from '@config/index.config';

const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email OTP 
const sendOtpEmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_MAIN,
            pass: EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: EMAIL_MAIN,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP is ${otp}. It expires in ${OTP_EXPIRY} seconds.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

// OTP Service
const generateAndSendOtpService = async (email: string) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return { success: false, message: 'User not found', status: 404 };
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY * 1000);

        //update value into DB
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP email
        await sendOtpEmail(user.email, otp);

        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error generating and sending OTP:', error);
        return { success: false, message: error.message || 'Server error', status: 500 };
    }
};

// Verify OTP
const verifyOtpService = async (email: string, otp: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: 'User not found', status: 404 };
        }

        if (user.otp !== otp) {
            return { success: false, message: 'Invalid OTP', status: 400 };
        }

        if (new Date() > user.otpExpiry!) {
            return { success: false, message: 'OTP expired', status: 400 };
        }

        // Delete and set expiry
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return { success: true, data: { id: user._id, username: user.username } };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: error.message || 'Server error', status: 500 };
    }
};

export {
    sendOtpEmail,
    generateAndSendOtpService,
    verifyOtpService,
};
