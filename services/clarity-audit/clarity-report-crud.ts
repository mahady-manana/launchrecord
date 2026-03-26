import { connectToDatabase } from "@/lib/db";
import ClarityReportModel from "@/models/clarity-report";
import mongoose from "mongoose";
import type { ClarityReport } from "./types";

/**
 * Transform MongoDB document to ClarityReport type
 */
function transformReport(doc: any): ClarityReport {
  return {
    _id: doc._id.toString(),
    productId: doc.product.toString(),
    url: doc.url,
    score: doc.score,
    band: doc.band,
    critique: doc.critique,
    metrics: doc.metrics,
    findings: doc.findings || [],
    recommendations: doc.recommendations || [],
    fiveSecondTest: doc.fiveSecondTest,
    metadata: {
      auditDuration: doc.auditDuration,
      tokenUsage: doc.tokenUsage,
      modelUsed: doc.modelUsed,
    },
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

/**
 * Create a new clarity report
 */
export async function createClarityReport(
  productId: string,
  url: string,
  auditResult: {
    score: number;
    band: string;
    critique: string;
    metrics: any;
    findings: string[];
    recommendations: Array<{ action: string; priority: number }>;
    fiveSecondTest: any;
  },
  metadata?: {
    auditDuration?: number;
    tokenUsage?: number;
    modelUsed?: string;
  },
): Promise<ClarityReport> {
  await connectToDatabase();

  const report = await ClarityReportModel.create({
    product: productId,
    url,
    score: auditResult.score,
    band: auditResult.band,
    critique: auditResult.critique,
    metrics: auditResult.metrics,
    findings: auditResult.findings,
    recommendations: auditResult.recommendations,
    fiveSecondTest: auditResult.fiveSecondTest,
    auditDuration: metadata?.auditDuration,
    tokenUsage: metadata?.tokenUsage,
    modelUsed: metadata?.modelUsed,
  });

  return transformReport(report);
}

/**
 * Get clarity report by ID
 */
export async function getClarityReportById(
  reportId: string,
): Promise<ClarityReport | null> {
  await connectToDatabase();

  const report = await ClarityReportModel.findById(reportId).lean();
  if (!report) return null;

  return transformReport(report);
}

/**
 * Get latest clarity report for a product
 */
export async function getLatestClarityReport(
  productId: string,
): Promise<ClarityReport | null> {
  await connectToDatabase();

  const report = await ClarityReportModel.findOne({ product: productId })
    .sort({ createdAt: -1 })
    .lean();

  if (!report) return null;
  return transformReport(report);
}

/**
 * Get paginated list of clarity reports for a product
 */
export async function getClarityReports(
  productId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {},
): Promise<{
  reports: ClarityReport[];
  total: number;
  page: number;
  limit: number;
}> {
  await connectToDatabase();

  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const skip = (page - 1) * limit;
  const sortField = sortBy === "score" ? "score" : "createdAt";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [reports, total] = await Promise.all([
    ClarityReportModel.find({ product: productId })
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean(),
    ClarityReportModel.countDocuments({ product: productId }),
  ]);

  return {
    reports: reports.map(transformReport),
    total,
    page,
    limit,
  };
}

/**
 * Get clarity reports by score range
 */
export async function getClarityReportsByScoreRange(
  productId: string,
  minScore: number,
  maxScore: number,
): Promise<ClarityReport[]> {
  await connectToDatabase();

  const reports = await ClarityReportModel.find({
    product: productId,
    score: { $gte: minScore, $lte: maxScore },
  })
    .sort({ createdAt: -1 })
    .lean();

  return reports.map(transformReport);
}

/**
 * Get clarity reports by band
 */
export async function getClarityReportsByBand(
  productId: string,
  band: "instant" | "clear" | "average" | "confusing" | "opaque",
): Promise<ClarityReport[]> {
  await connectToDatabase();

  const reports = await ClarityReportModel.find({
    product: productId,
    band,
  })
    .sort({ createdAt: -1 })
    .lean();

  return reports.map(transformReport);
}

/**
 * Update clarity report
 */
export async function updateClarityReport(
  reportId: string,
  updates: Partial<ClarityReport>,
): Promise<ClarityReport | null> {
  await connectToDatabase();

  const report = await ClarityReportModel.findByIdAndUpdate(
    reportId,
    { $set: updates, updatedAt: new Date() },
    { new: true, lean: true },
  );

  if (!report) return null;
  return transformReport(report);
}

/**
 * Delete clarity report
 */
export async function deleteClarityReport(reportId: string): Promise<boolean> {
  await connectToDatabase();

  const result = await ClarityReportModel.findByIdAndDelete(reportId);
  return !!result;
}

/**
 * Delete all clarity reports for a product
 */
export async function deleteAllClarityReports(
  productId: string,
): Promise<number> {
  await connectToDatabase();

  const result = await ClarityReportModel.deleteMany({ product: productId });
  return result.deletedCount;
}

/**
 * Check if product has recent clarity report (within specified days)
 */
export async function hasRecentClarityReport(
  productId: string,
  days: number = 30,
): Promise<boolean> {
  await connectToDatabase();

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  const report = await ClarityReportModel.findOne({
    product: productId,
    createdAt: { $gte: daysAgo },
  });

  return !!report;
}

/**
 * Get average clarity score for a product
 */
export async function getAverageClarityScore(
  productId: string,
): Promise<number | null> {
  await connectToDatabase();

  const result = await ClarityReportModel.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$score" },
      },
    },
  ]);

  if (result.length === 0) return null;
  return Math.round(result[0].avgScore);
}

/**
 * Get clarity trend data (last N reports)
 */
export async function getClarityTrendData(
  productId: string,
  limit: number = 10,
): Promise<Array<{ date: Date; score: number; band: string }>> {
  await connectToDatabase();

  const reports = await ClarityReportModel.find({ product: productId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("score band createdAt")
    .lean();

  return reports
    .map((r: any) => ({
      date: r.createdAt,
      score: r.score,
      band: r.band,
    }))
    .reverse();
}

/**
 * Get report count for a product
 */
export async function getClarityReportCount(
  productId: string,
): Promise<number> {
  await connectToDatabase();
  return ClarityReportModel.countDocuments({ product: productId });
}
