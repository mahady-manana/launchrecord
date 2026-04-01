"use client";

import { Button } from "@/components/ui/button";
import { SIOV5Report } from "@/services/sio-report/schema";
import { ChevronRight, ListTodo, Sparkles } from "lucide-react";
import Link from "next/link";
import { ActionableAEO } from "./ActionableAEO";
import { ActionableClarity } from "./ActionableClarity";
import { ActionableFirstImpression } from "./ActionableFirstImpression";
import { ActionableOverallScore } from "./ActionableOverallScore";
import { ActionablePositioning } from "./ActionablePositioning";

interface ActionableReportProps {
  report: SIOV5Report;
  productId?: string;
  isGuest?: boolean;
}

export function ActionableReport({
  report,
  productId = "unknown",
  isGuest = false,
}: ActionableReportProps) {
  // Calculate total action items
  const totalProblems =
    report.overallCommentNegative.length +
    report.firstImpression.overallCommentNegative.length +
    report.positioning.overallCommentNegative.length +
    report.clarity.overallCommentNegative.length;

  const totalFixes =
    report.overallCommentPositive.length +
    (report.firstImpression.headline.suggested.length +
      report.firstImpression.subheadline.suggested.length +
      report.firstImpression.cta.suggested.length) +
    report.positioning.summary.suggested.length +
    report.clarity.summary.suggested.length +
    report.clarity.unclearSentences.length;

  return (
    <div className="space-y-6 px-8">
      {/* Actionable Header - Clean, minimal */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ListTodo className="h-6 w-6 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Action Plan</h2>
            </div>
            <p className="text-slate-600 text-sm max-w-2xl">
              {report.statement}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-900">
              {totalProblems}
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">
              Issues to Fix
            </div>
          </div>
        </div>

        {/* Quick Stats - Minimal */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {totalFixes}
            </div>
            <div className="text-sm text-slate-500">Actionable Fixes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {report.overallScore}
            </div>
            <div className="text-sm text-slate-500">Current Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {Math.min(100, report.overallScore + 25)}
            </div>
            <div className="text-sm text-slate-500">Potential Score</div>
          </div>
        </div>
      </div>

      {/* Overall Critical Issues */}
      <ActionableOverallScore report={report} />

      {/* First Impression Actions */}
      <ActionableFirstImpression
        report={report.firstImpression}
        productId={productId}
      />

      {/* Positioning Actions */}
      <ActionablePositioning
        report={report.positioning}
        productId={productId}
        isGuest={isGuest}
      />

      {/* Clarity Actions */}
      <ActionableClarity
        report={report.clarity}
        productId={productId}
        isGuest={isGuest}
      />

      {/* AEO Actions */}
      <ActionableAEO report={report.aeo} productId={productId} />

      {/* Guest CTA - Simplified */}
      {isGuest && (
        <div className="bg-slate-900 rounded-xl p-8 text-center text-white">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-2xl font-bold mb-3">
            Want the Complete Action Plan?
          </h3>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Sign up to unlock detailed recommendations for every section,
            prioritized action items, and copy-paste ready fixes.
          </p>
          <Link href={`/register?productUrl=${encodeURIComponent(report.url)}`}>
            <Button
              size="lg"
              className="font-bold bg-white text-slate-900 hover:bg-slate-100"
            >
              Get Full Action Plan <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
