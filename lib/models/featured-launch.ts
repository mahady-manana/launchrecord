import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFeaturedLaunch extends Document {
  _id: mongoose.Types.ObjectId;
  launchId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeaturedLaunchSchema = new Schema<IFeaturedLaunch>(
  {
    launchId: {
      type: Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true,
    },
  },
  { timestamps: true },
);

// Index for efficient querying of active featured launches
FeaturedLaunchSchema.index({ isActive: 1, startDate: 1, endDate: 1, priority: -1 });

// Static method to get currently active featured launches
FeaturedLaunchSchema.statics.getActiveFeatured = async function (
  limit: number = 10,
) {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .populate("launchId")
    .sort({ priority: -1, startDate: -1 })
    .limit(limit)
    .lean();
};

const FeaturedLaunch: Model<IFeaturedLaunch> =
  mongoose.models.FeaturedLaunch ||
  mongoose.model<IFeaturedLaunch>("FeaturedLaunch", FeaturedLaunchSchema);

export default FeaturedLaunch;
