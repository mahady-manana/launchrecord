"use client";

import { useClickStats } from "@/hooks/use-click-tracking";
import { cn } from "@/lib/utils";

interface ClickStatsDisplayProps {
  productId: string;
  className?: string;
  showOutbound?: boolean;
  compact?: boolean;
}

export function ClickStatsDisplay({
  productId,
  className,
  showOutbound = false,
  compact = false,
}: ClickStatsDisplayProps) {
  const stats = useClickStats(productId, true);

  if (!stats) {
    return null;
  }

  if (compact) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        <span className="font-medium">{stats.all_time}</span> clicks
        {showOutbound && stats.all_time_outbound > 0 && (
          <span className="ml-2">
            (<span className="font-medium">{stats.all_time_outbound}</span>{" "}
            outbound)
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">All Time</div>
          <div className="text-2xl font-bold">{stats.all_time}</div>
        </div>
        {showOutbound && (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Outbound</div>
            <div className="text-2xl font-bold">{stats.all_time_outbound}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t">
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Today</div>
          <div className="text-lg font-semibold">{stats.stats.clicks.today}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">This Week</div>
          <div className="text-lg font-semibold">
            {stats.stats.clicks.thisWeek}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">This Month</div>
          <div className="text-lg font-semibold">
            {stats.stats.clicks.thisMonth}
          </div>
        </div>
      </div>

      {showOutbound && stats.all_time_outbound > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              Outbound Today
            </div>
            <div className="text-lg font-semibold">
              {stats.stats.outbound.today}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              Outbound Week
            </div>
            <div className="text-lg font-semibold">
              {stats.stats.outbound.thisWeek}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              Outbound Month
            </div>
            <div className="text-lg font-semibold">
              {stats.stats.outbound.thisMonth}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simple click count badge component
 */
export function ClickCountBadge({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const stats = useClickStats(productId, true);

  if (!stats || stats.all_time === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs",
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8v8" />
        <path d="M10 8v8" />
        <path d="M14 8v8" />
        <path d="M18 8v8" />
      </svg>
      {stats.all_time}
    </div>
  );
}
