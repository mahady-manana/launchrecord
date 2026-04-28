import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { IProduct } from "./product";

export type SIOReportVersion = 1 | 2;

export type ReportBand =
  | "Dominant"
  | "Strong"
  | "Blended"
  | "Average"
  | "Weak"
  | "Ghost";

export type IssueSeverity = "critical" | "high" | "medium" | "low";

export type IssueCategory =
  | "positioning"
  | "clarity"
  | "first_impression"
  | "aeo";

export type FirstImpressionMetric = "headline" | "subheadline" | "cta";

export type PositioningMetric =
  | "category_ownership"
  | "unique_value_proposition"
  | "competitive_differentiation"
  | "target_audience"
  | "problem_solution_fit"
  | "messaging_consistency";

export type ClarityMetric =
  | "headline_clarity"
  | "value_proposition"
  | "feature_benefit_mapping"
  | "visual_hierarchy"
  | "cta_clarity"
  | "proof_placement";

export type IssueMetricKey =
  | FirstImpressionMetric
  | PositioningMetric
  | ClarityMetric;

export interface IIssue {
  category: IssueCategory;
  metricKey?: IssueMetricKey;
  severity: IssueSeverity;
  statement: string;
  explanation?: string;
  current?: string;
  recommendations?: string[];
  fixes?: string[];
  isVisibleInFree?: boolean;
  isFixLocked?: boolean;
  impactScore?: number;
}

type CategoryInsight = {
  statement: string;
  summary: string;
};

type V2WebsiteSummary = {
  overview: string;
  problems: string[];
  outcomes: string[];
  solutions: string[];
};

/**
 * SIO Report Document Interface (V2)
 */
export interface ISIOReport extends Document {
  // References (optional for guest users)
  product?: Types.ObjectId | IProduct;
  url: string;
  version: number;

  // Progress tracking
  progress:
    | "content_fetched"
    | "summary_complete"
    | "positioning_clarity_complete"
    | "aeo_complete"
    | "issues_generated"
    | "scoring_complete"
    | "complete"
    | "failed";

  // Overall Score
  overallScore: number;
  statement: string;
  reportBand: "Dominant" | "Strong" | "Average" | "Weak" | "Ghost";

  // Website Summary V2
  websiteSummaryV2: V2WebsiteSummary;

  // Legacy v1 compatibility fields
  websiteSummary?: any;
  firstImpression?: any;
  positioning?: any;
  clarity?: any;
  aeo?: any;
  overallCommentPositive?: string[];
  overallCommentNegative?: string[];
  auditDuration?: number;

  // Issues
  issues: IIssue[];

  // Strengths
  strengths: Array<{
    statement: string;
    impact: string;
  }>;

  // Scoring
  scoring: {
    overall: number;
    positioning: number;
    clarity: number;
    first_impression: number;
    aeo: number;
  };

  // Category Insights
  categoryInsights: {
    positioning: CategoryInsight;
    clarity: CategoryInsight;
    first_impression: CategoryInsight;
    aeo: CategoryInsight;
  };

  // Temporary storage for multi-step audit (kept for backward compatibility)
  tempData?: {
    rawWebsiteContent?: string;
    simplifiedContent?: string;
    metadata?: any;
    ldJson?: any;
    robotsTxt?: string;
    sitemap?: string;
    contentLength?: number;
    hasSitemap?: boolean;
    hasRobots?: boolean;
    metadataCount?: number;
  };

  // Error tracking
  failedAt?: string;
  errorMessage?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const issueMetricKeyEnum: IssueMetricKey[] = [
  "headline",
  "subheadline",
  "cta",
  "category_ownership",
  "unique_value_proposition",
  "competitive_differentiation",
  "target_audience",
  "problem_solution_fit",
  "messaging_consistency",
  "headline_clarity",
  "value_proposition",
  "feature_benefit_mapping",
  "visual_hierarchy",
  "cta_clarity",
  "proof_placement",
];

/**
 * SIO-V5 Report Schema
 */
/**
 * SIO-V2 Report Schema
 */
const SIOReportSchema = new Schema<ISIOReport>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: false,
      index: true,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      default: 2,
    },

    // Progress tracking
    progress: {
      type: String,
      required: true,
      enum: {
        values: [
          "content_fetched",
          "summary_complete",
          "positioning_clarity_complete",
          "aeo_complete",
          "issues_generated",
          "scoring_complete",
          "complete",
          "failed",
        ],
        message: "Invalid progress state",
      },
      default: "content_fetched",
      index: true,
    },

    // Overall Score
    overallScore: {
      type: Number,
      required: [true, "Overall score is required"],
      min: 0,
      max: 100,
      default: 0,
    },
    statement: {
      type: String,
      default: "",
    },
    reportBand: {
      type: String,
      required: true,
      default: "Ghost",
      enum: {
        values: ["Dominant", "Strong", "Average", "Weak", "Ghost"],
        message: "Invalid report band",
      },
    },

    // Website Summary V2
    websiteSummaryV2: {
      overview: { type: String, default: "" },
      problems: { type: [String], default: [] },
      outcomes: { type: [String], default: [] },
      solutions: { type: [String], default: [] },
    },
    websiteSummary: {
      type: Schema.Types.Mixed,
      default: null,
    },
    firstImpression: {
      type: Schema.Types.Mixed,
      default: null,
    },
    positioning: {
      type: Schema.Types.Mixed,
      default: null,
    },
    clarity: {
      type: Schema.Types.Mixed,
      default: null,
    },
    aeo: {
      type: Schema.Types.Mixed,
      default: null,
    },
    overallCommentPositive: {
      type: [String],
      default: [],
    },
    overallCommentNegative: {
      type: [String],
      default: [],
    },
    auditDuration: {
      type: Number,
      default: null,
    },

    // Issues
    issues: {
      type: [
        {
          id: { type: String, required: true },
          category: {
            type: String,
            enum: ["positioning", "clarity", "first_impression", "aeo"],
            required: true,
          },
          metricKey: {
            type: String,
            enum: issueMetricKeyEnum,
            default: undefined,
          },
          severity: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            required: true,
          },
          statement: { type: String, required: true },
          explanation: { type: String, default: null },
          current: { type: String, default: null },
          recommendations: { type: [String], default: [] },
          fixes: { type: [String], default: [] },
          isVisibleInFree: { type: Boolean, default: false },
          isFixLocked: { type: Boolean, default: false },
          impactScore: { type: Number, min: -100, max: 100, default: null },
        },
      ],
      default: [],
    },

    // Strengths
    strengths: {
      type: [
        {
          statement: { type: String, required: true },
          impact: { type: String, required: true },
        },
      ],
      default: [],
    },

    // Scoring
    scoring: {
      overall: { type: Number, default: 0, min: 0, max: 100 },
      positioning: { type: Number, default: 0, min: 0, max: 100 },
      clarity: { type: Number, default: 0, min: 0, max: 100 },
      first_impression: { type: Number, default: 0, min: 0, max: 100 },
      aeo: { type: Number, default: 0, min: 0, max: 100 },
    },

    // Category Insights
    categoryInsights: {
      positioning: {
        statement: { type: String, default: "" },
        summary: { type: String, default: "" },
      },
      clarity: {
        statement: { type: String, default: "" },
        summary: { type: String, default: "" },
      },
      first_impression: {
        statement: { type: String, default: "" },
        summary: { type: String, default: "" },
      },
      aeo: {
        statement: { type: String, default: "" },
        summary: { type: String, default: "" },
      },
    },

    // Temporary storage for multi-step audit (kept for backward compatibility)
    tempData: {
      rawWebsiteContent: { type: String, default: null },
      simplifiedContent: { type: String, default: null },
      metadata: { type: Schema.Types.Mixed, default: null },
      ldJson: { type: Schema.Types.Mixed, default: null },
      robotsTxt: { type: String, default: null },
      sitemap: { type: String, default: null },
      contentLength: { type: Number, default: null },
      hasSitemap: { type: Boolean, default: false },
      hasRobots: { type: Boolean, default: false },
      metadataCount: { type: Number, default: null },
    },

    // Error tracking
    failedAt: { type: String, default: null },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true },
);

// Indexes for efficient queries
SIOReportSchema.index({ product: 1, createdAt: -1 });
SIOReportSchema.index({ overallScore: 1 });
SIOReportSchema.index({ reportBand: 1 });
SIOReportSchema.index({ url: 1 });

// Method to check if report is recent (within last 30 days)
SIOReportSchema.methods.isRecent = function (days = 30): boolean {
  const now = new Date();
  const reportDate = this.createdAt;
  const diffInDays =
    (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= days;
};

// Static method to get latest report for a product
SIOReportSchema.statics.getLatestByProduct = async function (
  productId: Types.ObjectId | string,
): Promise<ISIOReport | null> {
  return this.findOne({ product: productId }).sort({ createdAt: -1 }).exec();
};

// Static method to get reports by score range
SIOReportSchema.statics.getByScoreRange = async function (
  productId: Types.ObjectId | string,
  minScore: number,
  maxScore: number,
): Promise<ISIOReport[]> {
  return this.find({
    product: productId,
    overallScore: { $gte: minScore, $lte: maxScore },
  })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get reports by band
SIOReportSchema.statics.getByReportBand = async function (
  productId: Types.ObjectId | string,
  band: ISIOReport["reportBand"],
): Promise<ISIOReport[]> {
  return this.find({
    product: productId,
    reportBand: band,
  })
    .sort({ createdAt: -1 })
    .exec();
};

// Static method to get average score for a product
SIOReportSchema.statics.getAverageScore = async function (
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
SIOReportSchema.statics.getTrendData = async function (
  productId: Types.ObjectId | string,
  limit = 10,
): Promise<Array<{ date: Date; score: number; band: string }>> {
  const reports = await this.find({
    product: new mongoose.Types.ObjectId(productId.toString()),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("createdAt overallScore reportBand")
    .exec();

  return reports.map((report: any) => ({
    date: report.createdAt,
    score: report.overallScore,
    band: report.reportBand,
  }));
};

const SIOReport: Model<ISIOReport> =
  mongoose.models.SIOReport ||
  mongoose.model<ISIOReport>("SIOReport", SIOReportSchema);

export default SIOReport;
