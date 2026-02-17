import mongoose, { Document, Model, Schema } from "mongoose";

export interface IDailyClick {
  date: string;
  clicks: number;
}

export interface IDailyOutboundClick {
  date: string;
  clicks: number;
}

export interface IClick extends Document {
  _id: mongoose.Types.ObjectId;
  launchId: mongoose.Types.ObjectId;
  all_time: number;
  all_time_outbound: number;
  daily_clicks: IDailyClick[];
  daily_outbound_clicks: IDailyOutboundClick[];
  trackedSessions: {
    sessionId: string;
    date: string;
    type: "click" | "outbound";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const DailyClickSchema = new Schema<IDailyClick>(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const DailyOutboundClickSchema = new Schema<IDailyOutboundClick>(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const TrackedSessionSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["click", "outbound"],
      required: true,
    },
  },
  { _id: false },
);

const ClickSchema = new Schema<IClick>(
  {
    launchId: {
      type: Schema.Types.ObjectId,
      ref: "Launch",
      required: true,
      unique: true,
      index: true,
    },
    all_time: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    all_time_outbound: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    daily_clicks: {
      type: [DailyClickSchema],
      default: [],
    },
    daily_outbound_clicks: {
      type: [DailyOutboundClickSchema],
      default: [],
    },
    trackedSessions: {
      type: [TrackedSessionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

// Index for efficient date-based queries
ClickSchema.index({ launchId: 1, "daily_clicks.date": 1 });
ClickSchema.index({ launchId: 1, "daily_outbound_clicks.date": 1 });

const Click: Model<IClick> =
  mongoose.models.Click || mongoose.model<IClick>("Click", ClickSchema);

export default Click;
