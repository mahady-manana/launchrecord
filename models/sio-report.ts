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
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    headline: {
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      suggested: string[];
    };
    subheadline: {
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      suggested: string[];
    };
    cta: {
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      suggested: string[];
    };
  };

  // Positioning Report
  positioning: {
    score: number;
    statement: string;
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    summary: {
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      suggested: string[];
    };
    subMetrics: {
      categoryOwnership: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
      };
      uniqueValueProp: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
      };
      competitiveDiff: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
      };
      targetAudience: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
      };
      problemSolutionFit: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
      };
      messagingConsistency: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
      };
    };
  };

  // Clarity Report
  clarity: {
    score: number;
    statement: string;
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    summary: {
      current: string;
      positiveComments: string[];
      negativeComments: string[];
      suggested: string[];
    };
    unclearSentences: Array<{
      text: string;
      issue: string;
      fix: string;
    }>;
    subMetrics: {
      headlineClarity: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      valueProposition: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      featureBenefitMapping: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      visualHierarchy: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      ctaClarity: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
        suggested: string[];
        unclearTexts: Array<{
          text: string;
          issue: string;
          fix: string;
        }>;
      };
      proofPlacement: {
        name: string;
        score: number;
        current: string;
        positiveComments: string[];
        negativeComments: string[];
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
    },
    statement: {
      type: String,
      required: [true, "Statement is required"],
    },
    reportBand: {
      type: String,
      required: [true, "Report band is required"],
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
      summary: { type: String, required: true },
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
      isPositioningClear: { type: Boolean, required: true },
      isMessagingClear: { type: Boolean, required: true },
      areUsersLeftGuessing: { type: Boolean, required: true },
    },

    // First Impression
    firstImpression: {
      score: { type: Number, required: true, min: 0, max: 100 },
      statement: { type: String, required: true },
      overallCommentPositive: { type: [String], default: [] },
      overallCommentNegative: { type: [String], default: [] },
      headline: {
        current: { type: String, required: true },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      subheadline: {
        current: { type: String, required: true },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      cta: {
        current: { type: String, required: true },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
    },

    // Positioning
    positioning: {
      score: { type: Number, required: true, min: 0, max: 100 },
      statement: { type: String, required: true },
      overallCommentPositive: { type: [String], default: [] },
      overallCommentNegative: { type: [String], default: [] },
      summary: {
        current: { type: String, required: true },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      subMetrics: {
        categoryOwnership: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        uniqueValueProp: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        competitiveDiff: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        targetAudience: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        problemSolutionFit: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
        messagingConsistency: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
        },
      },
    },

    // Clarity
    clarity: {
      score: { type: Number, required: true, min: 0, max: 100 },
      statement: { type: String, required: true },
      overallCommentPositive: { type: [String], default: [] },
      overallCommentNegative: { type: [String], default: [] },
      summary: {
        current: { type: String, required: true },
        positiveComments: { type: [String], default: [] },
        negativeComments: { type: [String], default: [] },
        suggested: { type: [String], default: [] },
      },
      unclearSentences: {
        type: [
          {
            text: { type: String, required: true },
            issue: { type: String, required: true },
            fix: { type: String, required: true },
          },
        ],
        default: [],
      },
      subMetrics: {
        headlineClarity: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, required: true },
                issue: { type: String, required: true },
                fix: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
        valueProposition: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, required: true },
                issue: { type: String, required: true },
                fix: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
        featureBenefitMapping: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, required: true },
                issue: { type: String, required: true },
                fix: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
        visualHierarchy: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, required: true },
                issue: { type: String, required: true },
                fix: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
        ctaClarity: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, required: true },
                issue: { type: String, required: true },
                fix: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
        proofPlacement: {
          name: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          current: { type: String, required: true },
          positiveComments: { type: [String], default: [] },
          negativeComments: { type: [String], default: [] },
          suggested: { type: [String], default: [] },
          unclearTexts: {
            type: [
              {
                text: { type: String, required: true },
                issue: { type: String, required: true },
                fix: { type: String, required: true },
              },
            ],
            default: [],
          },
        },
      },
    },

    // AEO
    aeo: {
      score: { type: Number, required: true, min: 0, max: 100 },
      statement: { type: String, required: true },
      aiPresence: {
        isPresent: { type: Boolean, required: true },
        engines: { type: [String], default: [] },
        comment: { type: String, required: true },
      },
      recommendations: { type: [String], default: [] },
    },

    // Metadata
    auditDuration: { type: Number, min: 0, default: null },
    tokenUsage: { type: Number, min: 0, default: null },
    modelUsed: { type: String, default: null },
    rawAnalysis: { type: String, default: null },
    verifiedAnalysis: { type: String, default: null },
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
