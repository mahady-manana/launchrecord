import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { IReport } from "./report";
import type { ITopic } from "./topic";
import type { IUser } from "./user";

export interface IProductMetadata {
  source?: string | null;
  sourceId?: string | null;
  sourceUrl?: string | null;
  phVotes?: number | null;
  phComments?: number | null;
  phDayrank?: number | null;
  phReviews?: number | null;
  phRating?: number | null;

  [key: string]: any;
}

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
  earlyAccess?: boolean;
  earlyAccessGrantedAt?: Date | null;
  addedByAdmin?: boolean;
  surveyData?: Record<string, any> | null;
  metadata?: IProductMetadata | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [1, "Product name must be at least 1 characters"],
      maxlength: [100, "Product name must be less than 200 characters"],
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
      maxlength: [80, "Tagline must be less than 80 characters"],
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
      unique: true,
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
    earlyAccess: {
      type: Boolean,
      default: false,
    },
    earlyAccessGrantedAt: {
      type: Date,
      default: null,
    },
    addedByAdmin: {
      type: Boolean,
      default: false,
    },
    surveyData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
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
