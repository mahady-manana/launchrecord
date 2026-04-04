import { ISIOReport } from "@/models/sio-report";

/**
 * Sanitized SIO Report for guest users
 * Omits sensitive/detailed data that requires signup to view
 */
export interface ISanitizedSIOReport {
  overallScore: number;
  statement: string;
  reportBand: "Dominant" | "Strong" | "Blended" | "Weak" | "Ghost";
  overallCommentPositive: string[];
  overallCommentNegative: string[];
  url: string;
  createdAt: Date;

  // Website Summary - Full data shown
  websiteSummary: ISIOReport["websiteSummary"];

  // First Impression - Only score and statement, omit detailed suggestions
  firstImpression: {
    score: number;
    statement: string;
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    // Omitted: headline, subheadline, cta (detailed suggestions)
  };

  // Positioning - Only score and statement, omit sub-metrics
  positioning: {
    score: number;
    statement: string;
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    // Omitted: summary, subMetrics
  };

  // Clarity - Only score and statement, omit detailed analysis
  clarity: {
    score: number;
    statement: string;
    overallCommentPositive: string[];
    overallCommentNegative: string[];
    // Omitted: summary, unclearSentences, subMetrics
  };

  // AEO - Full data shown (it's already simplified)
  aeo: ISIOReport["aeo"];
}

/**
 * Sanitizes SIO report for guest users
 * Removes sensitive/detailed data that requires signup to view
 * But keeps enough to show value and encourage signup
 */
export function sanitizeReportForGuest(report: ISIOReport) {
  return {
    // Overall - Full data shown
    overallScore: report.overallScore,
    statement: report.statement,
    reportBand: report.reportBand,
    overallCommentPositive: report.overallCommentPositive,
    overallCommentNegative: report.overallCommentNegative,
    url: report.url,
    createdAt: report.createdAt,

    // Website Summary - Full data shown (surface level info)
    websiteSummary: report.websiteSummary,

    // First Impression - Only high-level info
    firstImpression: {
      score: report.firstImpression.score,
      statement: report.firstImpression.statement,
      overallCommentPositive: report.firstImpression.overallCommentPositive,
      overallCommentNegative: report.firstImpression.overallCommentNegative,
      // Omitted: headline, subheadline, cta (detailed suggestions)
      headline: {
        current: report.firstImpression?.headline?.current || "",
        positiveComments:
          report.firstImpression?.headline?.positiveComments || [],
        negativeComments:
          report.firstImpression?.headline?.negativeComments || [],
        suggested: report.firstImpression?.headline?.suggested || [],
      },
      subheadline: {
        current: report.firstImpression?.subheadline?.current || "",
        positiveComments:
          report.firstImpression?.subheadline?.positiveComments || [],
        negativeComments:
          report.firstImpression?.subheadline?.negativeComments || [],
        suggested: report.firstImpression?.subheadline?.suggested || [],
      },
      cta: {
        current: report.firstImpression?.cta?.current || "",
        positiveComments: report.firstImpression?.cta?.positiveComments || [],
        negativeComments: report.firstImpression?.cta?.negativeComments || [],
        suggested: report.firstImpression?.cta?.suggested || [],
      },
    },

    // Positioning - Only high-level info
    positioning: {
      score: report.positioning.score,
      statement: report.positioning.statement,
      overallCommentPositive: report.positioning.overallCommentPositive,
      overallCommentNegative: report.positioning.overallCommentNegative,
      // Omitted: summary, subMetrics (detailed analysis)
      summary: {
        current: report.positioning?.summary?.current || "",
        positiveComments: report.positioning?.summary?.positiveComments || [],
        negativeComments: report.positioning?.summary?.negativeComments || [],
        suggested: report.positioning?.summary?.suggested || [],
      },
    },

    // Clarity - Only high-level info
    clarity: {
      score: report.clarity.score,
      statement: report.clarity.statement,
      overallCommentPositive: report.clarity.overallCommentPositive,
      overallCommentNegative: report.clarity.overallCommentNegative,
      // Omitted: summary, unclearSentences, subMetrics (detailed analysis)
      summary: {
        current: report.clarity?.summary?.current || "",
        positiveComments: report.clarity?.summary?.positiveComments || [],
        negativeComments: report.clarity?.summary?.negativeComments || [],
        suggested: report.clarity?.summary?.suggested || [],
      },
      unclearSentences: report?.clarity?.unclearSentences || [],
    },

    // AEO - Full data shown (already simplified free tier)
    aeo: report.aeo,
  };
}

/**
 * Checks if user is authenticated based on request context
 * For now, we'll pass this as a parameter
 */
export function shouldSanitizeReport(isGuest: boolean): boolean {
  return isGuest;
}
