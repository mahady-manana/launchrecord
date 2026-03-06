import { connectToDatabase } from "@/lib/db";
import { getUserSession } from "@/lib/session";
import Product from "@/models/product";
import Report from "@/models/report";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // In production, get userId from session/auth
    // For now, we'll fetch the most recent report
    const { response, user } = await getUserSession({ required: true });
    if (response) {
      return response;
    }
    const userProduct = await Product.findOne({ users: user?._id });
    if (!userProduct) {
      return NextResponse.json({ error: "No product found" }, { status: 404 });
    }
    const latestReport = await Report.findOne({ product: userProduct._id })
      .sort({ createdAt: -1 })
      .populate("product");

    if (!latestReport) {
      return NextResponse.json(
        { error: "No audit reports found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      report: {
        meta: latestReport.meta,
        aeo_index: latestReport.aeo_index,
        positioning_sharpness: latestReport.positioning_sharpness,
        clarity_velocity: latestReport.clarity_velocity,
        momentum_signal: latestReport.momentum_signal,
        founder_proof_vault: latestReport.founder_proof_vault,
        top_competitors: latestReport.top_competitors,
        overall_assessment: latestReport.overall_assessment,
        the_ego_stab: latestReport.the_ego_stab,
        category_weights: latestReport.category_weights,
      },
    });
  } catch (error) {
    console.error("Error fetching latest audit:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit report" },
      { status: 500 },
    );
  }
}
