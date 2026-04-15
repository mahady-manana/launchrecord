"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { ClarityReport } from "@/services/sio-report/schema";
import { Sparkles as SparklesIcon } from "lucide-react";
import { CommentList } from "./CommentList";
import { MetricStatement } from "./MetricStatement";
import { RecommendationsCard } from "./RecommendationsCard";
import { SubMetricCard } from "./SubMetricCard";

interface ClaritySectionProps {
  report: ClarityReport;
  ctaHref: string;
  isGuest: boolean;
}

const SUB_METRICS = [
  {
    key: "headlineClarity" as const,
    title: "Headline Clarity",
  },
  {
    key: "valueProposition" as const,
    title: "Value Proposition",
  },
  {
    key: "featureBenefitMapping" as const,
    title: "Feature-Benefit Mapping",
  },
  {
    key: "visualHierarchy" as const,
    title: "Visual Hierarchy",
  },
  {
    key: "ctaClarity" as const,
    title: "CTA Clarity",
  },
  {
    key: "proofPlacement" as const,
    title: "Proof Placement",
  },
] as const;

export function ClaritySection({
  report,
  ctaHref,
  isGuest,
}: ClaritySectionProps) {
  const { tier } = useSubscription(isGuest);

  if (!report) return null;

  return (
    <section className="border-b border-slate-200 py-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
          <SparklesIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Clarity & Comprehension
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
      <div className="space-y-6">
        <CommentList
          positiveComments={report.overallCommentPositive}
          negativeComments={report.overallCommentNegative}
          positiveTitle="Messaging clarity strengths"
          negativeTitle="Messaging clarity weaknesses"
        />
        <RecommendationsCard
          title="Clarity recommendations"
          recommendations={report.recommendation || []}
          ctaHref={ctaHref}
        />
      </div>

      {/* Unclear Sentences (always visible if present) */}
      {report.unclearSentences && report.unclearSentences.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Confusing Sentences ({report.unclearSentences.length})
          </h3>
          <div className="space-y-3">
            {report.unclearSentences.slice(0, 5).map((item, idx) => (
              <div key={idx} className="border-l-2 border-orange-200 pl-3">
                <div className="text-orange-700 text-sm line-through mb-0.5">
                  "{item.text}"
                </div>
                <div className="text-orange-600 text-xs italic mb-1">
                  ⚠ {item.issue}
                </div>
                <div className="text-green-700 text-sm font-medium">
                  → {item.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Metrics Grid - ALWAYS VISIBLE */}
      {report.subMetrics && (
        <div className="grid gap-6">
          {SUB_METRICS.map(({ key, title }) => {
            const metric = report.subMetrics?.[key];
            if (!metric) return null;

            return (
              <SubMetricCard
                key={key}
                id={`clarity-${key}`}
                title={title}
                metric={{
                  statement: metric.statement,
                  score: metric.score,
                  current: metric.current,
                  positiveComments: metric.positiveComments,
                  negativeComments: metric.negativeComments,
                  recommendation: metric.recommendation || [],
                  suggested: metric.suggested || [],
                  unclearTexts: metric.unclearTexts,
                }}
                ctaHref={ctaHref}
                showCurrent={!!metric.current}
                isClaritySubmetric
              />
            );
          })}
        </div>
      )}

      {/* Overall Recommendations - Always visible section */}
    </section>
  );
}
