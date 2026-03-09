import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITopic extends Document {
  name: string;
  topic_slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    name: {
      type: String,
      required: [true, "Topic name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Topic name must be at least 2 characters"],
      maxlength: [100, "Topic name must be less than 100 characters"],
    },

    topic_slug: {
      type: String,
      unique: true,
      trim: true,
      minlength: [2, "Topic name must be at least 2 characters"],
      maxlength: [100, "Topic name must be less than 100 characters"],
      sparse: true,
    },
  },
  { timestamps: true },
);

TopicSchema.index({ name: 1 });

const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
