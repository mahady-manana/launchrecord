import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { IReport } from "./report";
import type { ITopic } from "./topic";
import type { IUser } from "./user";

export interface IProduct extends Document {
  name: string;
  description?: string | null;
  tagline?: string | null;
  logo?: string | null;
  website?: string | null;
  user?: Types.ObjectId | IUser | null;
  topics?: ITopic[];
  reports?: Types.ObjectId[] | IReport[];
  score?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [200, "Product name must be less than 200 characters"],
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: [2000, "Description must be less than 2000 characters"],
    },
    tagline: {
      type: String,
      default: null,
      trim: true,
      maxlength: [200, "Tagline must be less than 200 characters"],
    },
    logo: {
      type: String,
      default: null,
      trim: true,
    },
    website: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    topics: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        default: [],
      },
    ],
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report",
        default: [],
      },
    ],
    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true },
);

ProductSchema.index({ name: 1 });
ProductSchema.index({ user: 1 });
ProductSchema.index({ score: 1 });
ProductSchema.index({ topics: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
