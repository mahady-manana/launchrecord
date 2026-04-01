"use client";

import { ClarityReport } from "@/services/sio-report/schema";
import { AlertCircle, CheckCircle2, Copy, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MetricSection, StatementCard } from "./ReusableMetricSections";

interface ActionableClarityProps {
  report: ClarityReport;
  productId: string;
  isGuest?: boolean;
}

export function ActionableClarity({
  report,
  productId,
  isGuest = false,
}: ActionableClarityProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const unclearSentences = report.unclearSentences?.slice(0, 5) || [];
  const subMetrics = Object.values(report.subMetrics);
  const weakPoints = subMetrics
    .filter((m) => m.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Clarity</h2>
            <p className="text-slate-600 text-sm mt-1">
              How clear is your messaging
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">
                {report.score}
              </div>
            </div>
            <Link href={`/dashboard/${productId}/audit/clarity`}>
              <Zap className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Statement */}
        {report.statement && <StatementCard statement={report.statement} />}

        {/* Current Messaging */}
        <MetricSection
          title="Current Messaging"
          current={report.summary.current}
          negativeComments={report.summary.negativeComments}
          positiveComments={report.summary.positiveComments}
          suggestions={report.summary.suggested}
          suggestionLabel="Suggested Messaging"
        />

        {/* Unclear Sentences */}
        {unclearSentences.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">
              Unclear Sentences ({unclearSentences.length})
            </h3>
            <div className="space-y-3">
              {unclearSentences.map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <div className="p-3 bg-slate-50">
                    <div className="flex items-start gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-bold text-orange-700 uppercase">
                        Unclear
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 italic pl-6">
                      "{item.text}"
                    </p>
                    <p className="text-sm text-orange-800 mt-2 pl-6">
                      <span className="font-semibold">Issue:</span> {item.issue}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-bold text-green-700 uppercase">
                            Fix
                          </span>
                        </div>
                        <p className="text-sm text-green-900 font-medium pl-6">
                          {item.fix}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(item.fix, `fix-${index}`)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0 self-start"
                      >
                        {copiedIndex === `fix-${index}` ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Sub-Metrics */}
        {weakPoints.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">
              Areas Needing Attention
            </h3>
            <div className="space-y-3">
              {weakPoints.map((metric, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 p-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700">
                        {metric.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">
                        {metric.score}
                      </span>
                    </div>
                  </div>
                  {metric.current && (
                    <div className="p-3 bg-slate-50">
                      <p className="text-sm text-slate-600 italic">
                        "{metric.current}"
                      </p>
                    </div>
                  )}
                  {metric.suggested.length > 0 && (
                    <div className="p-3 bg-green-50 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-bold text-green-700 uppercase">
                          Recommended Fixes
                        </span>
                      </div>
                      {metric.suggested.map((suggestion, idx) => {
                        const key = `metric-${index}-${idx}`;
                        return (
                          <div
                            key={idx}
                            className="flex items-start justify-between gap-2 bg-white border border-green-200 rounded-lg p-2.5"
                          >
                            <p className="text-sm text-green-900 font-medium flex-1">
                              {suggestion}
                            </p>
                            <button
                              onClick={() => handleCopy(suggestion, key)}
                              className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0"
                            >
                              {copiedIndex === key ? (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guest CTA */}
        {isGuest && (
          <div className="border-t border-slate-200 pt-4">
            <Link
              href={`/dashboard/${productId}/audit/clarity`}
              className="block w-full bg-slate-900 text-white text-center py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all"
            >
              See Full Clarity Analysis →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
