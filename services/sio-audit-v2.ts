import { randomUUID } from "crypto";

export type V2WebsiteSummary = {
  overview: string;
  problems: string[];
  solutions: string[];
};

const issueCategoryEnum = ["positioning", "clarity", "first_impression", "aeo"];

const issueSeverityEnum = ["critical", "high", "medium", "low"];

const issueMetricKeyEnum = [
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

const firstImpressionsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isPositioningClear: { type: "boolean" },
    isMessagingClear: { type: "boolean" },
    isUserLeftGuessing: { type: "boolean" },
    ten_second_test: { type: "boolean" },
    statement: { type: "string" },
  },
  required: [
    "isPositioningClear",
    "isMessagingClear",
    "isUserLeftGuessing",
    "ten_second_test",
    "statement",
  ],
};

const categoryInsightSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statement: { type: "string" },
    summary: { type: "string" },
  },
  required: ["statement", "summary"],
};

const websiteSummarySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overview: { type: "string" },
    problems: { type: "array", items: { type: "string" } },
    solutions: { type: "array", items: { type: "string" } },
  },
  required: ["overview", "problems", "solutions"],
};

const issueGenerationIssueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: "string", enum: issueCategoryEnum },
    metricKey: { type: "string", enum: issueMetricKeyEnum },
    severity: { type: "string", enum: issueSeverityEnum },
    statement: { type: "string" },
    explanation: { type: "string" },
    current: { type: ["string", "null"] },
    recommendations: { type: "array", items: { type: "string" } },
    fixes: { type: "array", items: { type: "string" } },
    impactScore: { type: "number", minimum: -100, maximum: 100 },
  },
  required: [
    "category",
    "metricKey",
    "severity",
    "statement",
    "explanation",
    "current",
    "recommendations",
    "fixes",
    "impactScore",
  ],
};

const enrichedIssueSchema = {
  ...issueGenerationIssueSchema,
  properties: {
    id: { type: "string" },
    ...issueGenerationIssueSchema.properties,
  },
  required: ["id", ...issueGenerationIssueSchema.required],
};

export const summaryAndIssuesJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issues: {
      type: "array",
      items: issueGenerationIssueSchema,
    },
    firstImpressions: firstImpressionsSchema,
    categoryInsights: {
      type: "object",
      additionalProperties: false,
      properties: {
        positioning: categoryInsightSchema,
        clarity: categoryInsightSchema,
        first_impression: categoryInsightSchema,
        aeo: categoryInsightSchema,
      },
      required: ["positioning", "clarity", "first_impression", "aeo"],
    },
    websiteSummary: websiteSummarySchema,
  },
  required: [
    "issues",
    "firstImpressions",
    "categoryInsights",
    "websiteSummary",
  ],
};

export const scoringFixesJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scoring: {
      type: "object",
      additionalProperties: false,
      properties: {
        overall: { type: "number", minimum: 0, maximum: 100 },
        positioning: { type: "number", minimum: 0, maximum: 100 },
        clarity: { type: "number", minimum: 0, maximum: 100 },
        first_impression: { type: "number", minimum: 0, maximum: 100 },
        aeo: { type: "number", minimum: 0, maximum: 100 },
      },
      required: [
        "overall",
        "positioning",
        "clarity",
        "first_impression",
        "aeo",
      ],
    },
    issues: {
      type: "array",
      items: enrichedIssueSchema,
    },
  },
  required: ["scoring", "issues"],
};

export const validationImprovementJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issues: {
      type: "array",
      items: enrichedIssueSchema,
    },
    scoring: scoringFixesJsonSchema.properties.scoring,
    firstImpressions: firstImpressionsSchema,
    categoryInsights: summaryAndIssuesJsonSchema.properties.categoryInsights,
    websiteSummary: websiteSummarySchema,
  },
  required: [
    "issues",
    "scoring",
    "firstImpressions",
    "categoryInsights",
    "websiteSummary",
  ],
};

export function buildCleanContent(report: any) {
  return {
    webcontent: report.tempData?.simplifiedContent,
    jsonLd: report.tempData?.ldJson,
    metadata: report.tempData?.metadata,
    robotstxt: report.tempData?.robotsTxt,
    sitemap: report.tempData?.sitemap,
  };
}

export function normalizeIssues(rawIssues: any[] = []) {
  return rawIssues.map((issue) => ({
    id: typeof issue?.id === "string" && issue.id ? issue.id : randomUUID(),
    category: issue?.category || "positioning",
    metricKey: issue?.metricKey,
    severity: issue?.severity || "low",
    statement: issue?.statement || "",
    explanation: issue?.explanation || "",
    current:
      typeof issue?.current === "string" && issue.current.trim().length > 0
        ? issue.current
        : undefined,
    recommendations: normalizeStringArray(issue?.recommendations),
    fixes: normalizeStringArray(issue?.fixes),
    isVisibleInFree: Boolean(issue?.isVisibleInFree),
    isFixLocked: Boolean(issue?.isFixLocked),
    impactScore: normalizeImpactScore(issue?.impactScore),
  }));
}

export function normalizeCategoryInsights(rawCategoryInsights: any) {
  return {
    positioning: normalizeCategoryInsight(rawCategoryInsights?.positioning),
    clarity: normalizeCategoryInsight(rawCategoryInsights?.clarity),
    first_impression: normalizeCategoryInsight(
      rawCategoryInsights?.firstImpression ||
        rawCategoryInsights?.first_impression,
    ),
    aeo: normalizeCategoryInsight(rawCategoryInsights?.aeo),
  };
}

export function serializeCategoryInsightsForPrompt(categoryInsights: any) {
  return {
    positioning: normalizeCategoryInsight(categoryInsights?.positioning),
    clarity: normalizeCategoryInsight(categoryInsights?.clarity),
    first_impression: normalizeCategoryInsight(
      categoryInsights?.first_impression || categoryInsights?.firstImpression,
    ),
    aeo: normalizeCategoryInsight(categoryInsights?.aeo),
  };
}

export function normalizeWebsiteSummary(
  rawWebsiteSummary: any,
): V2WebsiteSummary {
  return {
    overview: rawWebsiteSummary?.overview || "",
    problems: normalizeStringArray(rawWebsiteSummary?.problems),
    solutions: normalizeStringArray(rawWebsiteSummary?.solutions),
  };
}

export function normalizeFirstImpressions(rawFirstImpressions: any) {
  return {
    isPositioningClear: Boolean(rawFirstImpressions?.isPositioningClear),
    isMessagingClear: Boolean(rawFirstImpressions?.isMessagingClear),
    isUserLeftGuessing: Boolean(rawFirstImpressions?.isUserLeftGuessing),
    ten_second_test: Boolean(rawFirstImpressions?.ten_second_test),
    statement: rawFirstImpressions?.statement || "",
  };
}

export function getStoredWebsiteSummary(report: any): V2WebsiteSummary {
  return normalizeWebsiteSummary(report?.websiteSummaryV2);
}

export function buildV2ValidationInput(report: any) {
  return {
    issues: normalizeIssues(report?.issues || []),
    scoring: {
      overall: normalizeScore(report?.overallScore),
      positioning: normalizeScore(report?.scoring?.positioning),
      clarity: normalizeScore(report?.scoring?.clarity),
      first_impression: normalizeScore(report?.scoring?.firstImpression),
      aeo: normalizeScore(report?.scoring?.aeo),
    },
    firstImpressions: normalizeFirstImpressions(report?.firstImpressions),
    categoryInsights: serializeCategoryInsightsForPrompt(
      report?.categoryInsights,
    ),
    websiteSummary: getStoredWebsiteSummary(report),
  };
}

export function buildV2ApiData(report: any) {
  return {
    reportId:
      typeof report?._id?.toString === "function"
        ? report._id.toString()
        : report?._id,
    version: report?.version || 2,
    url: report?.url || "",
    overallScore: normalizeScore(report?.overallScore),
    statement: report?.statement || "",
    firstImpressions: normalizeFirstImpressions(report?.firstImpressions),
    reportBand: normalizeReportBand(report?.reportBand),
    issues: normalizeIssues(report?.issues || []),
    strengths: Array.isArray(report?.strengths) ? report.strengths : [],
    scoring: {
      overall: normalizeScore(report?.overallScore),
      positioning: normalizeScore(report?.scoring?.positioning),
      clarity: normalizeScore(report?.scoring?.clarity),
      first_impression: normalizeScore(report?.scoring?.firstImpression),
      aeo: normalizeScore(report?.scoring?.aeo),
    },
    categoryInsights: serializeCategoryInsightsForPrompt(
      report?.categoryInsights,
    ),
    websiteSummary: getStoredWebsiteSummary(report),
    progress: report?.progress,
    createdAt: report?.createdAt,
    updatedAt: report?.updatedAt,
  };
}


export function getV2Band(score: number) {
  if (score >= 90) return "Dominant";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Average";
  if (score >= 30) return "Weak";
  return "Ghost";
}

export function mapStrengthsFromSummary(websiteSummary: V2WebsiteSummary) {
  return websiteSummary.solutions.map((statement) => ({
    statement,
    impact: "Suggested solution direction derived from the summary layer.",
  }));
}

function normalizeCategoryInsight(rawCategoryInsight: any) {
  return {
    statement: rawCategoryInsight?.statement || "",
    summary: rawCategoryInsight?.summary || "",
  };
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeScore(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function normalizeImpactScore(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(-100, Math.min(100, value));
}

function normalizeReportBand(value: unknown) {
  if (
    value === "Dominant" ||
    value === "Strong" ||
    value === "Average" ||
    value === "Weak" ||
    value === "Ghost"
  ) {
    return value;
  }
  if (value === "Blended") return "Average";
  return getV2Band(normalizeScore(value));
}
