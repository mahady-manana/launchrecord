"use client";

import { ISIOReport } from "@/models/sio-report";

interface OverallScoreCardProps {
  report: ISIOReport;
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
                  Overall
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Overall Assessment
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {report.statement}
            </p>
          </div>

          {/* Band Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${bandColors[report.reportBand]}`}
            >
              {report.reportBand}
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-semibold">Analyzed:</span>{" "}
              {new Date(report.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Positive Comments */}
          {report.overallCommentPositive &&
            report.overallCommentPositive.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-green-800 mb-2">
                      What's Working Well
                    </div>
                    <ul className="space-y-1">
                      {report.overallCommentPositive.map((comment, idx) => (
                        <li
                          key={idx}
                          className="text-green-700 text-sm flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-1">•</span>
                          <span>{comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

          {/* Negative Comments */}
          {report.overallCommentNegative &&
            report.overallCommentNegative.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg
                    className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-red-800 mb-2">
                      Critical Issues
                    </div>
                    <ul className="space-y-1">
                      {report.overallCommentNegative.map((comment, idx) => (
                        <li
                          key={idx}
                          className="text-red-700 text-sm flex items-start gap-2"
                        >
                          <span className="text-red-500 mt-1">•</span>
                          <span>{comment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
