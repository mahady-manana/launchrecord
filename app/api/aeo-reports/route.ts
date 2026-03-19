import Report from "@/models/report";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/aeo-reports
 *
 * Get AEO reports for a product with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      Report.find({
        product: new mongoose.Types.ObjectId(productId),
        "aeo_index.score": { $exists: true },
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("_id url aeo_index.score aeo_index.audit createdAt")
        .exec(),
      Report.countDocuments({
        product: new mongoose.Types.ObjectId(productId),
        "aeo_index.score": { $exists: true },
      }),
    ]);

    // Transform reports to match expected format
    const transformedReports = reports.map((report) => ({
      _id: report._id.toString(),
      url: report.meta?.analysis_scope || "Unknown URL",
      score: report.aeo_index?.score || 0,
      maxScore: 100,
      checks: report.aeo_index?.audit || [],
      createdAt: report.createdAt,
    }));

    return NextResponse.json({
      reports: transformedReports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get AEO reports error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
