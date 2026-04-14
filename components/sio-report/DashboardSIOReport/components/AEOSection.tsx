"use client";

import { AEOReport } from "@/services/sio-report/schema";
import { Bot } from "lucide-react";

interface AEOSectionProps {
  report: AEOReport;
}

export function AEOSection({ report }: AEOSectionProps) {
  if (!report) return null;

  const engines = report.aiPresence?.engines || [];

  return (
    <section className="border-b border-slate-200 py-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            AEO (Answer Engine Optimization)
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

      {/* AI Presence */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-semibold text-slate-700">
            AI Visibility
          </span>
          <span
            className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
              report.aiPresence?.isPresent
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {report.aiPresence?.isPresent ? "Detected" : "Not detected"}
          </span>
        </div>
        {engines.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {engines.map((engine, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
              >
                {engine}
              </span>
            ))}
          </div>
        )}
        {report.aiPresence?.comment && (
          <p className="text-sm text-slate-600 mt-2">
            {report.aiPresence.comment}
          </p>
        )}
      </div>

      {/* Recommendations */}
      {report.recommendations && report.recommendations.length > 0 && (
        <div className="rounded-lg border-2 border-amber-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wide text-amber-600">
              AEO Improvements ({report.recommendations.length})
            </span>
          </div>
          <ul className="space-y-1.5">
            {report.recommendations.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-slate-600 font-medium pl-3 border-l-2 border-amber-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
