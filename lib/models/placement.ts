import { PLACEMENT_POSITIONS, PLACEMENT_TYPES } from "@/types/placement";
import mongoose, { Document, Model, Schema } from "mongoose";

// Define the constants in the model file as well
const PLACEMENT_TYPES_ARRAY = ["featured", "sidebar"] as const;
const PLACEMENT_POSITIONS_ARRAY = ["hero", "left", "right"] as const;

export interface IPlacement extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  tagline: string;
  logoUrl?: string;
  backgroundImage?: string;
  website: string;
  placementType: (typeof PLACEMENT_TYPES)[number];
  position?: (typeof PLACEMENT_POSITIONS)[number];
  startDate: Date;
  endDate: Date;
  price: number;
  status: "active" | "inactive" | "expired";
  userId: mongoose.Types.ObjectId;
  launchId?: mongoose.Types.ObjectId;
  paymentIntentId?: string;
  paymentStatus: "draft" | "pending" | "paid" | "failed" | "refunded";
  codeName: string;
  appName: string;
  duration: number; // Duration in days
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlacementSchema = new Schema<IPlacement>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [100, "Title must be less than 100 characters"],
    },

    appName: {
      type: String,
      maxlength: [100, "Title must be less than 100 characters"],
    },

    tagline: {
      type: String,
      maxlength: [140, "Tagline must be less than 140 characters"],
    },
    logoUrl: {
      type: String,
      maxlength: [300, "Logo URL must be less than 300 characters"],
    },
    backgroundImage: {
      type: String,
      maxlength: [300, "Background image URL must be less than 300 characters"],
    },
    website: {
      type: String,
    },
    placementType: {
      type: String,
      enum: PLACEMENT_TYPES_ARRAY,
    },
    position: {
      type: String,
      enum: PLACEMENT_POSITIONS_ARRAY,
    },
    startDate: {
      type: Date,
      index: true,
    },
    endDate: {
      type: Date,
    },
    price: {
      type: Number,
      min: [0, "Price must be positive"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "inactive",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    launchId: {
      type: Schema.Types.ObjectId,
      ref: "Launch",
    },
    paymentIntentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["draft", "pending", "paid", "failed", "refunded"],
      default: "draft",
    },
    codeName: {
      type: String,
    },
    duration: {
      type: Number,
      min: [1, "Duration must be at least 1 day"],
    },
    color: {
      type: String,
      default: "#3B82F6", // Default to blue-500
    },
  },
  { timestamps: true },
);

// Index for efficient querying

PlacementSchema.index({ userId: 1, status: 1 });
PlacementSchema.index({ startDate: 1, endDate: 1 });

// Static method to check if a placement code is available
PlacementSchema.statics.isCodeAvailable = async function (
  codeName: string,
): Promise<boolean> {
  const activePlacement = await this.findOne({
    codeName,
    status: { $in: ["active", "inactive"] }, // Check for both active and inactive (reserved) placements
    $or: [
      { endDate: { $gte: new Date() } }, // Still within the active period
      { startDate: { $lte: new Date() } }, // Or has started but not yet ended
    ],
  });

  return !activePlacement;
};

// Static method to get all available placement codes
PlacementSchema.statics.getAvailableCodes = async function (): Promise<
  string[]
> {
  // Get all active placements
  const activePlacements = await this.find({
    status: { $in: ["active", "inactive"] },
    $or: [
      { endDate: { $gte: new Date() } }, // Still within the active period
      { startDate: { $lte: new Date() } }, // Or has started but not yet ended
    ],
  });

  // Return all codes that are NOT in the active placements
  const activeCodes = activePlacements.map(
    (placement: any) => placement.codeName,
  );

  // Define all possible codes (this should match the codes defined in the API)
  const allPossibleCodes = [
    "HERO-001",
    "HERO-002",
    "HERO-003", // Featured hero placements
    "LEFT-001",
    "LEFT-002",
    "LEFT-003",
    "LEFT-004",
    "LEFT-005", // Left sidebar
    "RIGHT-001",
    "RIGHT-002",
    "RIGHT-003",
    "RIGHT-004",
    "RIGHT-005", // Right sidebar
  ];

  return allPossibleCodes.filter((code) => !activeCodes.includes(code));
};

const Placement: Model<IPlacement> =
  mongoose.models.Placement ||
  mongoose.model<IPlacement>("Placement", PlacementSchema);
// Placement.collection.dropIndexes();
export default Placement;
