import { Document, Types } from "mongoose";

/* =========================
   ENUMS
========================= */

export type IssueSeverity = "critical" | "medium" | "low";

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

export type ReportBand = "Dominant" | "Strong" | "Average" | "Weak" | "Ghost";

/* =========================
   ISSUE SUBDOCUMENT
========================= */

export interface IIssue {
  id: string;

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

type WebsiteSummary = {
  overview: string;
  problems: string[];
  solutions: string[];
};
/* =========================
   MAIN REPORT
========================= */

export interface ISIOReport extends Document {
  product?: Types.ObjectId;
  url: string;
  overallScore: number;
  statement: string;
  reportBand: ReportBand;
  websiteSummary: WebsiteSummary;
  issues: IIssue[];
  strengths?: {
    statement: string;
    impact: string;
  }[];
  scoring: {
    firstImpression: number;
    positioning: number;
    clarity: number;
    aeo: number;
  };
  categoryInsights: {
    positioning: CategoryInsight;
    clarity: CategoryInsight;
    firstImpression: CategoryInsight;
    aeo: CategoryInsight;
  };

  progress?:
    | "initializing"
    | "content_fetched"
    | "summary_complete"
    | "issues_generated"
    | "scoring_complete"
    | "complete"
    | "failed";

  failedAt?: string;
  errorMessage?: string;

  createdAt: Date;
  updatedAt: Date;
}
