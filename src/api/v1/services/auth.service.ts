import { IUser } from "../interfaces/IEntity";
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} from "@/config/index.config";
import User from "@models/user.model";

//generate AccessToken
const generateAccessToken = (data: Partial<IUser>) => {
    return jwt.sign(
        { id: data._id, roleId: data.roleId },
        JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
    );
};

//generate Refresh Token
const generateRefreshToken = (data: Partial<IUser>) => {
    return jwt.sign(
        { id: data._id, roleId: data.roleId },
        JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
};

// refresh Token Service
const refreshTokenService = async (refreshToken: string) => {
    try {
        if (!refreshToken) {
            return { success: false, message: "Refresh token is required" };
        }
        
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as jwt.JwtPayload
        const user = await User.findById(decoded.id);

        if (!user) {
            return { success: false, message: 'Invalid refresh token', status: 401 };
        }

        const newAccessToken = generateAccessToken(user);
        return { success: true, access_token: newAccessToken };

    } catch (error) {
        console.error('Error refreshing token:', error);
        return { success: false, message: 'Invalid refresh token', status: 401 };
    }
};

export {
    generateAccessToken,
    generateRefreshToken,
    refreshTokenService
}