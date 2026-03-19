import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscription extends Document {
  productId: mongoose.Types.ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  planType: "free" | "founder" | "growth" | "sovereign";
  monthlyAuditLimit: number;
  weeklyAuditLimit: number;
  currentPeriodEnd?: Date | null;
  canceledAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      index: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    planType: {
      type: String,
      enum: ["free", "founder", "growth", "sovereign"],
      required: true,
      default: "free",
    },
    monthlyAuditLimit: {
      type: Number,
      required: true,
      default: 1, // Free: 1/month, Founder: 15/month, Growth: 30/month, Sovereign: unlimited
    },
    weeklyAuditLimit: {
      type: Number,
      required: true,
      default: 0, // Free: 0/week, Founder: 5/week, Growth: 5/week, Sovereign: unlimited
    },
    status: {
      type: String,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    canceledAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

SubscriptionSchema.index({ productId: 1, deletedAt: 1 });

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
