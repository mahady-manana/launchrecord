"use client";

import { CommentItem } from "@/components/sio-report/CommentItem";
import { MetricInsight } from "@/components/sio-report/MetricInsight";
import { SIOV5Report } from "@/research/sio-v5-report-schema";

interface FirstImpressionCardProps {
  report: SIOV5Report["firstImpression"];
}


export function FirstImpressionCard({ report }: FirstImpressionCardProps) {
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

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center`}
        >
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

      <p className="text-slate-600 leading-relaxed mb-4">{report.statement}</p>

      {/* Overall Comments Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
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

      {/* Hero Elements */}
      <div className="space-y-4">
        <MetricInsight
          title="Hero Headline"
          current={report.headline.current}
          positiveComments={report.headline.positiveComments}
          negativeComments={report.headline.negativeComments}
          suggested={report.headline.suggested}
        />
        <MetricInsight
          title="Supporting Subheadline"
          current={report.subheadline.current}
          positiveComments={report.subheadline.positiveComments}
          negativeComments={report.subheadline.negativeComments}
          suggested={report.subheadline.suggested}
        />
        <MetricInsight
          title="Primary CTA"
          current={report.cta.current}
          positiveComments={report.cta.positiveComments}
          negativeComments={report.cta.negativeComments}
          suggested={report.cta.suggested}
        />
      </div>
    </div>
  );
}
