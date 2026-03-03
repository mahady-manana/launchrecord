/**
 * Audit Report Format V1 Types
 * Based on format_v1.ts - The extensible, robust audit format
 */

// Meta information about the analysis
export interface AuditMeta {
  analysis_version: "SIO_V5" | string;
  confidence_score: number; // 0-1
  analysis_scope: "homepage_only" | "full_site" | "homepage_plus_social";
}

// AEO Index metrics
export interface SchemaMarkup {
  present: boolean;
  quality_score: number; // 0-100
  missing_types: string[];
}

export interface AuditAction {
  action: string; // <30 words
  priority: number; // 0-100
}

export interface AEOIndex {
  score: number; // 0-100
  critique: string; // <30 words
  schema_markup: SchemaMarkup;
  direct_answer_potential: string; // <25 words, single sentence
  search_visibility_risk: "low" | "medium" | "high";
  audit: AuditAction[];
}

// Positioning Sharpness
export interface PositioningSharpness {
  score: number; // 0-100
  band: "dominant" | "strong" | "blended" | "weak" | "ghost";
  critique: string; // <40 words
  audit: AuditAction[];
}

// Clarity Velocity
export interface ClarityVelocity {
  score: number; // 0-100
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  critique: string; // <40 words
  audit: AuditAction[];
}

// Momentum Signal
export interface MomentumSignal {
  score: number; // 0-100
  band: "viral" | "rising" | "stable" | "flat" | "dead";
  critique: string; // <40 words
  audit: AuditAction[];
}

// Founder Proof Vault
export type EvidenceType = 
  | "testimonials"
  | "case_studies"
  | "metrics"
  | "logos"
  | "press"
  | "founder_authority";

export interface FounderProofVault {
  score: number; // 0-100
  evidence_types: EvidenceType[];
  critique: string; // <40 words
  audit: AuditAction[];
}

// Competitors
export interface Competitor {
  name: string;
  threat_level: "low" | "medium" | "high";
}

// Overall Assessment
export type ConstraintType = "authority" | "positioning" | "clarity" | "momentum" | "proof";
export type CategoryPosition = "leader" | "challenger" | "replicable" | "invisible";

export interface OverallAssessment {
  composite_score: number; // 0-100
  category_position: CategoryPosition;
  biggest_leverage_point: string; // <20 words
  primary_constraint: ConstraintType;
  survival_probability_12m: number; // 0-100
}

// The Ego Stab
export type EgoTriggerType = 
  | "low_positioning"
  | "weak_proof"
  | "clarity_confusion"
  | "authority_gap"
  | "momentum_flat";

export interface EgoStab {
  triggered_by: EgoTriggerType[];
  severity: number; // 1-100
  brutal_summary: string; // <20 words
  founder_ego_bait: string; // <25 words
  cliche_density: string; // 0-100%
  founder_bias_risk: "low" | "medium" | "high";
  audit: AuditAction[];
}

// Category Weights
export interface CategoryWeights {
  aeo_index: number; // 0-100
  positioning_sharpness: number; // 0-100
  clarity_velocity: number; // 0-100
  momentum_signal: number; // 0-100
  founder_proof_vault: number; // 0-100
  total_must_equal: 100;
  weighting_rationale: string; // <40 words
}

// Main Audit Report V1 Interface
export interface AuditReportV1 {
  meta: AuditMeta;
  aeo_index: AEOIndex;
  positioning_sharpness: PositioningSharpness;
  clarity_velocity: ClarityVelocity;
  momentum_signal: MomentumSignal;
  founder_proof_vault: FounderProofVault;
  top_competitors: Competitor[];
  overall_assessment: OverallAssessment;
  the_ego_stab: EgoStab;
  category_weights: CategoryWeights;
}

// Helper type for API responses
export interface AuditReportResponse {
  success: boolean;
  data: AuditReportV1;
}

// Helper functions for type guards
export function isValidAuditReport(data: any): data is AuditReportV1 {
  return (
    data &&
    typeof data.meta === "object" &&
    typeof data.aeo_index === "object" &&
    typeof data.positioning_sharpness === "object" &&
    typeof data.clarity_velocity === "object" &&
    typeof data.momentum_signal === "object" &&
    typeof data.founder_proof_vault === "object" &&
    Array.isArray(data.top_competitors) &&
    typeof data.overall_assessment === "object" &&
    typeof data.the_ego_stab === "object" &&
    typeof data.category_weights === "object"
  );
}

export function getCompositeScore(report: AuditReportV1): number {
  return report.overall_assessment.composite_score;
}

export function getCategoryPosition(report: AuditReportV1): CategoryPosition {
  return report.overall_assessment.category_position;
}

export function getRiskLevel(report: AuditReportV1): "low" | "medium" | "high" {
  const score = report.overall_assessment.composite_score;
  if (score >= 70) return "low";
  if (score >= 40) return "medium";
  return "high";
}
