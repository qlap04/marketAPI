import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IEntity";

const userSchema: Schema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date
    },
}, { minimize: false })

const User = mongoose.model<IUser>('User', userSchema)
export default User