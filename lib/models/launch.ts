import { BUSINESS_MODELS, LAUNCH_CATEGORIES, PRICING_MODELS } from "@/types";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILaunch extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logoUrl?: string;
  tagline: string;
  description: string;
  website: string;
  category:
    | (typeof LAUNCH_CATEGORIES)[number]
    | (typeof LAUNCH_CATEGORIES)[number][];
  valueProposition: string;
  problem: string;
  audience: string;
  businessModel: (typeof BUSINESS_MODELS)[number];
  pricingModel: (typeof PRICING_MODELS)[number];
  status: "draft" | "prelaunch" | "launched";
  submittedBy: mongoose.Types.ObjectId;
  placement: "none" | "hero" | "left" | "right";
  isArchived: boolean;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LaunchSchema = new Schema<ILaunch>(
  {
    name: {
      type: String,
      required: [true, "Launch name is required"],
      minlength: [2, "Launch name must be at least 2 characters"],
      maxlength: [100, "Launch name must be less than 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-z0-9_-]+$/,
        "Slug can only contain letters, numbers, hyphens, and underscores",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1200, "Description must be less than 1200 characters"],
    },
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      minlength: [4, "Tagline must be at least 4 characters"],
      maxlength: [140, "Tagline must be less than 140 characters"],
      trim: true,
    },
    logoUrl: {
      type: String,
      maxlength: [300, "Logo URL must be less than 300 characters"],
      trim: true,
    },
    website: {
      type: String,
      required: [true, "Website is required"],
      trim: true,
    },
    category: {
      type: Schema.Types.Mixed,
      required: [true, "Category is required"],
      index: true,
      validate: {
        validator: function (value: any) {
          // Allow either a single category or an array of up to 3 categories
          if (Array.isArray(value)) {
            if (value.length > 3) return false;
            return value.every((cat) => LAUNCH_CATEGORIES.includes(cat));
          }
          return LAUNCH_CATEGORIES.includes(value);
        },
        message: "Invalid category or too many categories (maximum 3)",
      },
    },
    valueProposition: {
      type: String,
      default: "",
      maxlength: [220, "Value proposition must be less than 220 characters"],
      trim: true,
    },
    problem: {
      type: String,
      default: "",
      maxlength: [600, "Problem must be less than 600 characters"],
      trim: true,
    },
    audience: {
      type: String,
      default: "",
      maxlength: [220, "Audience must be less than 220 characters"],
      trim: true,
    },
    businessModel: {
      type: String,
      enum: BUSINESS_MODELS,
      required: [true, "Business model is required"],
      index: true,
    },
    pricingModel: {
      type: String,
      enum: PRICING_MODELS,
      required: [true, "Pricing model is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "prelaunch", "launched"],
      default: "draft",
      index: true,
    },
    placement: {
      type: String,
      enum: ["none", "hero", "left", "right"],
      default: "none",
      index: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

LaunchSchema.index({
  name: "text",
  tagline: "text",
  description: "text",
  valueProposition: "text",
  problem: "text",
  audience: "text",
  category: "text",
});

const Launch: Model<ILaunch> =
  mongoose.models.Launch || mongoose.model<ILaunch>("Launch", LaunchSchema);

export default Launch;
