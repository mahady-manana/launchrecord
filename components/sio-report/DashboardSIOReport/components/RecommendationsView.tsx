"use client";

import { SIOV5Report } from "@/services/sio-report/schema";
import { AlertCircle, CheckCircle, Lightbulb, TrendingUp } from "lucide-react";
import { useState } from "react";

interface RecommendationsViewProps {
  report: SIOV5Report;
}

interface RecommendationItem {
  id: string;
  metric: string;
  subMetric?: string;
  type: "negative" | "recommendation" | "suggestion";
  text: string;
  priority: "high" | "medium" | "low";
}

export function RecommendationsView({ report }: RecommendationsViewProps) {
  const [filter, setFilter] = useState<"all" | "negative" | "recommendation" | "suggestion">("all");

  // Extract all recommendations from the report
  const allRecommendations: RecommendationItem[] = [];

  // Overall negative comments
  report.overallCommentNegative?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `overall-negative-${idx}`,
      metric: "Overall",
      type: "negative",
      text: comment,
      priority: "high",
    });
  });

  // Overall recommendations
  report.overallCommentPositive?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `overall-positive-${idx}`,
      metric: "Overall",
      type: "recommendation",
      text: comment,
      priority: "medium",
    });
  });

  // First Impression negative comments
  report.firstImpression.overallCommentNegative?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `first-impression-negative-${idx}`,
      metric: "First Impression",
      type: "negative",
      text: comment,
      priority: "high",
    });
  });

  // First Impression recommendations
  report.firstImpression.recommendation?.forEach((rec, idx) => {
    allRecommendations.push({
      id: `first-impression-rec-${idx}`,
      metric: "First Impression",
      type: "recommendation",
      text: rec,
      priority: "high",
    });
  });

  // First Impression suggestions (headline, subheadline, CTA)
  report.firstImpression.headline.suggested?.forEach((suggestion, idx) => {
    allRecommendations.push({
      id: `headline-suggestion-${idx}`,
      metric: "First Impression",
      subMetric: "Headline",
      type: "suggestion",
      text: suggestion,
      priority: "high",
    });
  });

  report.firstImpression.subheadline.suggested?.forEach((suggestion, idx) => {
    allRecommendations.push({
      id: `subheadline-suggestion-${idx}`,
      metric: "First Impression",
      subMetric: "Subheadline",
      type: "suggestion",
      text: suggestion,
      priority: "high",
    });
  });

  report.firstImpression.cta.suggested?.forEach((suggestion, idx) => {
    allRecommendations.push({
      id: `cta-suggestion-${idx}`,
      metric: "First Impression",
      subMetric: "CTA",
      type: "suggestion",
      text: suggestion,
      priority: "high",
    });
  });

  // First Impression negative comments (specific sections)
  report.firstImpression.headline.negativeComments?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `headline-negative-${idx}`,
      metric: "First Impression",
      subMetric: "Headline",
      type: "negative",
      text: comment,
      priority: "high",
    });
  });

  report.firstImpression.subheadline.negativeComments?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `subheadline-negative-${idx}`,
      metric: "First Impression",
      subMetric: "Subheadline",
      type: "negative",
      text: comment,
      priority: "high",
    });
  });

  report.firstImpression.cta.negativeComments?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `cta-negative-${idx}`,
      metric: "First Impression",
      subMetric: "CTA",
      type: "negative",
      text: comment,
      priority: "high",
    });
  });

  // Positioning negative comments
  report.positioning.overallCommentNegative?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `positioning-negative-${idx}`,
      metric: "Positioning",
      type: "negative",
      text: comment,
      priority: "high",
    });
  });

  // Positioning recommendations
  report.positioning.recommendation?.forEach((rec, idx) => {
    allRecommendations.push({
      id: `positioning-rec-${idx}`,
      metric: "Positioning",
      type: "recommendation",
      text: rec,
      priority: "high",
    });
  });

  // Positioning sub-metrics negative comments and recommendations
  const positioningSubMetrics = report.positioning.subMetrics;
  if (positioningSubMetrics) {
    Object.entries(positioningSubMetrics).forEach(([key, subMetric]: [string, any]) => {
      subMetric.negativeComments?.forEach((comment: string, idx: number) => {
        allRecommendations.push({
          id: `positioning-${key}-negative-${idx}`,
          metric: "Positioning",
          subMetric: formatSubMetricName(key),
          type: "negative",
          text: comment,
          priority: "high",
        });
      });

      subMetric.recommendation?.forEach((rec: string, idx: number) => {
        allRecommendations.push({
          id: `positioning-${key}-rec-${idx}`,
          metric: "Positioning",
          subMetric: formatSubMetricName(key),
          type: "recommendation",
          text: rec,
          priority: "high",
        });
      });

      subMetric.suggested?.forEach((suggestion: string, idx: number) => {
        allRecommendations.push({
          id: `positioning-${key}-suggestion-${idx}`,
          metric: "Positioning",
          subMetric: formatSubMetricName(key),
          type: "suggestion",
          text: suggestion,
          priority: "high",
        });
      });
    });
  }

  // Positioning summary suggestions
  report.positioning.summary.suggested?.forEach((suggestion, idx) => {
    allRecommendations.push({
      id: `positioning-summary-suggestion-${idx}`,
      metric: "Positioning",
      subMetric: "Summary",
      type: "suggestion",
      text: suggestion,
      priority: "high",
    });
  });

  // Clarity negative comments
  report.clarity.overallCommentNegative?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `clarity-negative-${idx}`,
      metric: "Clarity",
      type: "negative",
      text: comment,
      priority: "high",
    });
  });

  // Clarity recommendations
  report.clarity.recommendation?.forEach((rec, idx) => {
    allRecommendations.push({
      id: `clarity-rec-${idx}`,
      metric: "Clarity",
      type: "recommendation",
      text: rec,
      priority: "high",
    });
  });

  // Clarity sub-metrics negative comments and recommendations
  const claritySubMetrics = report.clarity.subMetrics;
  if (claritySubMetrics) {
    Object.entries(claritySubMetrics).forEach(([key, subMetric]: [string, any]) => {
      subMetric.negativeComments?.forEach((comment: string, idx: number) => {
        allRecommendations.push({
          id: `clarity-${key}-negative-${idx}`,
          metric: "Clarity",
          subMetric: formatSubMetricName(key),
          type: "negative",
          text: comment,
          priority: "high",
        });
      });

      subMetric.recommendation?.forEach((rec: string, idx: number) => {
        allRecommendations.push({
          id: `clarity-${key}-rec-${idx}`,
          metric: "Clarity",
          subMetric: formatSubMetricName(key),
          type: "recommendation",
          text: rec,
          priority: "high",
        });
      });

      subMetric.suggested?.forEach((suggestion: string, idx: number) => {
        allRecommendations.push({
          id: `clarity-${key}-suggestion-${idx}`,
          metric: "Clarity",
          subMetric: formatSubMetricName(key),
          type: "suggestion",
          text: suggestion,
          priority: "high",
        });
      });
    });
  }

  // Clarity summary suggestions
  report.clarity.summary.suggested?.forEach((suggestion, idx) => {
    allRecommendations.push({
      id: `clarity-summary-suggestion-${idx}`,
      metric: "Clarity",
      subMetric: "Summary",
      type: "suggestion",
      text: suggestion,
      priority: "high",
    });
  });

  // Unclear texts (issues and fixes)
  report.clarity.unclearSentences?.forEach((item, idx) => {
    allRecommendations.push({
      id: `clarity-unclear-issue-${idx}`,
      metric: "Clarity",
      type: "negative",
      text: `"${item.text}" - ${item.issue}`,
      priority: "medium",
    });

    allRecommendations.push({
      id: `clarity-unclear-fix-${idx}`,
      metric: "Clarity",
      type: "suggestion",
      text: item.fix,
      priority: "medium",
    });
  });

  // AEO negative comments
  report.clarity.overallCommentNegative?.forEach((comment, idx) => {
    allRecommendations.push({
      id: `aeo-negative-${idx}`,
      metric: "AEO",
      type: "negative",
      text: comment,
      priority: "medium",
    });
  });

  // AEO recommendations
  report.aeo.recommendations?.forEach((rec, idx) => {
    allRecommendations.push({
      id: `aeo-rec-${idx}`,
      metric: "AEO",
      type: "recommendation",
      text: rec,
      priority: "medium",
    });
  });

  // Filter recommendations
  const filteredRecommendations =
    filter === "all"
      ? allRecommendations
      : allRecommendations.filter((r) => r.type === filter);

  // Group by metric
  const groupedByMetric = filteredRecommendations.reduce<
    Record<string, RecommendationItem[]>
  >((acc, rec) => {
    const key = rec.metric;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(rec);
    return acc;
  }, {});

  // Counts
  const negativeCount = allRecommendations.filter((r) => r.type === "negative").length;
  const recommendationCount = allRecommendations.filter((r) => r.type === "recommendation").length;
  const suggestionCount = allRecommendations.filter((r) => r.type === "suggestion").length;

  return (
    <div className="px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Recommendations
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-2xl">
              All negative feedback, recommendations, and suggestions extracted
              from your audit report, organized by metric.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">
              {allRecommendations.length}
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">
              Total Items
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {negativeCount}
              </div>
              <div className="text-sm text-slate-500">Issues Found</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {recommendationCount}
              </div>
              <div className="text-sm text-slate-500">Recommendations</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {suggestionCount}
              </div>
              <div className="text-sm text-slate-500">Suggested Fixes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          All ({allRecommendations.length})
        </button>
        <button
          onClick={() => setFilter("negative")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "negative"
              ? "bg-red-600 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          Issues ({negativeCount})
        </button>
        <button
          onClick={() => setFilter("recommendation")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "recommendation"
              ? "bg-blue-600 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Recommendations ({recommendationCount})
        </button>
        <button
          onClick={() => setFilter("suggestion")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "suggestion"
              ? "bg-green-600 text-white"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Suggested Fixes ({suggestionCount})
        </button>
      </div>

      {/* Recommendations by Metric */}
      <div className="space-y-6">
        {Object.entries(groupedByMetric).map(
          ([metric, items]) =>
            items.length > 0 && (
              <div
                key={metric}
                className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Metric Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    {metric}
                    <span className="text-sm font-normal text-slate-500">
                      ({items.length} items)
                    </span>
                  </h3>
                </div>

                {/* Items */}
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ item }: { item: RecommendationItem }) {
  const typeConfig = {
    negative: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />,
      label: "Issue",
      labelBg: "bg-red-100",
      textColor: "text-red-900",
    },
    recommendation: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />,
      label: "Recommendation",
      labelBg: "bg-blue-100",
      textColor: "text-blue-900",
    },
    suggestion: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />,
      label: "Suggested Fix",
      labelBg: "bg-green-100",
      textColor: "text-green-900",
    },
  };

  const config = typeConfig[item.type];

  return (
    <div
      className={`border ${config.border} ${config.bg} rounded-lg p-4 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold uppercase ${config.labelBg} ${config.textColor} px-2 py-0.5 rounded`}
            >
              {config.label}
            </span>
            {item.subMetric && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {item.subMetric}
              </span>
            )}
          </div>
          <p className={`text-sm ${config.textColor} font-medium`}>
            {item.text}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatSubMetricName(key: string): string {
  // Convert camelCase to Title Case with spaces
  return (
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
}
