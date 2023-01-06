import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    phone: {
        type: String,
        // required: [true, "Phone is required"],
    },
})

const OrganizerSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
    },
    company: {
        type: CompanySchema,
        required: [true, "Company is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    address: {
        type: String,
    },
    token: {
        type: String,
        default: null
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.models["Organizer"] || mongoose.model("Organizer", OrganizerSchema);

