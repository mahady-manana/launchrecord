import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider: "credentials" | "google";
  providerId?: string;
  website?: string;
  bio?: string;
  x?: string;
  linkedin?: string;
  stripeCustomerId?: string;
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
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    image: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    providerId: {
      type: String,
    },
    website: {
      type: String,
      maxlength: [200, "Website URL must be less than 200 characters"],
    },
    bio: {
      type: String,
      maxlength: [500, "Bio must be less than 500 characters"],
    },
    x: {
      type: String,
      maxlength: [100, "X handle must be less than 100 characters"],
    },
    linkedin: {
      type: String,
      maxlength: [200, "LinkedIn URL must be less than 200 characters"],
    },
    stripeCustomerId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
