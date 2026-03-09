import type { UserRole } from "@/types/user";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  provider: "credentials" | "google";
  providerId?: string | null;
  emailVerified?: Date | null;
  stripeCustomerId?: string | null;
  resetTokenHash?: string | null;
  resetTokenExpiresAt?: Date | null;
  verificationTokenHash?: string | null;
  verificationTokenExpiresAt?: Date | null;
  claimTokenHash?: string | null;
  claimTokenExpiresAt?: Date | null;
  claimProductId?: string | null;
  deletedAt?: Date | null;
  // LaunchRecord whitelist fields
  whitelisted?: boolean;
  founderName?: string | null;
  saasName?: string | null;
  sovereignRank?: number | null;
  surveyData?: Record<string, any> | null;
  earlyAccess?: boolean;
  earlyAccessGrantedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    providerId: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    resetTokenHash: {
      type: String,
      select: false,
      default: null,
    },
    resetTokenExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    verificationTokenHash: {
      type: String,
      select: false,
      default: null,
    },
    verificationTokenExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    claimTokenHash: {
      type: String,
      select: false,
      default: null,
    },
    claimTokenExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
    claimProductId: {
      type: Schema.Types.ObjectId,
      select: false,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    // LaunchRecord whitelist fields
    whitelisted: {
      type: Boolean,
      default: false,
    },
    founderName: {
      type: String,
      default: null,
      trim: true,
    },
    saasName: {
      type: String,
      default: null,
      trim: true,
    },
    sovereignRank: {
      type: Number,
      default: null,
    },
    surveyData: {
      type: Schema.Types.Mixed,
      default: null,
    },
    earlyAccess: {
      type: Boolean,
      default: false,
    },
    earlyAccessGrantedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });
UserSchema.index({ deletedAt: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
