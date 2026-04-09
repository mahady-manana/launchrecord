import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscription extends Document {
  productId: mongoose.Types.ObjectId;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  status: string;
  planType: "free" | "onetime" | "founder" | "growth" | "sovereign";
  monthlyAuditLimit: number;
  weeklyAuditLimit: number;
  totalAuditLimit: number;
  auditsUsed: number;
  currentPeriodEnd?: Date | null;
  expiresAt?: Date | null;
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
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      index: true,
    },
    stripeCustomerId: {
      type: String,
    },
    planType: {
      type: String,
      enum: ["free", "onetime", "founder", "growth", "sovereign"],
      required: true,
      default: "free",
    },
    monthlyAuditLimit: {
      type: Number,
      required: true,
      default: 1, // Free: 1, OneTime: 5, Founder: 15/month, Growth: 30/month, Sovereign: unlimited
    },
    weeklyAuditLimit: {
      type: Number,
      required: true,
      default: 0, // Free: 0, OneTime: 0, Founder: 5/week, Growth: 5/week, Sovereign: unlimited
    },
    totalAuditLimit: {
      type: Number,
      required: true,
      default: 0, // Free: 0, OneTime: 5 (forever), Founder: 0 (uses monthly), Sovereign: 0 (unlimited)
    },
    auditsUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    expiresAt: {
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
