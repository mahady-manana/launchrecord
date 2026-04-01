"use client";

import {
  FirstImpressionCard,
  HowToReadReport,
  OverallScoreCard,
} from "@/components/sio-report";
import { AEOCard } from "@/components/sio-report/example/AEOCard";
import { ClarityCard } from "@/components/sio-report/example/ClarityCard";
import { PositioningCard } from "@/components/sio-report/example/PositioningCard";
import { Button } from "@/components/ui/button";
import { SIOV5Report } from "@/services/sio-report/schema";
import { FileText, List, ListTodo, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ActionableReport, TodoListView } from "./actionable";
import { WebsiteSummaryCard } from "./example";

interface LockedOverlayProps {
  title: string;
  description: string;
  signupHref: string;
  ctaLabel: string;
  metricLabels?: string[];
}

function LockedOverlay({
  title,
  description,
  signupHref,
  ctaLabel,
  metricLabels,
}: LockedOverlayProps) {
  return (
    <div className=" bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm p-6 text-center max-w-2xl text-center">
        <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4">{description}</p>
        {metricLabels && metricLabels.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {metricLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500"
              >
                <Lock className="h-3 w-3 text-slate-400" />
                {label}
              </span>
            ))}
          </div>
        )}
        <Link href={signupHref}>
          <Button className="bg-orange-500 hover:bg-orange-600">
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}

type DashboardReport = SIOV5Report;

interface DashboardSIOReportProps extends DashboardReport {
  isGuest?: boolean;
}

type ReportView = "full" | "actionable" | "todo" | "summary";

export default function DashboardSIOReport({
  isGuest = false,
  ...report
}: DashboardSIOReportProps) {
  const [view, setView] = useState<ReportView>("full");
  const reportUrl = report.url || "";
  const signupHref = `/register?productUrl=${encodeURIComponent(reportUrl)}`;
  const productId = "unknown"; // This would be passed as a prop in real usage

  const positioningMetricLabels = [
    "Category Ownership",
    "Unique Value Proposition",
    "Competitive Differentiation",
    "Target Audience Clarity",
    "Problem-Solution Fit",
    "Messaging Consistency",
  ];

  const clarityMetricLabels = [
    "Headline Clarity",
    "Value Proposition",
    "Feature-Benefit Mapping",
    "Visual Hierarchy",
    "CTA Clarity",
    "Proof Placement",
    "Unclear Sentences",
  ];

  const buildPositioningSubMetric = (name: string) => ({
    name,
    score: 0,
    current: "",
    positiveComments: [] as string[],
    negativeComments: [] as string[],
    suggested: [] as string[],
  });

  const buildClaritySubMetric = (name: string) => ({
    name,
    score: 0,
    current: "",
    positiveComments: [] as string[],
    negativeComments: [] as string[],
    suggested: [] as string[],
    unclearTexts: [] as Array<{ text: string; issue: string; fix: string }>,
  });

  const hasPositioningDetails = "summary" in report.positioning;
  const hasClarityDetails = "summary" in report.clarity;

  const positioningReport = hasPositioningDetails
    ? report.positioning
    : {
        score: report.positioning.score,
        statement: report.positioning.statement,
        overallCommentPositive: report.positioning.overallCommentPositive,
        overallCommentNegative: report.positioning.overallCommentNegative,
        summary: {
          current: "",
          positiveComments: [] as string[],
          negativeComments: [] as string[],
          suggested: [] as string[],
        },
        subMetrics: {
          categoryOwnership: buildPositioningSubMetric("Category Ownership"),
          uniqueValueProp: buildPositioningSubMetric(
            "Unique Value Proposition",
          ),
          competitiveDiff: buildPositioningSubMetric(
            "Competitive Differentiation",
          ),
          targetAudience: buildPositioningSubMetric("Target Audience Clarity"),
          problemSolutionFit: buildPositioningSubMetric("Problem-Solution Fit"),
          messagingConsistency: buildPositioningSubMetric(
            "Messaging Consistency",
          ),
        },
      };

  const clarityReport = hasClarityDetails
    ? report.clarity
    : {
        score: report.clarity.score,
        statement: report.clarity.statement,
        overallCommentPositive: report.clarity.overallCommentPositive,
        overallCommentNegative: report.clarity.overallCommentNegative,
        summary: {
          current: "",
          positiveComments: [] as string[],
          negativeComments: [] as string[],
          suggested: [] as string[],
        },
        unclearSentences: [] as Array<{
          text: string;
          issue: string;
          fix: string;
        }>,
        subMetrics: {
          headlineClarity: buildClaritySubMetric("Headline Clarity"),
          valueProposition: buildClaritySubMetric("Value Proposition"),
          featureBenefitMapping: buildClaritySubMetric(
            "Feature-Benefit Mapping",
          ),
          visualHierarchy: buildClaritySubMetric("Visual Hierarchy"),
          ctaClarity: buildClaritySubMetric("CTA Clarity"),
          proofPlacement: buildClaritySubMetric("Proof Placement"),
        },
      };

  return (
    <div className="max-w-5xl mx-auto border bg-white rounded-lg">
      {/* Header */}
      <header className="border-b border-slate-200 bg-slate-800 text-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                {isGuest ? "Free SIO-V5 Startup Audit" : "SIO-V5 Audit Report"}
              </h1>
              <div className="pt-4">
                <p className="text-slate-200 flex gap-4">
                  Website:{" "}
                  <span className="bg-slate-700 px-4 rounded-md">
                    {report?.url || "URL unavailable"}
                  </span>
                  <span>
                    {report?.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </span>
                </p>
              </div>
            </div>
            {isGuest && (
              <Link href={signupHref}>
                <Button variant="default">Sign Up For Full Report</Button>
              </Link>
            )}
          </div>

          {/* View Toggle */}
        </div>
      </header>
      <div className="px-8">
        <div className="flex items-center gap-2 mt-6">
          <Button
            variant={view === "full" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("full")}
            className={
              view === "full"
                ? "bg-orange-500 hover:bg-orange-600"
                : "border-slate-600 text-slate-800 hover:bg-slate-700"
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            Full Report View
          </Button>
          <Button
            variant={view === "actionable" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              isGuest ? null : setView("actionable");
            }}
            className={
              view === "actionable"
                ? "bg-orange-500 hover:bg-orange-600"
                : "border-slate-600 text-slate-800 hover:bg-slate-700"
            }
          >
            <ListTodo className="h-4 w-4 mr-2" />
            Actionable View{" "}
            <span className="text-blue-500 underline">
              {isGuest ? "Require signup" : "Beta preview"}
            </span>
          </Button>
          <Button
            variant={view === "todo" ? "default" : "outline"}
            size="sm"
            onClick={() => (isGuest ? null : setView("todo"))}
            className={
              view === "todo"
                ? "bg-orange-500 hover:bg-orange-600"
                : "border-slate-600 text-slate-800 hover:bg-slate-700"
            }
          >
            <List className="h-4 w-4 mr-2" />
            Todo List View{" "}
            <span className="text-blue-500 underline">
              {isGuest ? "Require signup" : "Beta preview"}
            </span>
          </Button>
        </div>
      </div>
      <main className="max-w-5xl mx-auto py-8">
        {/* Render appropriate view */}
        {view === "actionable" ? (
          <ActionableReport
            report={report}
            productId={productId}
            isGuest={isGuest}
          />
        ) : view === "todo" ? (
          <TodoListView
            report={report}
            productId={productId}
            isGuest={isGuest}
          />
        ) : view === "summary" ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              Summary View
            </h2>
            <p className="text-slate-500">Coming soon...</p>
          </div>
        ) : (
          <div>
            {/* Full Report Sections */}
            <div className="px-8 pb-8">
              <HowToReadReport />
            </div>
            <div className="p-8">
              <OverallScoreCard report={report} />
            </div>

            <div className="p-8">
              <WebsiteSummaryCard summary={report.websiteSummary} />
            </div>

            {/* First Impression */}
            <div className="relative p-8">
              <FirstImpressionCard report={report.firstImpression} />
            </div>

            {/* Positioning */}
            <div className="relative p-8">
              <PositioningCard report={positioningReport} isGuest={isGuest} />
              {isGuest && (
                <LockedOverlay
                  title="Stop guessing your positioning - Get full report and fixes"
                  description="See the exact positioning gaps and the copy to fix them."
                  signupHref={signupHref}
                  ctaLabel="Get Full Positioning Report"
                  metricLabels={positioningMetricLabels}
                />
              )}
            </div>

            {/* Clarity */}
            <div className="relative p-8">
              <ClarityCard report={clarityReport} isGuest={isGuest} />
              {isGuest && (
                <LockedOverlay
                  title="Get full clarity report to boost conversions"
                  description="Get sentence-level fixes you can ship today."
                  signupHref={signupHref}
                  ctaLabel="Signup and Get full report"
                  metricLabels={clarityMetricLabels}
                />
              )}
            </div>

            <div className="p-8">
              {/* AEO - Full data shown (free tier) */}
              <AEOCard report={report.aeo} />
            </div>

            {/* CTA to Sign Up */}
            {isGuest && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Ready To Fix Your Startup's Messaging?
                </h2>
                <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                  Sign up now to unlock the full report with detailed analysis,
                  specific recommendations, and copy-paste ready rewrites for
                  every section.
                </p>
                <Link href={signupHref}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-bold text-white"
                  >
                    Create Free Account to See Full Report
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {isGuest && (
          <div className="border-t border-slate-200 p-8 pb-12">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-500">
                This is a free audit tool. Sign up to save your reports and
                access detailed recommendations.
              </p>
              <p className="text-xs text-slate-400">
                Your report is saved automatically. Create an account to access
                it anytime.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
