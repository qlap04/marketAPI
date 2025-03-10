import { IUser, IRole } from "@interfaces/IEntity";
import User from "@models/user.model";
import Role from "@models/role.model";
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "./auth.service";
import { registerSchema, loginSchema } from "@utils/validator";
import { generateAndSendOtpService } from './otp.service'
const registerUserService = async (username: string, email: string, password: string) => {
    const validation = registerSchema.safeParse({ username, email, password });
    if (!validation.success) {
        console.log(validation.error.errors);
        return {
            success: false,
            message: validation.error.errors.map(err => err.message).join(', ')
        };
    }

    try {
        //Exception
        const exists = await User.findOne({ $or: [{ username }, { email }] });
        if (exists) {
            if (exists.username === username) {
                return { success: false, message: 'Username already exists' };
            } else {
                return { success: false, message: 'Email already exists' };
            }
        }


        const role = await Role.findOne({ roleId: 2 })
        if (!role) return { success: false, message: "Invalid roleId" }; // default role when register:  Role (roleId 2)

        //hashPass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create User
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            roleId: 2
        })

        const user = await newUser.save();

        const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ _id: user._id, roleId: user.roleId });

        return { success: true, data: { access_token: accessToken, refresh_token: refreshToken } };
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}



//Login
const loginUserService = async (username: string, password: string) => {
    const validation = loginSchema.safeParse({ username, password });
    if (!validation.success) return { success: false, message: validation.error.errors[0].message };
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return { success: false, message: 'Invalid Username/Password' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid credentials' };
        }

        const accessToken = await generateAccessToken({ _id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ _id: user._id, roleId: user.roleId });
        if (user.otp && user.otpExpiry && new Date() < user.otpExpiry) {
            return { success: false, data: { access_token: accessToken, refresh_token: refreshToken } };
        } else {
            await generateAndSendOtpService(user.email);
            return { success: false, message: 'OTP sent, please verify your OTP' };
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: 'Server error', status: 500 };
    }
};

const listUserService = async () => {
    try {
        const users = await User.find({});
        return { success: true, data: users };
    } catch (error) {
        return { success: false, message: 'Error fetching users' };
    }
};

// Logout
const logoutUserService = () => {
    return { success: true, message: 'User logged out' };
};

export {
    registerUserService,
    loginUserService,
    listUserService,
    logoutUserService
}