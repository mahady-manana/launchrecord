import { connectToDatabase } from "@/lib/db";
import type { IProduct } from "@/models/product";
import Report from "@/models/report";
import type { AuditReportV1 } from "@/types/audit-report-v1";

export interface SaveAnalysisOptions {
  product: IProduct;
  report: AuditReportV1;
  rawResponse?: string;
}

// Normalize string values to handle AI variations (case sensitivity, typos, etc.)
function normalizeString(value: string, allowedValues: string[]): string {
  const lowerValue = value.toLowerCase();
  const found = allowedValues.find((v) => v.toLowerCase() === lowerValue);
  return found || value; // Return normalized or original if not found
}

// Normalize risk level strings
function normalizeRiskLevel(value: string): "low" | "medium" | "high" {
  const lower = value.toLowerCase();
  if (lower.includes("low")) return "low";
  if (lower.includes("med")) return "medium";
  if (lower.includes("high")) return "high";
  return "medium"; // Default
}

// Normalize band strings
function normalizeBand(value: string, bands: string[]): string {
  const lower = value.toLowerCase();
  const found = bands.find((b) => b.toLowerCase() === lower);
  return found || bands[2]; // Return match or default (middle option)
}

// Normalize constraint type
function normalizeConstraint(value: string): string {
  const constraints = [
    "authority",
    "positioning",
    "clarity",
    "momentum",
    "proof",
  ];
  return normalizeString(value, constraints);
}

// Normalize category position
function normalizeCategoryPosition(value: string): string {
  const positions = ["leader", "challenger", "replicable", "invisible"];
  return normalizeString(value, positions);
}

// Normalize threat level
function normalizeThreatLevel(value: string): string {
  return normalizeRiskLevel(value);
}

// Normalize evidence types
function normalizeEvidenceTypes(types: string[]): string[] {
  const validTypes = [
    "testimonials",
    "case_studies",
    "metrics",
    "logos",
    "press",
    "founder_authority",
  ];
  return types.map((type) => {
    const normalized = normalizeString(type, validTypes);
    return validTypes.includes(normalized) ? normalized : type;
  });
}

// Normalize ego trigger types
function normalizeEgoTriggers(triggers: string[]): string[] {
  const validTriggers = [
    "low_positioning",
    "weak_proof",
    "clarity_confusion",
    "authority_gap",
    "momentum_flat",
  ];
  return triggers.map((trigger) => {
    const normalized = normalizeString(trigger, validTriggers);
    return validTriggers.includes(normalized) ? normalized : trigger;
  });
}

// Normalize the entire report before saving
function normalizeReport(report: AuditReportV1) {
  return {
    ...report,
    aeo_index: {
      ...report.aeo_index,
      search_visibility_risk: normalizeRiskLevel(
        report.aeo_index.search_visibility_risk,
      ),
    },
    positioning_sharpness: {
      ...report.positioning_sharpness,
      band: normalizeBand(report.positioning_sharpness.band, [
        "dominant",
        "strong",
        "blended",
        "weak",
        "ghost",
      ]),
    },
    clarity_velocity: {
      ...report.clarity_velocity,
      band: normalizeBand(report.clarity_velocity.band, [
        "instant",
        "clear",
        "average",
        "confusing",
        "opaque",
      ]),
    },
    momentum_signal: {
      ...report.momentum_signal,
      band: normalizeBand(report.momentum_signal.band, [
        "viral",
        "rising",
        "stable",
        "flat",
        "dead",
      ]),
    },
    founder_proof_vault: {
      ...report.founder_proof_vault,
      evidence_types: normalizeEvidenceTypes(
        report.founder_proof_vault.evidence_types,
      ),
    },
    top_competitors: report.top_competitors.map((comp) => ({
      ...comp,
      threat_level: normalizeThreatLevel(comp.threat_level),
    })),
    overall_assessment: {
      ...report.overall_assessment,
      category_position: normalizeCategoryPosition(
        report.overall_assessment.category_position,
      ),
      primary_constraint: normalizeConstraint(
        report.overall_assessment.primary_constraint,
      ),
    },
    the_ego_stab: {
      ...report.the_ego_stab,
      triggered_by: normalizeEgoTriggers(report.the_ego_stab.triggered_by),
      founder_bias_risk: normalizeRiskLevel(
        report.the_ego_stab.founder_bias_risk,
      ),
    },
  };
}

export async function saveAnalysis({
  product,
  report,
  rawResponse,
}: SaveAnalysisOptions): Promise<Report> {
  await connectToDatabase();

  // Normalize the report to handle AI variations
  const normalizedReport = normalizeReport(report);

  // Map V1 report to legacy fields for backward compatibility
  const overallScore = normalizedReport.overall_assessment.composite_score;
  const status = mapScoreToStatus(overallScore);

  const reportDoc = await Report.create({
    product: product._id,

    // V1 Audit Format Fields (normalized)
    meta: normalizedReport.meta,
    aeo_index: normalizedReport.aeo_index,
    positioning_sharpness: normalizedReport.positioning_sharpness,
    clarity_velocity: normalizedReport.clarity_velocity,
    momentum_signal: normalizedReport.momentum_signal,
    founder_proof_vault: normalizedReport.founder_proof_vault,
    top_competitors: normalizedReport.top_competitors,
    overall_assessment: normalizedReport.overall_assessment,
    the_ego_stab: normalizedReport.the_ego_stab,
    category_weights: normalizedReport.category_weights,

    // Legacy fields for backward compatibility
    overallScore,
    status,
    rawAnalysis: (rawResponse as unknown as any) || null,
  });

  // Update product score
  product.score = overallScore;
  await product.save();

  return reportDoc as any;
}

function mapScoreToStatus(
  score: number,
): "UNTOUCHABLE" | "LETHAL" | "PLASTIC" | "ZOMBIE" | "GHOST" {
  if (score >= 90) return "UNTOUCHABLE";
  if (score >= 70) return "LETHAL";
  if (score >= 40) return "PLASTIC";
  if (score >= 20) return "ZOMBIE";
  return "GHOST";
}

export async function getProductAnalysis(
  productId: string,
): Promise<Report | null> {
  await connectToDatabase();

  const report = await Report.findOne({ product: productId })
    .sort({ createdAt: -1 })
    .populate("product");

  return report as any;
}

export async function getProductAnalysisHistory(
  productId: string,
): Promise<Report[]> {
  await connectToDatabase();

  const reports = await Report.find({ product: productId })
    .sort({ createdAt: -1 })
    .populate("product");

  return reports as any;
}

export async function getRecentAnalyses(limit: number = 10): Promise<Report[]> {
  await connectToDatabase();

  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("product");

  return reports as any;
}
