import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import { NextRequest, NextResponse } from "next/server";

const urls = [
  "https://digitalbrainstech.com/",
  "https://pdf-redaction.com/",
  "https://startupmaya.com/",
  "https://www.webtoolkit.tech/",
  "https://gogeoplayer.com/",
  "https://www.phpcrudgenerator.com/",

  "https://www.rentiz.app/",
  "https://coregptapps.com/",
  "https://lingrix.com/",
  "https://sensepm.com/",
  "https://natrajx.in/",
  "https://www.launchrecord.com/",
  "https://retold.me/",
  "https://senti.solutions/",
  "https://www.statnexa.com/",
  "https://presenter3d.com/",
];

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const products = await SIOReport.find({
      progress: "complete",
      product: { $exists: true },
    })
      .populate("product", "logo", Product)
      .sort({ createdAt: -1, name: 1 })
      .select("url product")
      .limit(25);

    const count = await SIOReport.countDocuments({
      progress: "complete",
    });

    return NextResponse.json({
      success: true,
      data: {
        logos: products,
        count: count,
      },
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve logos" },
      { status: 500 },
    );
  }
}
