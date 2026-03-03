import mongoose, { Document, Model, Schema, Types } from "mongoose";
import type { IProduct } from "./product";
import type {
  AuditMeta,
  AEOIndex,
  PositioningSharpness,
  ClarityVelocity,
  MomentumSignal,
  FounderProofVault,
  Competitor,
  OverallAssessment,
  EgoStab,
  CategoryWeights,
} from "@/types/audit-report-v1";

export interface IReport extends Document {
  product: Types.ObjectId | IProduct;
  
  // V1 Audit Format Fields
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

  // Legacy fields for backward compatibility
  overallScore: number;
  status: "UNTOUCHABLE" | "LETHAL" | "PLASTIC" | "ZOMBIE" | "GHOST";

  // Raw AI response for reference
  rawAnalysis?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    
    // V1 Audit Format Fields
    meta: {
      analysis_version: { type: String, required: true, default: "SIO_V5" },
      confidence_score: { type: Number, required: true, min: 0, max: 1 },
      analysis_scope: { 
        type: String, 
        required: true,
        enum: ["homepage_only", "full_site", "homepage_plus_social"],
      },
    },
    aeo_index: {
      score: { type: Number, required: true, min: 0, max: 100 },
      critique: { type: String, required: true },
      schema_markup: {
        present: { type: Boolean, required: true },
        quality_score: { type: Number, required: true, min: 0, max: 100 },
        missing_types: { type: [String], default: [] },
      },
      direct_answer_potential: { type: String, required: true },
      search_visibility_risk: { 
        type: String, 
        required: true,
        enum: ["low", "medium", "high"],
      },
      audit: {
        type: [{
          action: { type: String, required: true },
          priority: { type: Number, required: true, min: 0, max: 100 },
        }],
        default: [],
      },
    },
    positioning_sharpness: {
      score: { type: Number, required: true, min: 0, max: 100 },
      band: { 
        type: String, 
        required: true,
        enum: ["dominant", "strong", "blended", "weak", "ghost"],
      },
      critique: { type: String, required: true },
      audit: {
        type: [{
          action: { type: String, required: true },
          priority: { type: Number, required: true, min: 0, max: 100 },
        }],
        default: [],
      },
    },
    clarity_velocity: {
      score: { type: Number, required: true, min: 0, max: 100 },
      band: { 
        type: String, 
        required: true,
        enum: ["instant", "clear", "average", "confusing", "opaque"],
      },
      critique: { type: String, required: true },
      audit: {
        type: [{
          action: { type: String, required: true },
          priority: { type: Number, required: true, min: 0, max: 100 },
        }],
        default: [],
      },
    },
    momentum_signal: {
      score: { type: Number, required: true, min: 0, max: 100 },
      band: { 
        type: String, 
        required: true,
        enum: ["viral", "rising", "stable", "flat", "dead"],
      },
      critique: { type: String, required: true },
      audit: {
        type: [{
          action: { type: String, required: true },
          priority: { type: Number, required: true, min: 0, max: 100 },
        }],
        default: [],
      },
    },
    founder_proof_vault: {
      score: { type: Number, required: true, min: 0, max: 100 },
      evidence_types: { 
        type: [String], 
        default: [],
        enum: ["testimonials", "case_studies", "metrics", "logos", "press", "founder_authority"],
      },
      critique: { type: String, required: true },
      audit: {
        type: [{
          action: { type: String, required: true },
          priority: { type: Number, required: true, min: 0, max: 100 },
        }],
        default: [],
      },
    },
    top_competitors: {
      type: [{
        name: { type: String, required: true },
        threat_level: { 
          type: String, 
          required: true,
          enum: ["low", "medium", "high"],
        },
      }],
      default: [],
    },
    overall_assessment: {
      composite_score: { type: Number, required: true, min: 0, max: 100 },
      category_position: { 
        type: String, 
        required: true,
        enum: ["leader", "challenger", "replicable", "invisible"],
      },
      biggest_leverage_point: { type: String, required: true },
      primary_constraint: { 
        type: String, 
        required: true,
        enum: ["authority", "positioning", "clarity", "momentum", "proof"],
      },
      survival_probability_12m: { type: Number, required: true, min: 0, max: 100 },
    },
    the_ego_stab: {
      triggered_by: { 
        type: [String], 
        default: [],
        enum: ["low_positioning", "weak_proof", "clarity_confusion", "authority_gap", "momentum_flat"],
      },
      severity: { type: Number, required: true, min: 1, max: 100 },
      brutal_summary: { type: String, required: true },
      founder_ego_bait: { type: String, required: true },
      cliche_density: { type: String, required: true },
      founder_bias_risk: { 
        type: String, 
        required: true,
        enum: ["low", "medium", "high"],
      },
      audit: {
        type: [{
          action: { type: String, required: true },
          priority: { type: Number, required: true, min: 0, max: 100 },
        }],
        default: [],
      },
    },
    category_weights: {
      aeo_index: { type: Number, required: true, min: 0, max: 100 },
      positioning_sharpness: { type: Number, required: true, min: 0, max: 100 },
      clarity_velocity: { type: Number, required: true, min: 0, max: 100 },
      momentum_signal: { type: Number, required: true, min: 0, max: 100 },
      founder_proof_vault: { type: Number, required: true, min: 0, max: 100 },
      total_must_equal: { type: Number, required: true, default: 100 },
      weighting_rationale: { type: String, required: true },
    },

    // Legacy fields for backward compatibility
    overallScore: {
      type: Number,
      required: [true, "Overall score is required"],
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["UNTOUCHABLE", "LETHAL", "PLASTIC", "ZOMBIE", "GHOST"],
      required: [true, "Status is required"],
    },
    rawAnalysis: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

ReportSchema.index({ product: 1, createdAt: -1 });
ReportSchema.index({ overallScore: 1 });
ReportSchema.index({ status: 1 });

const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);

export default Report;
