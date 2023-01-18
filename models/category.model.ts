import mongoose, { Schema } from "mongoose";
import { ICategory } from "../types";

const CategorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: [true, "Enter category title"],
    },
    description: {
      type: String,
      default: null,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models["Category"] ||
  mongoose.model("Category", CategorySchema);
