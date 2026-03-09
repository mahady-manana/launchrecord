import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUsage extends Document {
  productId: mongoose.Types.ObjectId;
  periodStart: Date;
  periodEnd: Date;
  auditsUsed: number;
  auditsLimit: number;
  weeklyAuditUsed: number;
  weeklyAuditLimit: number;
  weekStart: Date;
  weekEnd: Date;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UsageSchema = new Schema<IUsage>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    auditsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    auditsLimit: {
      type: Number,
      required: true,
      default: 3, // Free tier: 3 per month
    },
    weeklyAuditUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    weeklyAuditLimit: {
      type: Number,
      required: true,
      default: 0, // Free tier: 0 per week
    },
    weekStart: {
      type: Date,
      required: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    resetAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// Index for efficient lookups
UsageSchema.index({ productId: 1, periodStart: 1 });
UsageSchema.index({ productId: 1, weekStart: 1 });

const Usage: Model<IUsage> =
  mongoose.models.Usage || mongoose.model<IUsage>("Usage", UsageSchema);

export default Usage;
