import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    avatar: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    phone: {
        type: String,
    },
    token: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }

}, { timestamps: true });

export default mongoose.models["User"] || mongoose.model("User", UserSchema);