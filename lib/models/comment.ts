import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user"; // Assuming user model exists
import { ILaunch } from "./launch"; // Using existing launch interface

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId; // Reference to User
  launch: mongoose.Types.ObjectId; // Reference to Launch
  parentComment?: mongoose.Types.ObjectId; // For nested replies (optional)
  likes: mongoose.Types.ObjectId[]; // Array of user IDs who liked the comment
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, "Comment content is required"],
      minlength: [1, "Comment must be at least 1 character"],
      maxlength: [1000, "Comment must be less than 1000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    launch: {
      type: Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      index: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Index for efficient querying by launch and creation date
CommentSchema.index({ launch: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1 }); // For nested replies

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;