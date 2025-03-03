import mongoose, { Schema } from "mongoose";
import { IRole } from "@interfaces/IEntity";

const roleSchema = new Schema({
    roleId: {
        type: Number,
        require: false,
        unique: true,
        enum: [1, 2]
    },
    roleName: {
        type: String,
        unique: true
    }
})
const Role = mongoose.model<IRole>('Role', roleSchema);
export default Role