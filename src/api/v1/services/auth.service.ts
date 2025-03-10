import { IUser } from "@interfaces/IEntity";
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "@/config/index.config";
import User from "@models/user.model";
import Role from "@models/role.model";
import { refreshTokenSchema } from "@utils/validator"
import { Response } from "express";

//generate AccessToken
const generateAccessToken = async (data: Partial<IUser>) => {
    const role = await Role.findOne({ roleId: data.roleId });
    if (!role) {
        return { success: false, message: 'The role not found.' };
    }
    return jwt.sign(
        { id: data._id, roleId: data.roleId },
        JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
    );
};

//generate Refresh Token
const generateRefreshToken = async (data: Partial<IUser>) => {
    const role = await Role.findOne({ roleId: data.roleId });
    if (!role) {
        return { success: false, message: 'The role not found.' };
    }
    return jwt.sign(
        { id: data._id, roleId: data.roleId },
        JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
};

// refresh Token Service
const refreshTokenService = async (refreshToken: string) => {

    const tokenValidation = refreshTokenSchema.safeParse({ refresh_token: refreshToken })
    if (!tokenValidation.success) return {
        success: false, message: tokenValidation.error.errors[0].message
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; roleId: number };
        const user = await User.findById(decoded.id);
        if (!user) return { success: false, message: 'User not found' };

        const newAccessToken = await generateAccessToken(user)
        return { success: true, access_token: newAccessToken };
    } catch (error) {
        return { success: false, message: 'Invalid refresh token', status: 401 };
    }
};



export {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenService
}