"use client";

import { Button } from "@/components/ui/button";
import { Issue, IssueCard } from "./IssueCard";
import { IssuesStatusSummary } from "./IssuesStatusSummary";

interface IssuesPreviewProps {
  issues: Issue[];
  onViewAll: () => void;
}

export function IssuesPreview({ issues, onViewAll }: IssuesPreviewProps) {
  // Extract specific counts: 1 critical, 2 high, 2 medium, 2 low
  const getTopIssues = () => {
    const critical = issues
      .filter((i) => i.severity === "critical")
      .slice(0, 1);
    const high = issues.filter((i) => i.severity === "high").slice(0, 2);
    const mdm = issues.filter((i) => i.severity === "medium").slice(0, 2);
    const low = issues.filter((i) => i.severity === "low").slice(0, 2);

    return [...critical, ...high, ...mdm, ...low];
  };

  const previewIssues = getTopIssues();

  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    high: issues.filter((i) => i.severity === "high").length,
    medium: issues.filter((i) => i.severity === "medium").length,
    low: issues.filter((i) => i.severity === "low").length,
  };

  if (previewIssues.length === 0) return null;

  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Priority Action Items
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Foundational changes to maximize conversion potential.
          </p>
        </div>
      </div>

      <IssuesStatusSummary issues={issues} />

      <div className="grid grid-cols-1 gap-6">
        {previewIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>

      {/* Signup CTA / Paywall Block */}
      <div className="py-4">
        <Button onClick={onViewAll} className="w-full">
          See all {counts.critical + counts.high + counts.medium + counts.low}{" "}
          issues and recommendations
        </Button>
      </div>
    </div>
  );
}
