"use client";

import { SIOV5Report } from "../sio-v5-report-schema";

interface FirstImpressionCardProps {
  report: SIOV5Report["firstImpression"];
}

interface HeroElementProps {
  label: string;
  current: string;
  comment: string;
  suggested: string;
}

function HeroElement({ label, current, comment, suggested }: HeroElementProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-500 uppercase">
        {label}
      </div>

      {/* Current */}
      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
        <div className="text-xs text-red-600 font-semibold mb-1">Current:</div>
        <p className="text-red-700 text-sm line-through">{current}</p>
      </div>

      {/* Comment */}
      <div className="text-orange-600 text-xs italic flex items-start gap-1">
        <span>⚠</span>
        <span>{comment}</span>
      </div>

      {/* Suggested */}
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="text-xs text-green-600 font-semibold mb-1">
          Suggested:
        </div>
        <p className="text-green-700 text-sm font-medium">{suggested}</p>
      </div>
    </div>
  );
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
            First Impression (Hero Section)
          </h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${scoreBg} ${scoreColor}`}
          >
            Score: {report.score}/100
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-4">{report.statement}</p>

      {/* Overall Comment */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <svg
            className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <div className="text-sm font-semibold text-blue-800 mb-1">
              Overall Comment
            </div>
            <p className="text-blue-700 text-sm leading-relaxed">
              {report.overallComment}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Elements Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <HeroElement
          label="Headline"
          current={report.headline.current}
          comment={report.headline.comment}
          suggested={report.headline.suggested}
        />
        <HeroElement
          label="Subheadline"
          current={report.subheadline.current}
          comment={report.subheadline.comment}
          suggested={report.subheadline.suggested}
        />
        <HeroElement
          label="CTA"
          current={report.cta.current}
          comment={report.cta.comment}
          suggested={report.cta.suggested}
        />
      </div>
    </div>
  );
}
