"use client";

import { SIOV5Report } from "../sio-v5-report-schema";

interface AEOCardProps {
  report: SIOV5Report["aeo"];
}

export function AEOCard({ report }: AEOCardProps) {
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
          className={`w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center`}
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            AEO (AI Engine Optimization)
          </h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${scoreBg} ${scoreColor}`}
          >
            Score: {report.score}/100
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{report.statement}</p>

      {/* AI Presence Check */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          AI Engine Presence
        </h3>
        <div
          className={`rounded-lg p-4 border ${
            report.aiPresence.isPresent
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-3 h-3 rounded-full ${
                report.aiPresence.isPresent ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`font-bold ${
                report.aiPresence.isPresent
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {report.aiPresence.isPresent
                ? "Present in AI Engines"
                : "Not Found in AI Engines"}
            </span>
          </div>

          {report.aiPresence.engines.length > 0 ? (
            <div className="mb-2">
              <span className="text-sm text-slate-600">Found in:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {report.aiPresence.engines.map((engine, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded"
                  >
                    {engine}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600 mb-2">
              Not mentioned in ChatGPT, Claude, Gemini, or Perplexity
            </p>
          )}

          <p className="text-sm text-slate-600 italic">{report.aiPresence.comment}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Quick Recommendations ({report.recommendations.length})
        </h3>
        <div className="space-y-2">
          {report.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
            >
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                {idx + 1}
              </div>
              <p className="text-slate-700 text-sm">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="mt-6 p-4 bg-slate-800 rounded-lg text-center">
        <p className="text-slate-300 text-sm mb-3">
          Want detailed AEO analysis with competitor comparisons and citation tracking?
        </p>
        <button className="px-6 py-2 bg-purple-500 text-white text-sm font-bold rounded-lg hover:bg-purple-400 transition-colors">
          Unlock Full AEO Report →
        </button>
      </div>
    </div>
  );
}
