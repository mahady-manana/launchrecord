import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  currentPeriodEnd?: Date | null;
  canceledAt?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

SubscriptionSchema.index({ userId: 1, deletedAt: 1 });

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export default Subscription;
