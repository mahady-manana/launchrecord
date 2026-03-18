import PositioningReport, {
  type IPositioningReport,
} from "@/models/positioning-report";
import type { PositioningAuditResult } from "@/services/positioning-audit";
import mongoose, { Types } from "mongoose";

/**
 * Create a new positioning report
 */
export async function createPositioningReport(
  productId: string | Types.ObjectId,
  url: string,
  auditResult: PositioningAuditResult,
  metadata?: {
    auditDuration?: number;
    tokenUsage?: number;
    modelUsed?: string;
    rawAnalysis?: string;
  },
): Promise<IPositioningReport> {
  const positioningBand = getPositioningBand(auditResult.overallScore);

  const report = await PositioningReport.create({
    product: new Types.ObjectId(productId.toString()),
    url: url.toLowerCase(),
    overallScore: auditResult.overallScore,
    positioningBand,
    categoryOwnership: auditResult.categoryOwnership,
    uniqueValueProposition: auditResult.uniqueValueProposition,
    competitiveDifferentiation: auditResult.competitiveDifferentiation,
    targetAudienceClarity: auditResult.targetAudienceClarity,
    problemSolutionFit: auditResult.problemSolutionFit,
    messagingConsistency: auditResult.messagingConsistency,
    ...metadata,
  });

  return report;
}

/**
 * Get a positioning report by ID
 */
export async function getPositioningReportById(
  reportId: string | Types.ObjectId,
): Promise<IPositioningReport | null> {
  return PositioningReport.findById(reportId).populate("product").exec();
}

/**
 * Get the latest positioning report for a product
 */
export async function getLatestPositioningReport(
  productId: string | Types.ObjectId,
): Promise<IPositioningReport | null> {
  return PositioningReport.findOne({
    product: new Types.ObjectId(productId.toString()),
  })
    .sort({ createdAt: -1 })
    .exec();
}

/**
 * Get all positioning reports for a product (paginated)
 */
export async function getPositioningReports(
  productId: string | Types.ObjectId,
  options?: {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "overallScore";
    sortOrder?: "asc" | "desc";
  },
): Promise<{
  reports: IPositioningReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options || {};

  const skip = (page - 1) * limit;
  const sortOptions: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "desc" ? -1 : 1,
  };

  const [reports, total] = await Promise.all([
    PositioningReport.find({
      product: new Types.ObjectId(productId.toString()),
    })
      .populate("product")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .exec(),
    PositioningReport.countDocuments({
      product: new Types.ObjectId(productId.toString()),
    }),
  ]);

  return {
    reports,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get positioning reports by score range
 */
export async function getPositioningReportsByScoreRange(
  productId: string | Types.ObjectId,
  minScore: number,
  maxScore: number,
): Promise<IPositioningReport[]> {
  return PositioningReport.find({
    product: new Types.ObjectId(productId.toString()),
    overallScore: { $gte: minScore, $lte: maxScore },
  })
    .sort({ createdAt: -1 })
    .exec();
}

/**
 * Get positioning reports by positioning band
 */
export async function getPositioningReportsByBand(
  productId: string | Types.ObjectId,
  band: IPositioningReport["positioningBand"],
): Promise<IPositioningReport[]> {
  return PositioningReport.find({
    product: new Types.ObjectId(productId.toString()),
    positioningBand: band,
  })
    .sort({ createdAt: -1 })
    .exec();
}

/**
 * Get average score for a product
 */
export async function getAveragePositioningScore(
  productId: string | Types.ObjectId,
): Promise<number | null> {
  const result = await PositioningReport.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId.toString()) } },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$overallScore" },
      },
    },
  ]);
  return result.length > 0 ? Math.round(result[0].avgScore) : null;
}

/**
 * Get trend data for a product
 */
export async function getPositioningTrendData(
  productId: string | Types.ObjectId,
  limit = 10,
): Promise<Array<{ date: Date; score: number; band: string }>> {
  const reports = await PositioningReport.find({
    product: new Types.ObjectId(productId.toString()),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("createdAt overallScore positioningBand")
    .exec();

  return reports.map((report: any) => ({
    date: report.createdAt,
    score: report.overallScore,
    band: report.positioningBand,
  }));
}

/**
 * Update a positioning report
 */
export async function updatePositioningReport(
  reportId: string | Types.ObjectId,
  updates: Partial<IPositioningReport>,
): Promise<IPositioningReport | null> {
  // Remove fields that shouldn't be updated directly
  const { _id, product, url, createdAt, updatedAt, ...allowedUpdates } =
    updates as any;

  const report = await PositioningReport.findByIdAndUpdate(
    reportId,
    { $set: allowedUpdates },
    { new: true, runValidators: true },
  ).exec();

  return report;
}

/**
 * Delete a positioning report
 */
export async function deletePositioningReport(
  reportId: string | Types.ObjectId,
): Promise<boolean> {
  const result = await PositioningReport.findByIdAndDelete(reportId).exec();
  return result !== null;
}

/**
 * Delete all positioning reports for a product
 */
export async function deleteAllPositioningReports(
  productId: string | Types.ObjectId,
): Promise<number> {
  const result = await PositioningReport.deleteMany({
    product: new Types.ObjectId(productId.toString()),
  }).exec();
  return result.deletedCount || 0;
}

/**
 * Check if a recent report exists for a product (within N days)
 */
export async function hasRecentPositioningReport(
  productId: string | Types.ObjectId,
  days = 30,
): Promise<boolean> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const report = await PositioningReport.findOne({
    product: new Types.ObjectId(productId.toString()),
    createdAt: { $gte: cutoffDate },
  }).exec();

  return report !== null;
}

/**
 * Get reports count for a product
 */
export async function getPositioningReportCount(
  productId: string | Types.ObjectId,
): Promise<number> {
  return PositioningReport.countDocuments({
    product: new Types.ObjectId(productId.toString()),
  });
}

/**
 * Get positioning band from score
 */
function getPositioningBand(
  score: number,
): IPositioningReport["positioningBand"] {
  if (score >= 90) return "Dominant";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Blended";
  if (score >= 30) return "Weak";
  return "Ghost";
}

/**
 * Export for direct model access if needed
 */
export { PositioningReport };
