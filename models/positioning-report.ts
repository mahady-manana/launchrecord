import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { IProduct } from "./product";

/**
 * Positioning Audit Report Document Interface
 */
export interface IPositioningReport extends Document {
  // References
  product: Types.ObjectId | IProduct;
  url: string;

  // Overall Score
  overallScore: number;
  positioningBand: "Dominant" | "Strong" | "Blended" | "Weak" | "Ghost";

  // Category Ownership
  categoryOwnership: {
    score: number;
    maxScore: number;
    categoryDefinition: string;
    ownedKeywords: string[];
    missingKeywords: string[];
    categoryLeaders: string[];
    categoryOwnershipLevel:
      | "Dominant"
      | "Strong"
      | "Blended"
      | "Weak"
      | "Ghost";
    recommendations: string[];
  };

  // Unique Value Proposition
  uniqueValueProposition: {
    score: number;
    maxScore: number;
    identifiedUVP: string;
    uvpClarity: "Exceptional" | "Clear" | "Moderate" | "Unclear" | "Absent";
    uniquenessLevel:
      | "Highly Unique"
      | "Distinctive"
      | "Moderate"
      | "Generic"
      | "Common";
    supportingEvidence: string[];
    recommendations: string[];
  };

  // Competitive Differentiation
  competitiveDifferentiation: {
    score: number;
    maxScore: number;
    identifiedCompetitors: string[];
    differentiationFactors: string[];
    weakPoints: string[];
    differentiationStrength:
      | "Dominant"
      | "Strong"
      | "Moderate"
      | "Weak"
      | "Absent";
    recommendations: string[];
  };

  // Target Audience Clarity
  targetAudienceClarity: {
    score: number;
    maxScore: number;
    identifiedAudiences: string[];
    audienceSpecificity:
      | "Laser-Focused"
      | "Specific"
      | "Moderate"
      | "Vague"
      | "Undefined";
    personaDepth:
      | "Comprehensive"
      | "Detailed"
      | "Basic"
      | "Minimal"
      | "Missing";
    recommendations: string[];
  };

  // Problem-Solution Fit
  problemSolutionFit: {
    score: number;
    maxScore: number;
    identifiedProblems: string[];
    solutionClarity: string;
    fitQuality: "Exceptional" | "Strong" | "Moderate" | "Weak" | "Poor";
    recommendations: string[];
  };

  // Messaging Consistency
  messagingConsistency: {
    score: number;
    maxScore: number;
    toneConsistency:
      | "Exceptional"
      | "Consistent"
      | "Moderate"
      | "Inconsistent"
      | "Chaotic";
    valuePropConsistency:
      | "Exceptional"
      | "Consistent"
      | "Moderate"
      | "Inconsistent"
      | "Contradictory";
    channelAlignment: string[];
    recommendations: string[];
  };

  // Metadata
  auditDuration?: number; // in milliseconds
  tokenUsage?: number;
  modelUsed?: string;

  // Raw AI response for reference
  rawAnalysis?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Positioning Report Schema
 */
const PositioningReportSchema = new Schema<IPositioningReport>(
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
    overallScore: {
      type: Number,
      required: [true, "Overall score is required"],
      min: 0,
      max: 100,
    },
    positioningBand: {
      type: String,
      required: [true, "Positioning band is required"],
      enum: {
        values: ["Dominant", "Strong", "Blended", "Weak", "Ghost"],
        message: "Invalid positioning band",
      },
    },

    // Category Ownership
    categoryOwnership: {
      score: { type: Number, required: true, min: 0, max: 100 },
      maxScore: { type: Number, required: true, default: 100 },
      categoryDefinition: { type: String, required: true },
      ownedKeywords: { type: [String], default: [] },
      missingKeywords: { type: [String], default: [] },
      categoryLeaders: { type: [String], default: [] },
      categoryOwnershipLevel: {
        type: String,
        required: true,
        enum: {
          values: ["Dominant", "Strong", "Blended", "Weak", "Ghost"],
          message: "Invalid category ownership level",
        },
      },
      recommendations: { type: [String], default: [] },
    },

    // Unique Value Proposition
    uniqueValueProposition: {
      score: { type: Number, required: true, min: 0, max: 100 },
      maxScore: { type: Number, required: true, default: 100 },
      identifiedUVP: { type: String, required: true },
      uvpClarity: {
        type: String,
        required: true,
        enum: {
          values: ["Exceptional", "Clear", "Moderate", "Unclear", "Absent"],
          message: "Invalid UVP clarity",
        },
      },
      uniquenessLevel: {
        type: String,
        required: true,
        enum: {
          values: [
            "Highly Unique",
            "Distinctive",
            "Moderate",
            "Generic",
            "Common",
          ],
          message: "Invalid uniqueness level",
        },
      },
      supportingEvidence: { type: [String], default: [] },
      recommendations: { type: [String], default: [] },
    },

    // Competitive Differentiation
    competitiveDifferentiation: {
      score: { type: Number, required: true, min: 0, max: 100 },
      maxScore: { type: Number, required: true, default: 100 },
      identifiedCompetitors: { type: [String], default: [] },
      differentiationFactors: { type: [String], default: [] },
      weakPoints: { type: [String], default: [] },
      differentiationStrength: {
        type: String,
        required: true,
        enum: {
          values: ["Dominant", "Strong", "Moderate", "Weak", "Absent"],
          message: "Invalid differentiation strength",
        },
      },
      recommendations: { type: [String], default: [] },
    },

    // Target Audience Clarity
    targetAudienceClarity: {
      score: { type: Number, required: true, min: 0, max: 100 },
      maxScore: { type: Number, required: true, default: 100 },
      identifiedAudiences: { type: [String], default: [] },
      audienceSpecificity: {
        type: String,
        required: true,
        enum: {
          values: [
            "Laser-Focused",
            "Specific",
            "Moderate",
            "Vague",
            "Undefined",
          ],
          message: "Invalid audience specificity",
        },
      },
      personaDepth: {
        type: String,
        required: true,
        enum: {
          values: ["Comprehensive", "Detailed", "Basic", "Minimal", "Missing"],
          message: "Invalid persona depth",
        },
      },
      recommendations: { type: [String], default: [] },
    },

    // Problem-Solution Fit
    problemSolutionFit: {
      score: { type: Number, required: true, min: 0, max: 100 },
      maxScore: { type: Number, required: true, default: 100 },
      identifiedProblems: { type: [String], default: [] },
      solutionClarity: { type: String, required: true },
      fitQuality: {
        type: String,
        required: true,
        enum: {
          values: ["Exceptional", "Strong", "Moderate", "Weak", "Poor"],
          message: "Invalid fit quality",
        },
      },
      recommendations: { type: [String], default: [] },
    },

    // Messaging Consistency
    messagingConsistency: {
      score: { type: Number, required: true, min: 0, max: 100 },
      maxScore: { type: Number, required: true, default: 100 },
      toneConsistency: {
        type: String,
        required: true,
        enum: {
          values: [
            "Exceptional",
            "Consistent",
            "Moderate",
            "Inconsistent",
            "Chaotic",
          ],
          message: "Invalid tone consistency",
        },
      },
      valuePropConsistency: {
        type: String,
        required: true,
        enum: {
          values: [
            "Exceptional",
            "Consistent",
            "Moderate",
            "Inconsistent",
            "Contradictory",
          ],
          message: "Invalid value prop consistency",
        },
      },
      channelAlignment: { type: [String], default: [] },
      recommendations: { type: [String], default: [] },
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

    // Raw AI response
    rawAnalysis: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// Indexes for efficient queries
PositioningReportSchema.index({ product: 1, createdAt: -1 });
PositioningReportSchema.index({ overallScore: 1 });
PositioningReportSchema.index({ positioningBand: 1 });
PositioningReportSchema.index({ url: 1 });

// Virtual for dimension average
PositioningReportSchema.virtual("dimensionAverage").get(function (
  this: IPositioningReport,
) {
  const dimensions = [
    this.categoryOwnership.score,
    this.uniqueValueProposition.score,
    this.competitiveDifferentiation.score,
    this.targetAudienceClarity.score,
    this.problemSolutionFit.score,
    this.messagingConsistency.score,
  ];
  const sum = dimensions.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / dimensions.length);
});

// Method to check if report is recent (within last 30 days)
PositioningReportSchema.methods.isRecent = function (days = 30): boolean {
  const now = new Date();
  const reportDate = this.createdAt;
  const diffInDays =
    (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= days;
};

// Static method to get latest report for a product
PositioningReportSchema.statics.getLatestByProduct = async function (
  productId: Types.ObjectId | string,
): Promise<IPositioningReport | null> {
  return this.findOne({ product: productId }).sort({ createdAt: -1 }).exec();
};

// Static method to get reports by score range
PositioningReportSchema.statics.getByScoreRange = async function (
  productId: Types.ObjectId | string,
  minScore: number,
  maxScore: number,
): Promise<IPositioningReport[]> {
  return this.find({
    product: productId,
    overallScore: { $gte: minScore, $lte: maxScore },
  })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get reports by positioning band
PositioningReportSchema.statics.getByPositioningBand = async function (
  productId: Types.ObjectId | string,
  band: IPositioningReport["positioningBand"],
): Promise<IPositioningReport[]> {
  return this.find({
    product: productId,
    positioningBand: band,
  })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get average score for a product
PositioningReportSchema.statics.getAverageScore = async function (
  productId: Types.ObjectId | string,
): Promise<number | null> {
  const result = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId.toString()) } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$overallScore" },
      },
    },
  ]);
  return result.length > 0 ? Math.round(result[0].avgScore) : null;
};

// Static method to get trend data (last N reports)
PositioningReportSchema.statics.getTrendData = async function (
  productId: Types.ObjectId | string,
  limit = 10,
): Promise<Array<{ date: Date; score: number; band: string }>> {
  const reports = await this.find({
    product: new mongoose.Types.ObjectId(productId.toString()),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("createdAt overallScore positioningBand")
    .exec();

  return reports.map((report: any) => ({
    date: report.createdAt,
    score: report.overallScore,
    band: report.positioningBand,
  }));
};

const PositioningReport: Model<IPositioningReport> =
  mongoose.models.PositioningReport ||
  mongoose.model<IPositioningReport>(
    "PositioningReport",
    PositioningReportSchema,
  );

export default PositioningReport;
