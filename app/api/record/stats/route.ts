import Click from "@/lib/models/click";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  aggregateClickStats,
  aggregateOutboundClickStats,
  getTodayDateString,
  getStartOfWeek,
  getStartOfMonth,
} from "@/lib/click-stats";

const batchStatsRequestSchema = z.object({
  productIds: z.array(z.string()).min(1).max(100),
});

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const parsed = batchStatsRequestSchema.parse(body);
    const { productIds } = parsed;

    // Convert string IDs to ObjectId
    const { ObjectId } = require("mongoose").Types;
    const objectIds = productIds.map((id) => new ObjectId(id));

    // Fetch all click records in a single query
    const clickRecords = await Click.find({
      launchId: { $in: objectIds },
    }).lean();

    // Build a map of results
    const results = new Map<
      string,
      {
        all_time: number;
        all_time_outbound: number;
        stats: {
          clicks: {
            today: number;
            thisWeek: number;
            lastWeek: number;
            thisMonth: number;
          };
          outbound: {
            today: number;
            thisWeek: number;
            lastWeek: number;
            thisMonth: number;
          };
        };
      }
    >();

    for (const record of clickRecords) {
      const launchIdStr = record.launchId.toString();
      const clickStats = aggregateClickStats(record.daily_clicks);
      const outboundStats = aggregateOutboundClickStats(
        record.daily_outbound_clicks,
      );

      results.set(launchIdStr, {
        all_time: record.all_time,
        all_time_outbound: record.all_time_outbound,
        stats: {
          clicks: clickStats,
          outbound: outboundStats,
        },
      });
    }

    // Fill in zeros for products without click records
    for (const productId of productIds) {
      if (!results.has(productId)) {
        results.set(productId, {
          all_time: 0,
          all_time_outbound: 0,
          stats: {
            clicks: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
            outbound: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
          },
        });
      }
    }

    // Convert map to object
    const statsObject = Object.fromEntries(results);

    return NextResponse.json({
      success: true,
      stats: statsObject,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0]?.message || "Invalid request.",
        },
        { status: 400 },
      );
    }

    console.error("Error fetching batch click stats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch click stats." },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint to fetch top launches by clicks
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const timeRange = searchParams.get("timeRange") || "all_time";

    // Build aggregation pipeline based on time range
    let sortField: string;
    let unwindField: string;

    switch (timeRange) {
      case "today":
      case "week":
      case "month":
        // For time-based ranges, we need to aggregate from daily_clicks
        const clickRecords = await Click.find({})
          .select("launchId daily_clicks")
          .lean();

        const todayStr = getTodayDateString();
        const startOfWeekStr = getStartOfWeek().toISOString().split("T")[0];
        const startOfMonthStr = getStartOfMonth().toISOString().split("T")[0];

        let dateFilter: string;
        switch (timeRange) {
          case "today":
            dateFilter = todayStr;
            break;
          case "week":
            dateFilter = startOfWeekStr;
            break;
          case "month":
            dateFilter = startOfMonthStr;
            break;
          default:
            dateFilter = todayStr;
        }

        // Calculate clicks for each launch
        const launchClicks = clickRecords.map((record) => {
          let totalClicks = 0;

          switch (timeRange) {
            case "today":
              totalClicks =
                record.daily_clicks.find((d) => d.date === todayStr)
                  ?.clicks || 0;
              break;
            case "week":
              totalClicks = record.daily_clicks
                .filter((d) => d.date >= startOfWeekStr && d.date <= todayStr)
                .reduce((sum, d) => sum + d.clicks, 0);
              break;
            case "month":
              totalClicks = record.daily_clicks
                .filter((d) => d.date >= startOfMonthStr && d.date <= todayStr)
                .reduce((sum, d) => sum + d.clicks, 0);
              break;
          }

          return {
            launchId: record.launchId.toString(),
            clicks: totalClicks,
          };
        });

        // Sort and limit
        const sorted = launchClicks
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, limit);

        return NextResponse.json({
          success: true,
          stats: sorted,
          timeRange,
        });

      case "all_time":
      default:
        sortField = "all_time";
        break;
    }

    // For all_time, use simple find and sort
    const topLaunches = await Click.find({})
      .select(`launchId ${sortField}`)
      .sort({ [sortField]: -1 })
      .limit(limit)
      .lean();

    const stats = topLaunches.map((record) => ({
      launchId: record.launchId.toString(),
      clicks: record.all_time,
    }));

    return NextResponse.json({
      success: true,
      stats,
      timeRange,
    });
  } catch (error) {
    console.error("Error fetching top launches:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch top launches." },
      { status: 500 },
    );
  }
}
