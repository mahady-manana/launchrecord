import { NextRequest, NextResponse } from "next/server";
import {
  getAveragePositioningScore,
  getPositioningTrendData,
  getPositioningReportCount,
  getPositioningReportsByBand,
} from "@/services/positioning-audit";
import { Types } from "mongoose";

/**
 * GET /api/positioning-reports/stats
 * 
 * Get positioning report statistics for a product
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    const type = searchParams.get("type") || "all";

    // Get trend data
    if (type === "trend") {
      const limit = parseInt(searchParams.get("limit") || "10");
      const trendData = await getPositioningTrendData(productId, limit);
      return NextResponse.json({ trend: trendData });
    }

    // Get reports by band
    if (type === "by-band") {
      const band = searchParams.get("band");
      if (!band) {
        return NextResponse.json(
          { error: "band is required for by-band type" },
          { status: 400 },
        );
      }
      const reports = await getPositioningReportsByBand(
        productId,
        band as any,
      );
      return NextResponse.json({ reports });
    }

    // Get all stats
    const [averageScore, totalReports, trendData] = await Promise.all([
      getAveragePositioningScore(productId),
      getPositioningReportCount(productId),
      getPositioningTrendData(productId, 10),
    ]);

    return NextResponse.json({
      averageScore: averageScore || 0,
      totalReports,
      trend: trendData,
      latestReport: trendData.length > 0 ? trendData[0] : null,
    });
  } catch (error) {
    console.error("Get positioning stats error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
