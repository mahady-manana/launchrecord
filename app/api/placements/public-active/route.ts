import Placement from "@/lib/models/placement";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeMongooseDocument } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    // Find all active placements that are currently within their active dates
    const currentDate = new Date();
    const activePlacements = await Placement.find({
      status: "active",
      paymentStatus: "paid",
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Convert to plain objects to remove any potential circular references
    const plainActivePlacements = serializeMongooseDocument(activePlacements);

    return NextResponse.json({
      success: true,
      placements: plainActivePlacements,
    });
  } catch (error) {
    console.error("Error fetching active placements:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch active placements." },
      { status: 500 },
    );
  }
}
