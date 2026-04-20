/**
 * Maps raw AI response to the v2 SIO report shape stored in MongoDB.
 */
export function mapToSIOReport(rawData: any): any {
  const overallScore = normalizeScore(rawData?.overallScore ?? rawData?.score);

  return {
    version: 2,
    overallScore,
    statement: rawData?.statement || "",
    reportBand: rawData?.reportBand || getReportBand(overallScore),
    issues: (rawData?.issues || []).map(mapIssue),
    strengths: (rawData?.strengths || []).map(mapStrength),
    scoring: {
      firstImpression: normalizeScore(rawData?.scoring?.firstImpression),
      positioning: normalizeScore(rawData?.scoring?.positioning),
      clarity: normalizeScore(rawData?.scoring?.clarity),
      aeo: normalizeScore(rawData?.scoring?.aeo),
    },
    categoryInsights: {
      positioning: mapCategoryInsight(rawData?.categoryInsights?.positioning),
      clarity: mapCategoryInsight(rawData?.categoryInsights?.clarity),
      firstImpression: mapCategoryInsight(
        rawData?.categoryInsights?.firstImpression,
      ),
      aeo: mapCategoryInsight(rawData?.categoryInsights?.aeo),
    },
  };
}

function mapIssue(raw: any) {
  return {
    id: raw?.id || "",
    category: raw?.category || "positioning",
    metricKey: raw?.metricKey || undefined,
    severity: raw?.severity || "low",
    statement: raw?.statement || "",
    explanation: raw?.explanation || undefined,
    current: raw?.current || undefined,
    recommendations: normalizeStringArray(raw?.recommendations),
    fixes: normalizeStringArray(raw?.fixes),
    isVisibleInFree: Boolean(raw?.isVisibleInFree),
    isFixLocked: Boolean(raw?.isFixLocked),
    impactScore:
      typeof raw?.impactScore === "number"
        ? normalizeScore(raw.impactScore)
        : undefined,
  };
}

function mapStrength(raw: any) {
  return {
    statement: raw?.statement || "",
    impact: raw?.impact || "",
  };
}

function mapCategoryInsight(raw: any) {
  return {
    statement: raw?.statement || "",
    summary: raw?.summary || "",
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

function getReportBand(
  score: number,
): "Dominant" | "Strong" | "Average" | "Weak" | "Ghost" {
  if (score >= 90) return "Dominant";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Average";
  if (score >= 30) return "Weak";
  return "Ghost";
}

export { getReportBand };
