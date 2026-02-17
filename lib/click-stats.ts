import { IDailyClick, IDailyOutboundClick } from "@/lib/models/click";

/**
 * Get today's date string in UTC (YYYY-MM-DD format)
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get the start of the current week (Monday)
 */
export function getStartOfWeek(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if Sunday
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

/**
 * Get the start of last week (Monday)
 */
export function getStartOfLastWeek(): Date {
  const startOfWeek = getStartOfWeek();
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);
  return startOfLastWeek;
}

/**
 * Get the start of the current month
 */
export function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Get the end of the current month
 */
export function getEndOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Calculate click statistics from daily clicks array
 */
export function aggregateClickStats(
  dailyClicks: IDailyClick[],
): {
  today: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
} {
  const todayStr = getTodayDateString();
  const startOfWeekStr = getStartOfWeek().toISOString().split("T")[0];
  const startOfLastWeekStr = getStartOfLastWeek().toISOString().split("T")[0];
  const startOfMonthStr = getStartOfMonth().toISOString().split("T")[0];

  // Today
  const today = dailyClicks.find((d) => d.date === todayStr)?.clicks || 0;

  // This week (Monday to today)
  const thisWeek = dailyClicks
    .filter((d) => d.date >= startOfWeekStr && d.date <= todayStr)
    .reduce((sum, d) => sum + d.clicks, 0);

  // Last week
  const lastWeek = dailyClicks
    .filter(
      (d) => d.date >= startOfLastWeekStr && d.date < startOfWeekStr,
    )
    .reduce((sum, d) => sum + d.clicks, 0);

  // This month
  const thisMonth = dailyClicks
    .filter((d) => d.date >= startOfMonthStr && d.date <= todayStr)
    .reduce((sum, d) => sum + d.clicks, 0);

  return {
    today,
    thisWeek,
    lastWeek,
    thisMonth,
  };
}

/**
 * Calculate outbound click statistics from daily outbound clicks array
 */
export function aggregateOutboundClickStats(
  dailyOutboundClicks: IDailyOutboundClick[],
): {
  today: number;
  thisWeek: number;
  lastWeek: number;
  thisMonth: number;
} {
  const todayStr = getTodayDateString();
  const startOfWeekStr = getStartOfWeek().toISOString().split("T")[0];
  const startOfLastWeekStr = getStartOfLastWeek().toISOString().split("T")[0];
  const startOfMonthStr = getStartOfMonth().toISOString().split("T")[0];

  // Today
  const today =
    dailyOutboundClicks.find((d) => d.date === todayStr)?.clicks || 0;

  // This week (Monday to today)
  const thisWeek = dailyOutboundClicks
    .filter((d) => d.date >= startOfWeekStr && d.date <= todayStr)
    .reduce((sum, d) => sum + d.clicks, 0);

  // Last week
  const lastWeek = dailyOutboundClicks
    .filter(
      (d) => d.date >= startOfLastWeekStr && d.date < startOfWeekStr,
    )
    .reduce((sum, d) => sum + d.clicks, 0);

  // This month
  const thisMonth = dailyOutboundClicks
    .filter((d) => d.date >= startOfMonthStr && d.date <= todayStr)
    .reduce((sum, d) => sum + d.clicks, 0);

  return {
    today,
    thisWeek,
    lastWeek,
    thisMonth,
  };
}

/**
 * Get clicks for a specific date range
 */
export function getClicksForDateRange(
  dailyClicks: IDailyClick[],
  startDate: Date,
  endDate: Date = new Date(),
): number {
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  return dailyClicks
    .filter((d) => d.date >= startStr && d.date <= endStr)
    .reduce((sum, d) => sum + d.clicks, 0);
}

/**
 * Get outbound clicks for a specific date range
 */
export function getOutboundClicksForDateRange(
  dailyOutboundClicks: IDailyOutboundClick[],
  startDate: Date,
  endDate: Date = new Date(),
): number {
  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  return dailyOutboundClicks
    .filter((d) => d.date >= startStr && d.date <= endStr)
    .reduce((sum, d) => sum + d.clicks, 0);
}

/**
 * Get the last N days of click data
 */
export function getLastNDaysClicks(
  dailyClicks: IDailyClick[],
  n: number,
): IDailyClick[] {
  const today = new Date();
  const nDaysAgo = new Date(today);
  nDaysAgo.setDate(today.getDate() - (n - 1));
  nDaysAgo.setHours(0, 0, 0, 0);

  const nDaysAgoStr = nDaysAgo.toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  return dailyClicks
    .filter((d) => d.date >= nDaysAgoStr && d.date <= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date));
}
