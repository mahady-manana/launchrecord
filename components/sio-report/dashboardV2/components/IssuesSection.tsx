"use client";

import { useState } from "react";
import { Issue, IssueCard } from "./IssueCard";
import { IssuesStatusSummary } from "./IssuesStatusSummary";

type IssueCategory = "positioning" | "clarity" | "first_impression" | "aeo";

interface IssuesSectionProps {
  issues: Issue[];
  isFree?: boolean;
}

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  positioning: "Positioning",
  clarity: "Clarity",
  first_impression: "First Impression",
  aeo: "AEO",
};

const CATEGORY_COLORS: Record<IssueCategory, string> = {
  positioning: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  clarity:
    "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
  first_impression:
    "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
  aeo: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
};

export function IssuesSection({ issues, isFree = false }: IssuesSectionProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<
    Set<IssueCategory>
  >(new Set(["positioning", "clarity", "first_impression", "aeo"]));

  const toggleIssue = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const toggleCategory = (category: IssueCategory) => {
    setSelectedCategories(new Set([category]));
  };

  const toggleAllCategories = () => {
    setSelectedCategories(
      new Set(["positioning", "clarity", "first_impression", "aeo"]),
    );
  };

  // Filter issues by selected categories
  const filteredIssues = issues.filter((issue) =>
    selectedCategories.has(issue.category as IssueCategory),
  );

  // Group issues by severity
  const groupedIssues = filteredIssues.reduce(
    (acc, issue) => {
      if (!acc[issue.severity]) {
        acc[issue.severity] = [];
      }
      acc[issue.severity].push(issue);
      return acc;
    },
    {} as Record<string, Issue[]>,
  );

  const severityOrder = ["critical", "high", "medium", "low"] as const;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <p className="text-gray-600 mb-6">
          Here's what we found that could be improved on your website. Issues
          are prioritized by severity and impact.
        </p>

        {/* Filter by Category */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Filter by Metric
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAllCategories}
              className={`px-3 py-1.5 rounded-full text-sm font-medium  transition-colors ${
                selectedCategories.size === 4
                  ? "bg-slate-200 text-slate-600 border-slate-200 hover:bg-slate-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-150"
              }`}
            >
              All Issues
            </button>

            {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map(
              (category) => {
                const isSelected = selectedCategories.has(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      isSelected
                        ? "bg-slate-200 text-slate-600 border-slate-200 hover:bg-slate-200"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-150"
                    }`}
                  >
                    {CATEGORY_LABELS[category]}
                  </button>
                );
              },
            )}
          </div>
        </div>

        <IssuesStatusSummary issues={filteredIssues} />

        {severityOrder.map((severity) => {
          const severityIssues = groupedIssues[severity] || [];
          if (severityIssues.length === 0) return null;

          return (
            <div key={severity} className="mb-8">
              <h4 className="text-lg font-semibold capitalize mb-4 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    severity === "critical"
                      ? "bg-red-500"
                      : severity === "high"
                        ? "bg-orange-500"
                        : severity === "medium"
                          ? "bg-yellow-400"
                          : "bg-blue-500"
                  }`}
                />
                {severity === "low"
                  ? "Improvement Suggestions"
                  : `${severity} Issues`}{" "}
                ({severityIssues.length})
              </h4>

              <div className="space-y-4">
                {severityIssues.map((issue) => {
                  const isExpanded = expandedIssues.has(issue.id);
                  const isLocked = isFree && !issue.isVisibleInFree;

                  return (
                    <div key={issue.id} className="space-y-2">
                      <IssueCard
                        issue={issue}
                        isLocked={isLocked}
                        showDetails={isExpanded || !isLocked}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {issues.length === 0 && (
          <div className="text-center py-12">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Issues Found!
            </h4>
            <p className="text-gray-600">
              Your website looks great. No critical issues were identified.
            </p>
          </div>
        )}

        {filteredIssues.length === 0 && issues.length > 0 && (
          <div className="text-center py-12">
            <div className="text-blue-500 text-6xl mb-4">🔍</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Issues in Selected Metrics
            </h4>
            <p className="text-gray-600">
              Try adjusting your filters to see more issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
