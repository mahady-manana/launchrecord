import {
  aggregateClickStats,
  aggregateOutboundClickStats,
} from "@/lib/click-stats";
import Click from "@/lib/models/click";
import FeaturedLaunch from "@/lib/models/featured-launch";
import Launch from "@/lib/models/launch";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeMongooseDocument } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const getFeaturedSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const parsedQuery = getFeaturedSchema.parse({
      limit: searchParams.get("limit") || 10,
    });

    const now = new Date();
    const name = Launch.name;
    console.log("====================================");
    console.log(name);
    console.log("====================================");
    // Find active featured launches
    const featuredLaunches = await FeaturedLaunch.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ priority: -1, startDate: -1 })
      .limit(parsedQuery.limit)
      .populate("launchId")
      .lean();

    // Filter out any featured launches where the launch doesn't exist or is archived
    const validFeaturedLaunches = featuredLaunches.filter(
      (fl: any) => fl.launchId && !fl.launchId.isArchived,
    );

    // Extract launch IDs
    const launchIds = validFeaturedLaunches.map((fl: any) => fl.launchId._id);

    // Fetch click stats for all featured launches
    const clickRecords = await Click.find({
      launchId: { $in: launchIds },
    })
      .select(
        "launchId all_time all_time_outbound daily_clicks daily_outbound_clicks",
      )
      .lean();

    // Build click stats map
    const clickStatsMap = new Map();
    for (const record of clickRecords) {
      const launchIdStr = record.launchId.toString();
      const clickStats = aggregateClickStats(record.daily_clicks);
      const outboundStats = aggregateOutboundClickStats(
        record.daily_outbound_clicks,
      );
      clickStatsMap.set(launchIdStr, {
        all_time: record.all_time,
        all_time_outbound: record.all_time_outbound,
        stats: {
          clicks: clickStats,
          outbound: outboundStats,
        },
      });
    }

    // Build response with featured launches and their click stats
    const plainFeaturedLaunches = serializeMongooseDocument(
      validFeaturedLaunches,
    ).map((fl: any) => {
      const launch = fl.launchId;
      const launchIdStr = launch._id.toString();
      return {
        _id: fl._id,
        launchId: launch._id,
        startDate: fl.startDate,
        endDate: fl.endDate,
        isActive: fl.isActive,
        priority: fl.priority,
        createdAt: fl.createdAt,
        updatedAt: fl.updatedAt,
        launch: {
          ...launch,
          clickStats: clickStatsMap.get(launchIdStr) || {
            all_time: 0,
            all_time_outbound: 0,
            stats: {
              clicks: {
                today: 0,
                thisWeek: 0,
                lastWeek: 0,
                thisMonth: 0,
              },
              outbound: {
                today: 0,
                thisWeek: 0,
                lastWeek: 0,
                thisMonth: 0,
              },
            },
          },
        },
      };
    });

    return NextResponse.json({
      success: true,
      featuredLaunches: plainFeaturedLaunches,
      count: plainFeaturedLaunches.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid query.",
        },
        { status: 400 },
      );
    }

    console.error("Error fetching featured launches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch featured launches." },
      { status: 500 },
    );
  }
}
