"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { PositioningReport } from "@/services/sio-report/schema";
import { Target } from "lucide-react";
import { CommentList } from "./CommentList";
import { MetricStatement } from "./MetricStatement";
import { RecommendationsCard } from "./RecommendationsCard";
import { SubMetricCard } from "./SubMetricCard";

interface PositioningSectionProps {
  report: PositioningReport;
  ctaHref: string;
  isGuest: boolean;
}

const SUB_METRICS = [
  {
    key: "categoryOwnership" as const,
    title: "Category Ownership",
    description: "Do they own a specific category?",
  },
  {
    key: "uniqueValueProp" as const,
    title: "Unique Value Proposition",
    description: "What makes them uniquely valuable?",
  },
  {
    key: "competitiveDiff" as const,
    title: "Competitive Differentiation",
    description: "How are they different from alternatives?",
  },
  {
    key: "targetAudience" as const,
    title: "Target Audience Clarity",
    description: "Is their ICP specific and clear?",
  },
  {
    key: "problemSolutionFit" as const,
    title: "Problem-Solution Fit",
    description: "Does their solution match the problem?",
  },
  {
    key: "messagingConsistency" as const,
    title: "Messaging Consistency",
    description: "Is messaging consistent across pages?",
  },
] as const;

export function PositioningSection({
  report,
  ctaHref,
  isGuest,
}: PositioningSectionProps) {
  const { tier } = useSubscription(isGuest);

  if (!report) return null;

  return (
    <section className="border-b border-slate-200 py-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Positioning & Differentiation
          </h2>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
              report.score >= 70
                ? "bg-green-50 text-green-600"
                : report.score >= 50
                  ? "bg-yellow-50 text-yellow-600"
                  : report.score >= 30
                    ? "bg-orange-50 text-orange-600"
                    : "bg-red-50 text-red-600"
            }`}
          >
            Score: {report.score}/100
          </span>
        </div>
      </div>

      {/* Statement (always visible) */}
      {report.statement && (
        <MetricStatement statement={report.statement} className="mb-6" />
      )}

      {/* Overall Comments - Always visible section */}
      <div className="mb-6">
        <CommentList
          positiveComments={report.overallCommentPositive}
          negativeComments={report.overallCommentNegative}
          positiveTitle="Positive positioning signs"
          negativeTitle="Where you lose clarity"
        />
      </div>
      <div className="mt-6">
        <RecommendationsCard
          title="Positioning recommendations"
          recommendations={report.recommendation || []}
          ctaHref={ctaHref}
        />
      </div>
      {/* Summary */}
      {report.summary && (
        <div className="mb-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Market Positioning Summary
            </span>
            {report.summary.current && (
              <p className="text-sm text-slate-600 mt-1 font-medium">
                {report.summary.current}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sub-Metrics Grid - ALWAYS VISIBLE */}
      {report.subMetrics && (
        <div className="grid gap-6">
          {SUB_METRICS.map(({ key, title, description }) => {
            const metric = report.subMetrics?.[key];
            if (!metric) return null;

            return (
              <SubMetricCard
                key={key}
                id={`positioning-${key}`}
                title={title}
                metric={{
                  statement: metric.statement || description,
                  score: metric.score,
                  current: metric.current,
                  positiveComments: metric.positiveComments,
                  negativeComments: metric.negativeComments,
                  recommendation: metric.recommendation || [],
                  suggested: metric.suggested || [],
                }}
                ctaHref={ctaHref}
                showCurrent={!!metric.current}
              />
            );
          })}
        </div>
      )}

      {/* Overall Recommendations - Always visible section */}
    </section>
  );
}
