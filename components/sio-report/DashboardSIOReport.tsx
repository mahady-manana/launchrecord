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
import { useSubscription } from "@/hooks/use-subscription";
import { SIOV5Report } from "@/services/sio-report/schema";
import { SubscriptionRecord } from "@/types/subscription";
import {
  ArrowRight,
  FileText,
  List,
  ListTodo,
  Lock,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ActionableReport, TodoListView } from "./actionable";
import { WebsiteSummaryCard } from "./example";

// Split components
import { LimitedClarityInsight } from "./DashboardSIOReport/components/LimitedClarityInsight";
import { LimitedMetricInsight } from "./DashboardSIOReport/components/LimitedMetricInsight";
import { ReportSidebar } from "./DashboardSIOReport/components/ReportSidebar";
import { LockedOverlay } from "./LockOverlay";

// Re-exports for external consumers
export type { SubscriptionTier } from "@/hooks/use-subscription";
export { LimitedClarityInsight } from "./DashboardSIOReport/components/LimitedClarityInsight";
export { LimitedMetricInsight } from "./DashboardSIOReport/components/LimitedMetricInsight";
export { ReportSidebar } from "./DashboardSIOReport/components/ReportSidebar";
export {
  getAllSectionIds,
  reportNavigation,
} from "./DashboardSIOReport/constants/navigation";
export { getUserType, limitArray } from "./DashboardSIOReport/utils";

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

type ReportView = "full" | "actionable" | "todo" | "summary";

interface DashboardSIOReportProps extends SIOV5Report {
  isGuest?: boolean;
  subscription?: SubscriptionRecord | null;
}

export default function DashboardSIOReport({
  isGuest = false,
  subscription = null,
  ...report
}: DashboardSIOReportProps) {
  const [view, setView] = useState<ReportView>("full");
  const [activeSection, setActiveSection] = useState("overview");

  // Use subscription hook to get tier
  const { tier, isFree, isPaid } = useSubscription(isGuest);

  const reportUrl = report.url || "";
  const productId = report._id || "unknown";

  const ctaHref = isFree
    ? `/dashboard/${productId}/subscription`
    : `/register?productUrl=${encodeURIComponent(reportUrl)}`;

  // Build sub-metrics if missing
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

  // Navigation
  const navigation = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "website-summary", label: "Website Summary", icon: "🌐" },
    { id: "first-impression", label: "First Impression", icon: "👁️" },
    {
      id: "positioning",
      label: "Positioning Analysis",
      icon: "🎯",
      children: [
        {
          id: "positioning-overview",
          label: "Market Positioning & Differentiation",
        },
        { id: "category-ownership", label: "Category Ownership" },
        { id: "unique-value-prop", label: "Unique Value Proposition" },
        { id: "competitive-diff", label: "Competitive Differentiation" },
        { id: "target-audience", label: "Target Audience Clarity" },
        { id: "problem-solution", label: "Problem-Solution Fit" },
        { id: "messaging-consistency", label: "Messaging Consistency" },
      ],
    },
    {
      id: "clarity",
      label: "Clarity Analysis",
      icon: "✨",
      children: [
        { id: "clarity-overview", label: "Messaging Clarity" },
        { id: "headline-clarity", label: "Headline Clarity" },
        { id: "value-proposition", label: "Value Proposition" },
        { id: "feature-benefit", label: "Feature-Benefit Mapping" },
        { id: "visual-hierarchy", label: "Visual Hierarchy" },
        { id: "cta-clarity", label: "CTA Clarity" },
        { id: "proof-placement", label: "Proof Placement" },
      ],
    },
    { id: "aeo", label: "AEO Presence", icon: "🤖" },
  ];

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.flatMap((nav) => [
        nav.id,
        ...(nav.children?.map((child) => child.id) || []),
      ]);

      let currentSection = sections[0];
      let minDistance = Infinity;

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const distance = Math.abs(element.getBoundingClientRect().top - 100);
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = sectionId;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto border bg-white rounded-lg">
      {/* Browser-style Header */}
      <div className="flex items-center justify-between gap-2 px-1 px-4 py-2 bg-slate-800 border-b rounded-t-md border-slate-200">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex flex-1 h-7 items-center gap-4 bg-slate-200 text-slate-700 border border-slate-200 px-6 rounded-full justify-start">
          <RotateCw className="h-4 w-4" />
          <span>{report?.url || "URL unavailable"}</span>
        </div>
        <div className="flex items-center text-slate-200 gap-2 justify-center">
          <span className="text-xs sm:text-sm">
            {report?.createdAt
              ? new Date(report.createdAt).toLocaleString()
              : "Date unavailable"}
          </span>
          {isGuest && (
            <Link href={ctaHref} className="shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-none px-0 text-slate-200 sm:w-auto"
              >
                <Lock className="mr-2" />
                Sign up for full report
                <ArrowRight />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Page Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl font-bold text-slate-600">
                {isGuest ? "Free SIO-V5 startup audit" : "SIO-V5 audit report"}
              </h1>
              <p className="text-slate-600 flex flex-col sm:flex-row gap-2 sm:gap-4">
                Startup&apos;s positioning audit, messaging analysis and AEO
                visibility check with actionable insights to fix them all and
                start growing.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="border-b border-slate-200 bg-white shadow">
          {/* View Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-3 sm:items-center gap-0 bg-slate-50 border-b border-slate-200">
            <Button
              variant={view === "full" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("full")}
              className={
                view === "full"
                  ? "bg-primary hover:bg-primary/90 rounded-none"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Full Report
            </Button>
            <Button
              variant={view === "actionable" ? "default" : "outline"}
              size="sm"
              onClick={() => (isPaid ? setView("actionable") : null)}
              className={
                view === "actionable"
                  ? "bg-primary hover:bg-primary/90 rounded-none"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }
            >
              <ListTodo className="h-4 w-4 mr-2" />
              Actionable{" "}
              {!isPaid && (
                <span className="text-xs text-slate-400 ml-1">(Locked)</span>
              )}
            </Button>
            <Button
              variant={view === "todo" ? "default" : "outline"}
              size="sm"
              onClick={() => (isPaid ? setView("todo") : null)}
              className={
                view === "todo"
                  ? "bg-primary hover:bg-primary/90 rounded-none"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }
            >
              <List className="h-4 w-4 mr-2" />
              Todo List{" "}
              {!isPaid && (
                <span className="text-xs text-slate-400 ml-1">(Locked)</span>
              )}
            </Button>
          </div>

          {/* Content */}
          {view === "actionable" ? (
            <ActionableReport
              report={report}
              productId={productId}
              isGuest={!isPaid}
            />
          ) : view === "todo" ? (
            <TodoListView
              report={report}
              productId={productId}
              isGuest={!isPaid}
            />
          ) : (
            <div className="flex gap-8 px-4 sm:px-6 py-8">
              {/* Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <ReportSidebar
                  isGuest={isGuest}
                  activeSection={activeSection}
                  onNavigate={scrollToSection}
                />
              </aside>

              {/* Report Content */}
              <div className="flex-1 min-w-0 space-y-8">
                <div id="overview">
                  <HowToReadReport />
                </div>

                <div id="overview" className="px-0">
                  <OverallScoreCard
                    report={report}
                    isGuest={isGuest}
                    ctaHref={ctaHref}
                  />
                </div>

                <div id="website-summary" className="px-0">
                  <WebsiteSummaryCard summary={report.websiteSummary} />
                </div>

                <div id="first-impression" className="px-0">
                  <FirstImpressionCard
                    report={report.firstImpression}
                    isGuest={isGuest}
                    ctaHref={ctaHref}
                  />
                </div>

                {/* Positioning */}
                <div id="positioning" className="relative space-y-8">
                  <div id="positioning-overview">
                    <PositioningCard
                      report={positioningReport}
                      isGuest={isGuest}
                      ctaHref={ctaHref}
                    />
                  </div>

                  {positioningReport.subMetrics && (
                    <>
                      <LimitedMetricInsight
                        title="Category Ownership"
                        id="category-ownership"
                        metric={positioningReport.subMetrics.categoryOwnership}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedMetricInsight
                        title="Unique Value Proposition"
                        id="unique-value-prop"
                        metric={positioningReport.subMetrics.uniqueValueProp}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedMetricInsight
                        title="Competitive Differentiation"
                        id="competitive-diff"
                        metric={positioningReport.subMetrics.competitiveDiff}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedMetricInsight
                        title="Target Audience Clarity"
                        id="target-audience"
                        metric={positioningReport.subMetrics.targetAudience}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedMetricInsight
                        title="Problem-Solution Fit"
                        id="problem-solution"
                        metric={positioningReport.subMetrics.problemSolutionFit}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedMetricInsight
                        title="Messaging Consistency"
                        id="messaging-consistency"
                        metric={
                          positioningReport.subMetrics.messagingConsistency
                        }
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                    </>
                  )}
                  {isGuest && (
                    <LockedOverlay
                      title="Stop guessing your positioning - Get full insights and fixes"
                      subtitle="See the exact positioning gaps and the copy to fix them."
                      signupHref={ctaHref}
                      ctaLabel="Get Full Positioning Report"
                      metricLabels={positioningMetricLabels}
                    />
                  )}
                </div>

                {/* Clarity */}
                <div id="clarity" className="relative space-y-8">
                  <div id="clarity-overview">
                    <ClarityCard
                      report={clarityReport}
                      isGuest={isGuest}
                      ctaHref={ctaHref}
                    />
                  </div>

                  {clarityReport.subMetrics && (
                    <>
                      <LimitedClarityInsight
                        title="Headline Clarity"
                        id="headline-clarity"
                        metric={clarityReport.subMetrics.headlineClarity}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedClarityInsight
                        title="Value Proposition"
                        id="value-proposition"
                        metric={clarityReport.subMetrics.valueProposition}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedClarityInsight
                        title="Feature-Benefit Mapping"
                        id="feature-benefit"
                        metric={clarityReport.subMetrics.featureBenefitMapping}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedClarityInsight
                        title="Visual Hierarchy"
                        id="visual-hierarchy"
                        metric={clarityReport.subMetrics.visualHierarchy}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedClarityInsight
                        title="CTA Clarity"
                        id="cta-clarity"
                        metric={clarityReport.subMetrics.ctaClarity}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                      <LimitedClarityInsight
                        title="Proof Placement"
                        id="proof-placement"
                        metric={clarityReport.subMetrics.proofPlacement}
                        isGuest={isGuest}
                        ctaHref={ctaHref}
                      />
                    </>
                  )}
                  {isGuest && (
                    <LockedOverlay
                      title="Get full clarity report to boost conversions"
                      subtitle="Get sentence-level fixes you can ship today."
                      signupHref={ctaHref}
                      ctaLabel="Signup and Get full report"
                      metricLabels={clarityMetricLabels}
                    />
                  )}
                </div>

                {/* AEO */}
                <div id="aeo">
                  <AEOCard report={report.aeo} />
                </div>

                {/* Guest CTA */}
                {isGuest && (
                  <div className="bg-gradient-to-r from-secondary to-secondary/90 p-6 sm:p-8 text-center text-white rounded-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">
                      Ready To Fix Your Startup&apos;s Messaging?
                    </h2>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                      Sign up now to unlock the full report with detailed
                      analysis, specific recommendations, and copy-paste ready
                      rewrites for every section.
                    </p>
                    <Link href={ctaHref}>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="font-bold text-white bg-white/20 hover:bg-white/30"
                      >
                        Create Free Account to See Full Report
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
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
                  Your report is saved automatically. Create an account to
                  access it anytime.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
