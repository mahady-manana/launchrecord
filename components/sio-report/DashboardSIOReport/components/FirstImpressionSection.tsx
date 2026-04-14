"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { SIOV5Report } from "@/services/sio-report/schema";
import { Eye } from "lucide-react";
import { CommentList } from "./CommentList";
import { MetricStatement } from "./MetricStatement";
import { RecommendationsCard } from "./RecommendationsCard";
import { SubMetricCard } from "./SubMetricCard";

interface FirstImpressionSectionProps {
  report: SIOV5Report["firstImpression"];
  ctaHref: string;
  isGuest: boolean;
}

const HERO_COMPONENTS = [
  { key: "headline" as const, title: "Headline Analysis" },
  { key: "subheadline" as const, title: "Subheadline Analysis" },
  { key: "cta" as const, title: "Call to Action" },
] as const;

export function FirstImpressionSection({
  report,
  ctaHref,
  isGuest,
}: FirstImpressionSectionProps) {
  const { tier } = useSubscription(isGuest);

  if (!report) return null;

  return (
    <section className="border-b border-slate-200 py-8 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
          <Eye className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            First Impression (Above The Fold)
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
      <CommentList
        positiveComments={report.overallCommentPositive}
        negativeComments={report.overallCommentNegative}
        positiveTitle="What works"
        negativeTitle="Where you lose visitors"
      />

      <RecommendationsCard
        title="First impression recommendations"
        recommendations={report.recommendation || []}
        ctaHref={ctaHref}
      />
      <div className="space-y-6">
        {HERO_COMPONENTS.map(({ key, title }) => {
          const component = report[key];
          if (!component) return null;

          return (
            <div key={key}>
              <SubMetricCard
                id={`first-impression-${key}`}
                title={title}
                metric={{
                  statement: component.statement,
                  score: 0,
                  current: component.current,
                  positiveComments: component.positiveComments,
                  negativeComments: component.negativeComments,
                  recommendation: component.recommendation || [],
                  suggested: component.suggested || [],
                }}
                ctaHref={ctaHref}
                showCurrent={!!component.current}
              />
            </div>
          );
        })}
      </div>

      {/* Overall Recommendations */}
    </section>
  );
}
