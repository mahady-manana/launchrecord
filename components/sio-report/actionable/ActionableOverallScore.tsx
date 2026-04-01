"use client";

import { SIOV5Report } from "@/services/sio-report/schema";
import { AlertCircle, CheckCircle2, Pencil, Target } from "lucide-react";

interface ActionableOverallScoreProps {
  report: SIOV5Report;
}

export function ActionableOverallScore({
  report,
}: ActionableOverallScoreProps) {
  const criticalIssues = report.overallCommentNegative.slice(0, 3);
  const topStrengths = report.overallCommentPositive.slice(0, 2);

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Critical Issues
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Fix these to improve your score
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-slate-900">
              {report.overallScore}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Current State */}
        {report.websiteSummary.summary && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Current Positioning
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-sm text-slate-700">
                {report.websiteSummary.summary}
              </p>
              {report.websiteSummary.summaryComment && (
                <p className="text-sm text-slate-500 mt-2 italic">
                  {report.websiteSummary.summaryComment}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Must Fix
            </h3>
            <ul className="space-y-2">
              {criticalIssues.map((issue, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-orange-900 bg-orange-50 border border-orange-200 rounded-lg p-2.5"
                >
                  <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary Action */}
        {report.statement && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Primary Action
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Pencil className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-900 font-medium">
                  {report.statement}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Strengths */}
        {topStrengths.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {topStrengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
