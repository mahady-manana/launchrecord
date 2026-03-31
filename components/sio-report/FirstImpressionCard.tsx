"use client";

import type { ISIOReport } from "@/models/sio-report";
import { Lock } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { MetricInsight } from "./MetricInsight";

interface FirstImpressionCardProps {
  report:
    | ISIOReport["firstImpression"]
    | {
        score: number;
        statement: string;
        overallCommentPositive: string[];
        overallCommentNegative: string[];
      };
  isGuest?: boolean;
}

interface LockedMetricProps {
  title: string;
}

function LockedMetric({ title }: LockedMetricProps) {
  return (
    <div className="py-4 border-b border-slate-200 last:border-b-0">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-slate-800">{title}</h4>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Locked
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
        <Lock className="h-4 w-4 text-slate-400" />
        <p>Sign up to unlock the exact copy to use</p>
      </div>
    </div>
  );
}

export function FirstImpressionCard({
  report,
  isGuest,
}: FirstImpressionCardProps) {
  const scoreColor =
    report.score >= 70
      ? "text-green-600"
      : report.score >= 50
        ? "text-yellow-600"
        : report.score >= 30
          ? "text-orange-600"
          : "text-red-600";

  const scoreBg =
    report.score >= 70
      ? "bg-green-50"
      : report.score >= 50
        ? "bg-yellow-50"
        : report.score >= 30
          ? "bg-orange-50"
          : "bg-red-50";

  const detailedReport = "headline" in report ? report : null;
  const shouldShowHeroElements = isGuest || !!detailedReport;

  return (
    <section className="py-8 border-b border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            First Impression (Above The Fold)
          </h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${scoreBg} ${scoreColor}`}
          >
            Score: {report.score}/100
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{report.statement}</p>

      {/* Overall Comments Grid */}
      <div className="space-y-4 mb-6">
        {/* Positive Comments */}
        {report.overallCommentPositive &&
          report.overallCommentPositive.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-700">
                Strengths To Double Down
              </div>
              <ul className="space-y-2">
                {report.overallCommentPositive.map((comment, idx) => (
                  <CommentItem
                    key={idx}
                    as="li"
                    variant="positive"
                    text={comment}
                  />
                ))}
              </ul>
            </div>
          )}

        {/* Negative Comments */}
        {report.overallCommentNegative &&
          report.overallCommentNegative.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-700">
                Conversion Leaks
              </div>
              <ul className="space-y-2">
                {report.overallCommentNegative.map((comment, idx) => (
                  <CommentItem
                    key={idx}
                    as="li"
                    variant="negative"
                    text={comment}
                  />
                ))}
              </ul>
            </div>
          )}
      </div>

      {shouldShowHeroElements && (
        <div className="space-y-4">
          {isGuest ? (
            <LockedMetric title="Headline: Recommendations to improve your headline" />
          ) : (
            <MetricInsight
              title="Headline: Recommendations to improve your headline"
              currentTitle="Current headline"
              current={detailedReport?.headline.current}
              positiveComments={detailedReport?.headline.positiveComments}
              negativeComments={detailedReport?.headline.negativeComments}
              suggested={detailedReport?.headline.suggested}
            />
          )}
          {isGuest ? (
            <LockedMetric title="Subtitles, descriptions" />
          ) : (
            <MetricInsight
              title="Subtitles, descriptions"
              currentTitle="Current subtitles"
              current={detailedReport?.subheadline.current}
              positiveComments={detailedReport?.subheadline.positiveComments}
              negativeComments={detailedReport?.subheadline.negativeComments}
              suggested={detailedReport?.subheadline.suggested}
            />
          )}
          {isGuest ? (
            <LockedMetric title="Primary CTA" />
          ) : (
            <MetricInsight
              title="Primary CTA"
              current={detailedReport?.cta.current}
              positiveComments={detailedReport?.cta.positiveComments}
              negativeComments={detailedReport?.cta.negativeComments}
              suggested={detailedReport?.cta.suggested}
            />
          )}
        </div>
      )}
    </section>
  );
}
