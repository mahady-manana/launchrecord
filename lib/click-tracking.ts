import Click from "@/lib/models/click";
import mongoose from "mongoose";
import {
  aggregateClickStats,
  aggregateOutboundClickStats,
} from "@/lib/click-stats";

/**
 * Initialize click tracking for a new launch
 * Creates an empty click tracking document
 */
export async function initializeClickTracking(
  launchId: string | mongoose.Types.ObjectId,
): Promise<void> {
  try {
    const launchObjectId =
      typeof launchId === "string"
        ? new mongoose.Types.ObjectId(launchId)
        : launchId;

    // Use upsert to create the click tracking document
    await Click.findOneAndUpdate(
      { launchId: launchObjectId },
      {},
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );
  } catch (error) {
    console.error("Error initializing click tracking:", error);
    throw error;
  }
}

/**
 * Initialize click tracking for multiple launches (batch operation)
 */
export async function initializeClickTrackingBatch(
  launchIds: (string | mongoose.Types.ObjectId)[],
): Promise<void> {
  try {
    const operations = launchIds.map((launchId) => {
      const launchObjectId =
        typeof launchId === "string"
          ? new mongoose.Types.ObjectId(launchId)
          : launchId;

      return {
        updateOne: {
          filter: { launchId: launchObjectId },
          update: {},
          upsert: true,
        },
      };
    });

    await Click.bulkWrite(operations);
  } catch (error) {
    console.error("Error initializing click tracking batch:", error);
    throw error;
  }
}

/**
 * Get click stats for a single launch
 */
export async function getClickStatsForLaunch(
  launchId: string | mongoose.Types.ObjectId,
): Promise<{
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
} | null> {
  try {
    const launchObjectId =
      typeof launchId === "string"
        ? new mongoose.Types.ObjectId(launchId)
        : launchId;

    const clickRecord = await Click.findOne({
      launchId: launchObjectId,
    }).lean();

    if (!clickRecord) {
      return {
        all_time: 0,
        all_time_outbound: 0,
        stats: {
          clicks: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
          outbound: { today: 0, thisWeek: 0, lastWeek: 0, thisMonth: 0 },
        },
      };
    }

    const clickStats = aggregateClickStats(clickRecord.daily_clicks);
    const outboundStats = aggregateOutboundClickStats(
      clickRecord.daily_outbound_clicks,
    );

    return {
      all_time: clickRecord.all_time,
      all_time_outbound: clickRecord.all_time_outbound,
      stats: {
        clicks: clickStats,
        outbound: outboundStats,
      },
    };
  } catch (error) {
    console.error("Error getting click stats:", error);
    return null;
  }
}
