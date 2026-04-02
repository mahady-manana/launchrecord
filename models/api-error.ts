import mongoose, { Document, Model, Schema } from "mongoose";

export interface ApiErrorType extends Document {
  path: string;
  content: string;
  metadata?: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

const ApiErrorSchema = new Schema<ApiErrorType>(
  {
    path: {
      type: String,
      required: [true, "Path is required"],
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, "Errors are required"],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true },
);

const ApiError: Model<ApiErrorType> =
  mongoose.models.ApiError ||
  mongoose.model<ApiErrorType>("ApiError", ApiErrorSchema);

export default ApiError;
