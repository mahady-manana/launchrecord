"use client";

import { CommentItem } from "@/components/sio-report/CommentItem";
import { SIOV5Report } from "@/research/sio-v5-report-schema";

interface OverallScoreCardProps {
  report: SIOV5Report;
}

export function OverallScoreCard({ report }: OverallScoreCardProps) {
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
      ? "bg-green-500"
      : report.score >= 50
        ? "bg-yellow-500"
        : report.score >= 30
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-slate-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray={`${(report.score / 100) * 352} 352`}
                className={scoreColor}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-black ${scoreColor}`}>
                  {report.score}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  Overall Score
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Executive Summary
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {report.statement}
            </p>
          </div>

          {/* Positive Comments */}

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div>
              <span className="font-semibold">Analyzed:</span>{" "}
              {new Date(report.analyzedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <div>
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
                Conversion Blockers
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
    </div>
  );
}
