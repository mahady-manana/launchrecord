"use client";

import { ISIOReport } from "@/models/sio-report";
import { Lock } from "lucide-react";

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

interface HeroElementProps {
  label: string;
  current?: string;
  positiveComments?: string[];
  negativeComments?: string[];
  suggested?: string[];
  isGuest?: boolean;
}

function HeroElement({
  label,
  current,
  positiveComments,
  negativeComments,
  suggested,
  isGuest,
}: HeroElementProps) {
  // For guest users, show locked state
  if (isGuest) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase">
          {label}
        </div>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
          <Lock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">Sign up to see analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-500 uppercase">
        {label}
      </div>

      {/* Current */}
      {current && (
        <div className="bg-red-50 rounded-lg p-3 border border-red-200 mb-2">
          <div className="text-xs text-red-600 font-semibold mb-1">
            Current:
          </div>
          <p className="text-red-700 text-sm line-through">{current}</p>
        </div>
      )}

      {/* Positive Comments */}
      {positiveComments && positiveComments.length > 0 && (
        <div className="space-y-1 mb-2">
          {positiveComments.map((comment, idx) => (
            <div
              key={idx}
              className="text-green-600 text-xs italic flex items-start gap-1"
            >
              <span>✓</span>
              <span>{comment}</span>
            </div>
          ))}
        </div>
      )}

      {/* Negative Comments */}
      {negativeComments && negativeComments.length > 0 && (
        <div className="space-y-1 mb-2">
          {negativeComments.map((comment, idx) => (
            <div
              key={idx}
              className="text-orange-600 text-xs italic flex items-start gap-1"
            >
              <span>⚠</span>
              <span>{comment}</span>
            </div>
          ))}
        </div>
      )}

      {/* Suggested */}
      {suggested && suggested.length > 0 && (
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-xs text-green-600 font-semibold mb-1">
            Suggested:
          </div>
          <ul className="space-y-1">
            {suggested.map((item, idx) => (
              <li
                key={idx}
                className="text-green-700 text-sm font-medium flex items-start gap-1"
              >
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
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

  const hasDetailedData = "headline" in report;

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

      {/* Overall Comments Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
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
                    Areas to Improve
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

      {/* Hero Elements Grid */}
      {hasDetailedData && (
        <div className="grid md:grid-cols-3 gap-4">
          <HeroElement
            label="Headline"
            current={report.headline.current}
            positiveComments={report.headline.positiveComments}
            negativeComments={report.headline.negativeComments}
            suggested={report.headline.suggested}
            isGuest={isGuest}
          />
          <HeroElement
            label="Subheadline"
            current={report.subheadline.current}
            positiveComments={report.subheadline.positiveComments}
            negativeComments={report.subheadline.negativeComments}
            suggested={report.subheadline.suggested}
            isGuest={isGuest}
          />
          <HeroElement
            label="CTA"
            current={report.cta.current}
            positiveComments={report.cta.positiveComments}
            negativeComments={report.cta.negativeComments}
            suggested={report.cta.suggested}
            isGuest={isGuest}
          />
        </div>
      )}
    </div>
  );
}
