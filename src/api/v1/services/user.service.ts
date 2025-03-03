import { IUser, IRole } from "@interfaces/IEntity";
import User from "@models/user.model";
import Role from "@models/role.model";
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "./auth.service";


const registerUserService = async (username: string, gmail: string, password: string, roleId: number) => {
    try {
        //Exception
        const exists = await User.findOne({ userName: username });
        if (exists) {
            return { success: false, message: 'User already exists' };
        }
        const existsGmail = await User.findOne({ email: gmail });
        if (existsGmail) {
            return { success: false, message: 'User already exists' };
        }

        const role = await Role.findOne({ roleId: roleId })
        if (!role) return { success: false, message: "Invalid roleId" }; // default role: user (roleId 2)

        //hashPass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create User
        const newUser = new User({
            userName: username,
            email: gmail,
            password: hashedPassword,
            roleId: role._id
        })

        const user = await newUser.save();

        const accessToken = await generateAccessToken({ id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ id: user._id, roleId: user.roleId });

        return { success: true, data: { access_token: accessToken, refresh_token: refreshToken } };
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}



//Login
const loginUserService = async (username: string, password: string) => {
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return { success: false, message: 'Invalid Username/Password' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid credentials' };
        }

        const accessToken = await generateAccessToken({ id: user._id, roleId: user.roleId });
        const refreshToken = await generateRefreshToken({ id: user._id, roleId: user.roleId });

        const role = await Role.findOne({ _id: user.roleId })

        if (role.roleId !== 1) { // User (roleId = 2)
            return { success: true, data: { access_token: accessToken, refresh_token: refreshToken } };
        } else { // Vendor (roleId = 1)
            return { success: true, data: { access_token: accessToken, refresh_token: refreshToken, roleId: role.roleId } };
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: 'Server error', status: 500 };
    }
};


// Logout
const logoutUserService = () => {
    return { success: true, message: 'User logged out' };
};