import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    roleId: mongoose.Types.ObjectId;
    otp?: string;
    otpExpiry?: Date;
}

export interface IRole extends Document {
    roleName: string;
    roleId: number; // 1: vendor, 2: user
}

export interface IProduct extends Document {
    title: string;
    description: string;
    category: string;
    image: string;
    quantity: number;
}
