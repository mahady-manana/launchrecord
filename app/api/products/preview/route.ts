import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import { NextRequest, NextResponse } from "next/server";

export interface ProductPreview {
  id: string;
  _id: string;
  name: string;
  tagline?: string | null;
  logo?: string | null;
  website?: string | null;
  score?: number | null;
  categoryPosition: "leader" | "challenger" | "replicable" | "invisible";
  compositeScore: number;
  statement?: string;
  biggestLeveragePoint?: string;
  pillars: {
    aeo: number;
    positioning: number;
    clarity: number;
    firstImpression: number;
  };
  hasReport: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET - Fetch all user products with preview report data
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { user, response } = await getUserSession({ required: true });
    if (response) {
      return response;
    }

    // Find all products where user is in the users array
    const products = await Product.find({
      users: user?.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        products: [],
      });
    }

    // Find latest reports for all user products
    const productIds = products.map((p) => p._id);
    const reports = await SIOReport.find({
      product: { $in: productIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Create a map of product ID to latest report
    const reportMap = new Map();
    for (const report of reports) {
      const productId = report.product?.toString();
      if (!reportMap.has(productId)) {
        reportMap.set(productId, report);
      }
    }

    // Transform products with report data
    const productPreviews: ProductPreview[] = products.map((product) => {
      const report = reportMap.get(product._id.toString());

      const compositeScore =
        report?.overallScore !== undefined
          ? report.overallScore
          : product.score || 0;

      // Determine category position based on score
      let categoryPosition:
        | "leader"
        | "challenger"
        | "replicable"
        | "invisible" = "invisible";
      if (compositeScore >= 80) {
        categoryPosition = "leader";
      } else if (compositeScore >= 60) {
        categoryPosition = "challenger";
      } else if (compositeScore >= 40) {
        categoryPosition = "replicable";
      }

      return {
        id: product._id.toString(),
        _id: product._id.toString(),
        name: product.name,
        tagline: product.tagline,
        logo: product.logo,
        website: product.website,
        score: report.overallScore,
        categoryPosition,
        compositeScore,
        statement: report?.statement || undefined,
        biggestLeveragePoint:
          report?.overall_assessment?.biggest_leverage_point || undefined,
        pillars: {
          aeo: report?.aeo?.score || 0,
          positioning: report?.positioning?.score || 0,
          clarity: report?.clarity?.score || 0,
          firstImpression: report?.firstImpression?.score || 0,
        },
        hasReport: !!report,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      products: productPreviews,
    });
  } catch (error) {
    console.error("Get products preview API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products preview" },
      { status: 500 },
    );
  }
}
