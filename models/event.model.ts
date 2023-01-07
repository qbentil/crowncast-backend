import mongoose, { Schema } from 'mongoose';
const EventSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    banner: {
        type:String,
        required:[true, "Please enter event image"],
    },
    vote_price: {
        type: Number,
        required: [true, 'Vote price is required'],
    },
    votes: {
        type: Number,
        default: 0,
    },
    opening_date: {
        type: Date,
        required: [true, 'Opening date is required'],
    },
    closing_date: {
        type: Date,
        required: [true, 'Closing date is required'],
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'Organizer',
        required: [true, 'Organizer is required'],
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.models['Event'] || mongoose.model('Event', EventSchema);