const reportBandEnum = ["Dominant", "Strong", "Average", "Weak", "Ghost"];

const issueCategoryEnum = [
  "positioning",
  "clarity",
  "first_impression",
  "aeo",
];

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

const issueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string" },
    category: { type: "string", enum: issueCategoryEnum },
    metricKey: { type: "string", enum: issueMetricKeyEnum },
    severity: { type: "string", enum: issueSeverityEnum },
    statement: { type: "string" },
    explanation: { type: "string" },
    current: { type: "string" },
    recommendations: {
      type: "array",
      items: { type: "string" },
    },
    fixes: {
      type: "array",
      items: { type: "string" },
    },
    isVisibleInFree: { type: "boolean" },
    isFixLocked: { type: "boolean" },
    impactScore: { type: "number", minimum: -100, maximum: 100 },
  },
  required: [
    "id",
    "category",
    "severity",
    "statement",
    "recommendations",
    "fixes",
    "isVisibleInFree",
    "isFixLocked",
  ],
};

const strengthSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statement: { type: "string" },
    impact: { type: "string" },
  },
  required: ["statement", "impact"],
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

export const sioV5JsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    version: {
      type: "number",
      enum: [2],
    },
    overallScore: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    statement: { type: "string" },
    reportBand: {
      type: "string",
      enum: reportBandEnum,
    },
    issues: {
      type: "array",
      items: issueSchema,
    },
    strengths: {
      type: "array",
      items: strengthSchema,
    },
    scoring: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstImpression: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
        positioning: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
        clarity: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
        aeo: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
      },
      required: ["firstImpression", "positioning", "clarity", "aeo"],
    },
    categoryInsights: {
      type: "object",
      additionalProperties: false,
      properties: {
        positioning: categoryInsightSchema,
        clarity: categoryInsightSchema,
        firstImpression: categoryInsightSchema,
        aeo: categoryInsightSchema,
      },
      required: ["positioning", "clarity", "firstImpression", "aeo"],
    },
  },
  required: [
    "version",
    "overallScore",
    "statement",
    "reportBand",
    "issues",
    "strengths",
    "scoring",
    "categoryInsights",
  ],
};
