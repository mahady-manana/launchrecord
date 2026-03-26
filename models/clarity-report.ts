import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { IProduct } from "./product";

/**
 * Clarity Audit Report Document Interface
 */
export interface IClarityReport extends Document {
  // References
  product: Types.ObjectId | IProduct;
  url: string;

  // Overall Score
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";

  // Critique
  critique: string;

  // Metrics
  metrics: {
    headlineClarity: number;
    visualFlow: number;
    valueHierarchy: number;
    benefitClarity: number;
    ctaClarity: number;
    proofPlacement: number;
  };

  // Findings
  findings: string[];

  // Recommendations
  recommendations: Array<{
    action: string;
    priority: number;
  }>;

  // 5-Second Test
  fiveSecondTest: {
    passes: boolean;
    timeToUnderstand: number;
    frictionPoints: string[];
  };

  // Metadata
  auditDuration?: number;
  tokenUsage?: number;
  modelUsed?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Clarity Report Schema
 */
const ClarityReportSchema = new Schema<IClarityReport>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    // Overall Score
    score: {
      type: Number,
      required: [true, "Score is required"],
      min: 0,
      max: 100,
    },
    band: {
      type: String,
      required: [true, "Clarity band is required"],
      enum: {
        values: ["instant", "clear", "average", "confusing", "opaque"],
        message: "Invalid clarity band",
      },
    },

    // Critique
    critique: {
      type: String,
      required: [true, "Critique is required"],
    },

    // Metrics
    metrics: {
      headlineClarity: { type: Number, required: true, min: 0, max: 100 },
      visualFlow: { type: Number, required: true, min: 0, max: 100 },
      valueHierarchy: { type: Number, required: true, min: 0, max: 100 },
      benefitClarity: { type: Number, required: true, min: 0, max: 100 },
      ctaClarity: { type: Number, required: true, min: 0, max: 100 },
      proofPlacement: { type: Number, required: true, min: 0, max: 100 },
    },

    // Findings
    findings: {
      type: [String],
      default: [],
    },

    // Recommendations
    recommendations: [
      {
        action: { type: String, required: true },
        priority: { type: Number, required: true, min: 0, max: 100 },
      },
    ],

    // 5-Second Test
    fiveSecondTest: {
      passes: { type: Boolean, required: true },
      timeToUnderstand: { type: Number, required: true, min: 0, max: 30 },
      frictionPoints: { type: [String], default: [] },
    },

    // Metadata
    auditDuration: {
      type: Number,
      min: 0,
      default: null,
    },
    tokenUsage: {
      type: Number,
      min: 0,
      default: null,
    },
    modelUsed: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Indexes for efficient queries
ClarityReportSchema.index({ product: 1, createdAt: -1 });
ClarityReportSchema.index({ score: 1 });
ClarityReportSchema.index({ band: 1 });
ClarityReportSchema.index({ url: 1 });

// Method to check if report is recent (within last 30 days)
ClarityReportSchema.methods.isRecent = function (days = 30): boolean {
  const now = new Date();
  const reportDate = this.createdAt;
  const diffInDays =
    (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= days;
};

// Static method to get latest report for a product
ClarityReportSchema.statics.getLatestByProduct = async function (
  productId: Types.ObjectId | string,
): Promise<IClarityReport | null> {
  return this.findOne({ product: productId }).sort({ createdAt: -1 }).exec();
};

// Static method to get reports by score range
ClarityReportSchema.statics.getByScoreRange = async function (
  productId: Types.ObjectId | string,
  minScore: number,
  maxScore: number,
): Promise<IClarityReport[]> {
  return this.find({
    product: productId,
    score: { $gte: minScore, $lte: maxScore },
  })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get reports by band
ClarityReportSchema.statics.getByBand = async function (
  productId: Types.ObjectId | string,
  band: IClarityReport["band"],
): Promise<IClarityReport[]> {
  return this.find({
    product: productId,
    band,
  })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get average score for a product
ClarityReportSchema.statics.getAverageScore = async function (
  productId: Types.ObjectId | string,
): Promise<number | null> {
  const result = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId.toString()) } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$score" },
      },
    },
  ]);
  return result.length > 0 ? Math.round(result[0].avgScore) : null;
};

// Static method to get trend data (last N reports)
ClarityReportSchema.statics.getTrendData = async function (
  productId: Types.ObjectId | string,
  limit = 10,
): Promise<Array<{ date: Date; score: number; band: string }>> {
  const reports = await this.find({
    product: new mongoose.Types.ObjectId(productId.toString()),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("createdAt score band")
    .exec();

  return reports.map((report: any) => ({
    date: report.createdAt,
    score: report.score,
    band: report.band,
  }));
};

const ClarityReport: Model<IClarityReport> =
  mongoose.models.ClarityReport ||
  mongoose.model<IClarityReport>("ClarityReport", ClarityReportSchema);

export default ClarityReport;
