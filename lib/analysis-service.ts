import type { IProduct } from "@/models/product";
import Report from "@/models/report";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import { connectToDatabase } from "@/lib/db";

export interface SaveAnalysisOptions {
  product: IProduct;
  report: AuditReportV1;
  rawResponse?: string;
}

export async function saveAnalysis({
  product,
  report,
  rawResponse,
}: SaveAnalysisOptions): Promise<Report> {
  await connectToDatabase();

  // Map V1 report to legacy fields for backward compatibility
  const overallScore = report.overall_assessment.composite_score;
  const status = mapScoreToStatus(overallScore);

  const reportDoc = await Report.create({
    product: product._id,
    
    // V1 Audit Format Fields
    meta: report.meta,
    aeo_index: report.aeo_index,
    positioning_sharpness: report.positioning_sharpness,
    clarity_velocity: report.clarity_velocity,
    momentum_signal: report.momentum_signal,
    founder_proof_vault: report.founder_proof_vault,
    top_competitors: report.top_competitors,
    overall_assessment: report.overall_assessment,
    the_ego_stab: report.the_ego_stab,
    category_weights: report.category_weights,

    // Legacy fields for backward compatibility
    overallScore,
    status,
    rawAnalysis: rawResponse || null,
  });

  // Update product score
  product.score = overallScore;
  await product.save();

  return reportDoc;
}

function mapScoreToStatus(score: number): "UNTOUCHABLE" | "LETHAL" | "PLASTIC" | "ZOMBIE" | "GHOST" {
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

  return report;
}

export async function getProductAnalysisHistory(
  productId: string,
): Promise<Report[]> {
  await connectToDatabase();

  const reports = await Report.find({ product: productId })
    .sort({ createdAt: -1 })
    .populate("product");

  return reports;
}

export async function getRecentAnalyses(limit: number = 10): Promise<Report[]> {
  await connectToDatabase();

  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("product");

  return reports;
}
