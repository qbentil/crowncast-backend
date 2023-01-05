import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
    title: {
        type: String,
        required: [true, "Enter category title"]
    },
    description: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true })

export default mongoose.models["Category"] || mongoose.model("Category", CategorySchema)
