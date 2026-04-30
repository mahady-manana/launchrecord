import { randomUUID } from "crypto";

export type V2WebsiteSummary = {
  overview: string;
  problems: string[];
  outcomes: string[];
  solutions: string[];
};

const issueCategoryEnum = ["positioning", "clarity", "first_impression", "aeo"];

const issueSeverityEnum = ["critical", "high", "medium", "low"];

const firstImpressionsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isPositioningClear: {
      type: "boolean",
      description:
        "True when the product, audience, and value are immediately understandable from the hero or opening message.",
    },
    isMessagingClear: {
      type: "boolean",
      description:
        "True when the value proposition can be understood quickly without guessing.",
    },
    isUserLeftGuessing: {
      type: "boolean",
      description:
        "True when a first-time visitor still has to infer what the product does or who it is for.",
    },
    ten_second_test: {
      type: "boolean",
      description:
        "True only when the page fails the 10-second understanding test.",
    },
    statement: {
      type: "string",
      description: "Diagnostic summary of the first impression only. No fixes.",
    },
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
  description:
    "A factual extraction of the current website content. This is not an audit diagnosis.",
  properties: {
    overview: {
      type: "string",
      description:
        "A neutral, factual description of what the product/company does.",
    },
    problems: {
      type: "array",
      items: { type: "string" },
      description:
        "The real-world USER PAINS or market problems that the PRODUCT claims to solve. These are NOT audit findings or website issues — they are the problems the product addresses for its customers.",
    },
    outcomes: {
      type: "array",
      items: { type: "string" },
      description:
        "The outcomes, transformations, or results the PRODUCT promises to deliver to customers.",
    },
    solutions: {
      type: "array",
      items: { type: "string" },
      description:
        "The capabilities, features, or value propositions the PRODUCT provides to solve those problems. These are NOT audit recommendations — they are what the product offers.",
    },
  },
  required: ["overview", "problems", "outcomes", "solutions"],
};

const issueGenerationIssueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: "string", enum: issueCategoryEnum },
    metricKey: { type: "string" },
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

function buildScopedIssueSchema(categoryEnum: string[]) {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      ...issueGenerationIssueSchema.properties,
      category: { type: "string", enum: categoryEnum },
    },
    required: issueGenerationIssueSchema.required,
  };
}

const firstImpressionIssueSchema = buildScopedIssueSchema(["first_impression"]);

const positioningMessagingIssueSchema = buildScopedIssueSchema([
  "positioning",
  "clarity",
]);

const aeoIssueSchema = buildScopedIssueSchema(["aeo"]);

const fullScoringSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overall: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "Holistic overall score. Do not calculate as an issue penalty sum.",
    },
    positioning: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "Positioning clarity score. Use generous calibration when the offer is understandable.",
    },
    clarity: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "Messaging clarity score. Do not collapse into the 40s unless the page is genuinely muddled.",
    },
    first_impression: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "First impression score. Strong if the hero communicates what it is, who it is for, and why it matters.",
    },
    aeo: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description:
        "AEO score. Score machine readability and terminology clarity, not issue count.",
    },
  },
  required: ["overall", "positioning", "clarity", "first_impression", "aeo"],
};

const firstImpressionScoringSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first_impression: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["first_impression"],
};

const metricsSchema = {
  type: "array",
  description: "An array of all processed metrics checks.",
  items: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: { type: "string" },
      check: { type: "boolean" },
    },
    required: ["name", "check"],
  },
};

const positioningMessagingScoringSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positioning: { type: "number", minimum: 0, maximum: 100 },
    clarity: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["positioning", "clarity"],
};

const aeoScoringSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aeo: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["aeo"],
};

const overallScoringSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overall: { type: "number", minimum: 0, maximum: 100 },
  },
  required: ["overall"],
};

const firstImpressionCategoryInsightsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first_impression: categoryInsightSchema,
  },
  required: ["first_impression"],
};

const positioningMessagingCategoryInsightsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positioning: categoryInsightSchema,
    clarity: categoryInsightSchema,
  },
  required: ["positioning", "clarity"],
};

const aeoCategoryInsightsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aeo: categoryInsightSchema,
  },
  required: ["aeo"],
};

const fullCategoryInsightsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positioning: categoryInsightSchema,
    clarity: categoryInsightSchema,
    first_impression: categoryInsightSchema,
    aeo: categoryInsightSchema,
  },
  required: ["positioning", "clarity", "first_impression", "aeo"],
};

export const aeoAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metrics: metricsSchema,
    issues: {
      type: "array",
      items: aeoIssueSchema,
    },
    scoring: aeoScoringSchema,
    categoryInsights: {
      type: "object",
      additionalProperties: false,
      properties: aeoCategoryInsightsSchema.properties,
      required: aeoCategoryInsightsSchema.required,
    },
  },
  required: ["metrics", "issues", "scoring", "categoryInsights"],
};

export const summaryAndIssuesJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statement: {
      type: "string",
      description:
        "A 2-3 sentence summary of the website's message and first impression performance. This is diagnostic only and must not include fixes.",
    },
    metrics: metricsSchema,
    issues: {
      type: "array",
      items: firstImpressionIssueSchema,
    },
    scoring: firstImpressionScoringSchema,
    firstImpressions: firstImpressionsSchema,
    categoryInsights: {
      type: "object",
      additionalProperties: false,
      properties: firstImpressionCategoryInsightsSchema.properties,
      required: firstImpressionCategoryInsightsSchema.required,
    },
    websiteSummary: websiteSummarySchema,
  },
  required: [
    "statement",
    "metrics",
    "issues",
    "scoring",
    "firstImpressions",
    "categoryInsights",
    "websiteSummary",
  ],
};

export const scoringFixesJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    metrics: metricsSchema,
    scoring: positioningMessagingScoringSchema,
    issues: {
      type: "array",
      items: positioningMessagingIssueSchema,
    },
    categoryInsights: positioningMessagingCategoryInsightsSchema,
  },
  required: ["metrics", "scoring", "issues", "categoryInsights"],
};

export const validationImprovementJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statement: {
      type: "string",
      description:
        "A 2-3 sentence overall audit verdict about the full report. This is diagnostic only and should reconcile the step outputs without introducing new direction.",
    },
    metrics: metricsSchema,
    issues: {
      type: "array",
      items: enrichedIssueSchema,
    },
    scoring: overallScoringSchema,
    firstImpressions: firstImpressionsSchema,
    categoryInsights: fullCategoryInsightsSchema,
    websiteSummary: websiteSummarySchema,
  },
  required: [
    "statement",
    "metrics",
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
  return rawIssues.map((issue) => {
    const statement = issue?.statement || "";
    const explanation = issue?.explanation || "";
    const combinedStatement =
      statement && explanation
        ? `${statement} ${explanation}`
        : statement || explanation;

    return {
      id: typeof issue?.id === "string" && issue.id ? issue.id : randomUUID(),
      category: issue?.category || "positioning",
      metricKey: issue?.metricKey,
      severity: issue?.severity || "low",
      statement: combinedStatement,
      explanation: undefined, // Fully deprecated
      current:
        typeof issue?.current === "string" && issue.current.trim().length > 0
          ? issue.current
          : undefined,
      recommendations: normalizeStringArray(issue?.recommendations),
      fixes: normalizeStringArray(issue?.fixes),
      isVisibleInFree: Boolean(issue?.isVisibleInFree),
      isFixLocked: Boolean(issue?.isFixLocked),
      impactScore: normalizeImpactScore(issue?.impactScore),
    };
  });
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
    outcomes: normalizeStringArray(rawWebsiteSummary?.outcomes),
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
  return normalizeWebsiteSummary(report?.websiteSummary);
}

export function buildV2ValidationInput(report: any) {
  return {
    statement: report?.statement || "",
    issues: normalizeIssues(report?.issues || []),
    scoring: {
      overall: normalizeScore(report?.overallScore),
      positioning: normalizeScore(report?.scoring?.positioning),
      clarity: normalizeScore(report?.scoring?.clarity),
      first_impression: normalizeScore(report?.scoring?.first_impression),
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
      first_impression: normalizeScore(report?.scoring?.first_impression),
      aeo: normalizeScore(report?.scoring?.aeo),
    },
    metrics: report?.metrics || {},
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
  const uniqueStrengths = Array.from(
    new Set([...websiteSummary.outcomes, ...websiteSummary.solutions]),
  );

  return uniqueStrengths.map((statement) => ({
    statement,
    impact:
      "Promised outcome or solution direction derived from the summary layer.",
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

export function normalizeMetricsArray(
  rawMetrics: any,
): Array<{ name: string; check: boolean }> {
  const metrics: Array<{ name: string; check: boolean }> = [];

  if (Array.isArray(rawMetrics)) {
    for (const item of rawMetrics) {
      if (item && item.name && typeof item.check === "boolean") {
        metrics.push({
          name: String(item.name),
          check: item.check,
        });
      }
    }
  } else if (rawMetrics && typeof rawMetrics === "object") {
    // Fallback if AI ignores structure and generates dict directly
    for (const [key, val] of Object.entries(rawMetrics)) {
      if (val && typeof val === "object" && "check" in val) {
        metrics.push({
          name: key,
          check: Boolean((val as any).check),
        });
      }
    }
  }
  return metrics;
}

export function mergeMetricsArrays(
  current: Array<{ name: string; check: boolean }> | undefined,
  incoming: any,
): Array<{ name: string; check: boolean }> {
  const currentArray = Array.isArray(current) ? current : [];
  const incomingArray = normalizeMetricsArray(incoming);

  const mergedMap = new Map<string, { name: string; check: boolean }>();
  for (const m of currentArray) mergedMap.set(m.name, m);
  for (const m of incomingArray) mergedMap.set(m.name, m);

  return Array.from(mergedMap.values());
}
