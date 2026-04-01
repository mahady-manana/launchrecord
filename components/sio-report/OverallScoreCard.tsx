"use client";

import { getReportBand } from "@/services/sio-report/mappers";
import { SIOV5Report } from "@/services/sio-report/schema";
import { CommentItem } from "./CommentItem";

interface OverallScoreCardProps {
  report: SIOV5Report;
}

export function OverallScoreCard({ report }: OverallScoreCardProps) {
  const scoreColor =
    report.overallScore >= 70
      ? "text-green-600"
      : report.overallScore >= 50
        ? "text-yellow-600"
        : report.overallScore >= 30
          ? "text-orange-600"
          : "text-red-600";

  const scoreBg =
    report.overallScore >= 70
      ? "bg-green-500"
      : report.overallScore >= 50
        ? "bg-yellow-500"
        : report.overallScore >= 30
          ? "bg-orange-500"
          : "bg-red-500";

  const bandColors = {
    Dominant: "bg-green-100 text-green-800",
    Strong: "bg-lime-100 text-lime-800",
    Blended: "bg-yellow-100 text-yellow-800",
    Weak: "bg-orange-100 text-orange-800",
    Ghost: "bg-red-100 text-red-800",
  };

  const band = getReportBand(report.overallScore);
  return (
    <section className="py-8 border-b border-slate-200 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center justify-center">
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
                strokeDasharray={`${(report.overallScore / 100) * 352} 352`}
                className={scoreColor}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-black ${scoreColor}`}>
                  {report.overallScore}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  Score
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Executive Summary
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {report.statement}
            </p>
          </div>

          {/* Band Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${bandColors[band]}`}
            >
              {band}
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-semibold">Analyzed:</span>{" "}
              {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

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
    </section>
  );
}
