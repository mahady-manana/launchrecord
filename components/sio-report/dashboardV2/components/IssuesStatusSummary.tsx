"use client";

import { Issue } from "./IssueCard";

interface IssuesStatusSummaryProps {
  issues: Issue[];
}

export function IssuesStatusSummary({ issues }: IssuesStatusSummaryProps) {
  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50/50">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs font-bold text-red-700">
          {counts.critical} Critical issues
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-100 bg-orange-50/50">
        <span className="w-2 h-2 rounded-full bg-orange-500" />
        <span className="text-xs font-bold text-orange-700">
          {counts.high} High friction issues
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-yellow-100 bg-yellow-50/50">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="text-xs font-bold text-yellow-800">
          {counts.medium} Medium issues
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-100 bg-blue-50/50">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-xs font-bold text-blue-700">
          {counts.low} Suggestions & recommendations
        </span>
      </div>
    </div>
  );
}
