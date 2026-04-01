"use client";

import { AEOReport } from "@/services/sio-report/schema";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface ActionableAEOProps {
  report: AEOReport;
  productId?: string;
}

export function ActionableAEO({ report, productId }: ActionableAEOProps) {
  const recommendations = report.recommendations?.slice(0, 3) || [];
  const isPresent = report.aiPresence?.isPresent;
  const engines = report.aiPresence?.engines || [];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AEO Presence</h2>
            <p className="text-slate-600 text-sm mt-1">
              AI Engine Optimization
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">
              {report.score}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* AI Presence Status */}
        <div
          className={`rounded-lg p-4 border ${
            isPresent
              ? "bg-green-50 border-green-200"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {isPresent ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3
                className={`text-sm font-bold uppercase ${
                  isPresent ? "text-green-700" : "text-slate-700"
                }`}
              >
                {isPresent
                  ? "Present in AI Engines"
                  : "Not Found in AI Engines"}
              </h3>
              {engines.length > 0 && (
                <p className="text-sm text-slate-700 mt-1">
                  Found in:{" "}
                  <span className="font-semibold">{engines.join(", ")}</span>
                </p>
              )}
              {report.aiPresence?.comment && (
                <p className="text-sm text-slate-600 mt-2">
                  {report.aiPresence.comment}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">
              Quick Wins to Improve AEO
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-green-900 font-medium">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No recommendations message */}
        {recommendations.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-900 font-medium">
              Your AEO presence is well optimized
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
