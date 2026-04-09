import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import { NextRequest, NextResponse } from "next/server";

// GET - List all SIO reports with optional product info
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");
    const search = request.nextUrl.searchParams.get("search") || "";
    const bandFilter = request.nextUrl.searchParams.get("band") || "";
    const progressFilter = request.nextUrl.searchParams.get("progress") || "";
    const withoutProduct =
      request.nextUrl.searchParams.get("withoutProduct") === "true";

    const skip = (page - 1) * limit;

    const query: any = {};

    // Apply band filter
    if (bandFilter) {
      query.reportBand = bandFilter;
    }

    // Apply progress filter
    if (progressFilter) {
      query.progress = progressFilter;
    }

    // Search in report URL or related product name
    if (search) {
      if (withoutProduct) {
        // Only search in report URL
        query.url = { $regex: search, $options: "i" };
      } else {
        // Search in both URL and product name
        query.$or = [{ url: { $regex: search, $options: "i" } }];
      }
    }

    // Filter reports without product
    if (withoutProduct) {
      query.product = null;
    }

    // Get total count first
    const total = await SIOReport.countDocuments(query);

    // Get reports sorted by creation date
    const reports = await SIOReport.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Fetch product info for each report that has a product reference
    const reportsWithProducts = await Promise.all(
      reports.map(async (report: any) => {
        let productInfo = null;

        if (report.product) {
          productInfo = await Product.findById(report.product)
            .select("name website tagline logo slug")
            .lean();
        }

        return {
          ...report,
          product: productInfo,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: {
        reports: reportsWithProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get SIO reports API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve SIO reports" },
      { status: 500 },
    );
  }
}
