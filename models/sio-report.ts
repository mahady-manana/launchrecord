import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { IProduct } from "./product";

/**
 * SIO-V5 Report Document Interface
 */
export interface ISIOReport extends Document {
  // References (optional for guest users)
  product?: Types.ObjectId | IProduct;
  url: string;

  // Overall Score
  overallScore: number;
  statement: string;
  reportBand: "Dominant" | "Strong" | "Blended" | "Weak" | "Ghost";

  // Overall Comments
  overallCommentPositive: string[];
  overallCommentNegative: string[];

  // Website Summary
  websiteSummary: {
    summary: string;
    summaryComment?: string;
    problems: {
      currents: string[];
      positiveComments: string[];
      negativeComments: string[];
    };
    outcomes: {
      currents: string[];
      positiveComments: string[];
      negativeComments: string[];
    };
    solutions: {
      currents: string[];
      positiveComments: string[];
      negativeComments: string[];
    };
    features: {
      currents: string[];
      positiveComments: string[];
      negativeComments: string[];
    };
    isPositioningClear: boolean;
    isMessagingClear: boolean;
    areUsersLeftGuessing: boolean;
  };

  // First Impression (Hero)
  firstImpression: {
    score: number;
    statement: string;
    recommendation: string[];
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    headline: {
      statement: string;
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      recommendation: string[];
      suggested: string[];
    };
    subheadline: {
      statement: string;
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      recommendation: string[];
      suggested: string[];
    };
    cta: {
      statement: string;
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      recommendation: string[];
      suggested: string[];
    };
  };

  // Positioning Report
  positioning: {
    score: number;
    statement: string;
    recommendation: string[];
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    summary: {
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      recommendation: string[];
      suggested: string[];
    };
    subMetrics: {
      categoryOwnership: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
      };
      uniqueValueProp: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
      };
      competitiveDiff: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
      };
      targetAudience: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
      };
      problemSolutionFit: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
      };
      messagingConsistency: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
      };
    };
  };

  // Clarity Report
  clarity: {
    score: number;
    statement: string;
    recommendation: string[];
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    summary: {
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      recommendation: string[];
      suggested: string[];
    };
    unclearSentences: Array<{
      text: string;
      issue: string;
      fix: string;
    }>;
    subMetrics: {
      headlineClarity: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      valueProposition: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      featureBenefitMapping: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      visualHierarchy: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      ctaClarity: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      proofPlacement: {
        statement: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        recommendation: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
    };
  };

  // AEO Report
  aeo: {
    score: number;
    statement: string;
    aiPresence: {
      isPresent: boolean;
      engines: string[];
      comment: string;
    };
    recommendations: string[];
  };

  // Metadata
  auditDuration?: number;
  tokenUsage?: number;
  modelUsed?: string;
  rawAnalysis?: string;
  verifiedAnalysis?: string;

  // Progress tracking (multi-step audit)
  progress?:
    | "initializing"
    | "content_fetched"
    | "summary_complete"
    | "positioning_clarity_complete"
    | "aeo_complete"
    | "scoring_complete"
    | "complete"
    | "failed";

  // Temporary storage for multi-step audit (deleted on completion)
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

  // Error tracking for failed audits
  failedAt?: string;
  errorMessage?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * SIO-V5 Report Schema
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
      default: "Ghost",
      enum: {
        values: ["Dominant", "Strong", "Blended", "Weak", "Ghost"],
        message: "Invalid report band",
      },
    },

    // Overall Comments
    overallCommentPositive: { type: [String], default: [] },
    overallCommentNegative: { type: [String], default: [] },

    // Website Summary
    websiteSummary: {
      summary: { type: String, default: "" },
      summaryComment: { type: String, default: "" },
      problems: {
        currents: { type: [String], default: [] },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
      },
      outcomes: {
        currents: { type: [String], default: [] },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
      },
      solutions: {
        currents: { type: [String], default: [] },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
      },
      features: {
        currents: { type: [String], default: [] },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
      },
      isPositioningClear: { type: Boolean, default: false },
      isMessagingClear: { type: Boolean, default: false },
      areUsersLeftGuessing: { type: Boolean, default: true },
    },

    // First Impression
    firstImpression: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      statement: { type: String, default: "" },
      recommendation: { type: [String], default: [] },
      overallCommentPositive: { type: [String], default: [] },
      overallCommentNegative: { type: [String], default: [] },
      headline: {
        statement: { type: String, default: "" },
        current: { type: String, default: "" },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        recommendation: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      subheadline: {
        statement: { type: String, default: "" },
        current: { type: String, default: "" },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        recommendation: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      cta: {
        statement: { type: String, default: "" },
        current: { type: String, default: "" },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        recommendation: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
    },

    // Positioning
    positioning: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      statement: { type: String, default: "" },
      recommendation: { type: [String], default: [] },
      overallCommentPositive: { type: [String], default: [] },
      overallCommentNegative: { type: [String], default: [] },
      summary: {
        current: { type: String, default: "" },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        recommendation: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      subMetrics: {
        categoryOwnership: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        uniqueValueProp: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        competitiveDiff: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        targetAudience: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        problemSolutionFit: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        messagingConsistency: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
      },
    },

    // Clarity
    clarity: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      statement: { type: String, default: "" },
      recommendation: { type: [String], default: [] },
      overallCommentPositive: { type: [String], default: [] },
      overallCommentNegative: { type: [String], default: [] },
      summary: {
        current: { type: String, default: "" },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        recommendation: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      unclearSentences: {
        type: [
          {
            text: { type: String, default: "" },
            issue: { type: String, default: "" },
            fix: { type: String, default: "" },
          },
        ],
        default: [],
      },
      subMetrics: {
        headlineClarity: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, default: "" },
                issue: { type: String, default: "" },
                fix: { type: String, default: "" },
              },
            ],
            default: [],
          },
        },
        valueProposition: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, default: "" },
                issue: { type: String, default: "" },
                fix: { type: String, default: "" },
              },
            ],
            default: [],
          },
        },
        featureBenefitMapping: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, default: "" },
                issue: { type: String, default: "" },
                fix: { type: String, default: "" },
              },
            ],
            default: [],
          },
        },
        visualHierarchy: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, default: "" },
                issue: { type: String, default: "" },
                fix: { type: String, default: "" },
              },
            ],
            default: [],
          },
        },
        ctaClarity: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, default: "" },
                issue: { type: String, default: "" },
                fix: { type: String, default: "" },
              },
            ],
            default: [],
          },
        },
        proofPlacement: {
          statement: { type: String, default: "" },
          score: { type: Number, default: 0, min: 0, max: 100 },
          current: { type: String, default: "" },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          recommendation: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, default: "" },
                issue: { type: String, default: "" },
                fix: { type: String, default: "" },
              },
            ],
            default: [],
          },
        },
      },
    },

    // AEO
    aeo: {
      score: { type: Number, default: 0, min: 0, max: 100 },
      statement: { type: String, default: "" },
      aiPresence: {
        isPresent: { type: Boolean, default: false },
        engines: { type: [String], default: [] },
        comment: { type: String, default: "" },
      },
      recommendations: { type: [String], default: [] },
    },

    // Metadata
    auditDuration: { type: Number, min: 0, default: null },
    tokenUsage: { type: Number, min: 0, default: null },
    modelUsed: { type: String, default: null },
    rawAnalysis: { type: String, default: null },
    verifiedAnalysis: { type: String, default: null },

    // Progress tracking (multi-step audit)
    progress: {
      type: String,
      enum: [
        "initializing",
        "content_fetched",
        "summary_complete",
        "positioning_clarity_complete",
        "aeo_complete",
        "scoring_complete",
        "complete",
        "failed",
      ],
      default: "initializing",
      index: true,
    },

    // Temporary storage for multi-step audit
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

    // Error tracking for failed audits
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
