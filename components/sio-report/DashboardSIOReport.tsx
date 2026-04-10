"use client";

import {
  FirstImpressionCard,
  HowToReadReport,
  MetricInsight,
  OverallScoreCard,
} from "@/components/sio-report";
import { AEOCard } from "@/components/sio-report/example/AEOCard";
import { ClarityCard } from "@/components/sio-report/example/ClarityCard";
import { PositioningCard } from "@/components/sio-report/example/PositioningCard";
import { Button } from "@/components/ui/button";
import { SIOV5Report } from "@/services/sio-report/schema";
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

// Helper function for score colors
function getScoreColors(score: number) {
  return score >= 70
    ? "text-green-600 bg-green-50"
    : score >= 50
      ? "text-yellow-600 bg-yellow-50"
      : score >= 30
        ? "text-orange-600 bg-orange-50"
        : "text-red-600 bg-red-50";
}

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

interface NavItem {
  id: string;
  label: string;
  icon?: string;
  children?: NavItem[];
}

export default function DashboardSIOReport({
  isGuest = false,
  ...report
}: DashboardSIOReportProps) {
  const [view, setView] = useState<ReportView>("full");
  const [activeSection, setActiveSection] = useState("overview");
  const reportUrl = report.url || "";
  const signupHref = `/register?productUrl=${encodeURIComponent(reportUrl)}`;
  const productId = "unknown";

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

  // Navigation structure
  const navigation: NavItem[] = [
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

  // Scroll spy to detect active section
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
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - 100);
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

  // Smooth scroll to section
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

  // Render sidebar navigation
  const renderSidebar = () => (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 space-y-1 no-scrollbar">
      {navigation.map((nav) => (
        <div key={nav.id}>
          <button
            onClick={() => scrollToSection(nav.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSection === nav.id
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{nav.icon}</span>
            <span className="flex-1">{nav.label}</span>
          </button>

          {/* Sub-navigation - Always visible, grayed out for guests */}
          {nav.children && (
            <div
              className={`ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-3 ${isGuest ? "opacity-40 pointer-events-none select-none grayscale" : ""}`}
            >
              {nav.children.map((child, idx) => (
                <button
                  key={child.id}
                  onClick={() => !isGuest && scrollToSection(child.id)}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                    activeSection === child.id
                      ? "text-primary font-semibold"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  disabled={isGuest && idx === 0} // Disable first child (overview) for guests
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="max-w-7xl mx-auto border bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-1 px-4 py-1 bg-slate-100 border-b rounded-t-md border-slate-200">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex flex-1 h-8 items-center gap-4 bg-white text-slate-500 border border-slate-200 px-6 rounded-full justify-start">
          <RotateCw className="h-4 w-4 text-slate-400" />
          <span>{report?.url || "URL unavailable"}</span>
        </div>
        <div className="flex items-center text-slate-500 gap-2 justify-center">
          <span className="text-xs sm:text-sm">
            {report?.createdAt
              ? new Date(report.createdAt).toLocaleString()
              : "Date unavailable"}
          </span>
          {isGuest && (
            <Link href={signupHref} className="shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-none px-0 sm:w-auto"
              >
                <Lock className="mr-2"></Lock>
                Sign up for full report
                <ArrowRight />
              </Button>
            </Link>
          )}
        </div>
      </div>
      <header className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl font-bold text-slate-600">
                {isGuest ? "Free SIO-V5 startup audit" : "SIO-V5 audit report"}
              </h1>
              <p className="text-slate-600 flex flex-col sm:flex-row gap-2 sm:gap-4">
                Startup's positoining audit, messaging analysis and AEO
                visibility check with actionable insights to fix them all and
                start growing.
              </p>
            </div>
          </div>

          {/* View Toggle */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="border-b border-slate-200 bg-white shadow">
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
              onClick={() => {
                isGuest ? null : setView("actionable");
              }}
              className={
                view === "actionable"
                  ? "bg-primary hover:bg-primary/90 rounded-none"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }
            >
              <ListTodo className="h-4 w-4 mr-2" />
              Actionable{" "}
              {isGuest && (
                <span className="text-xs text-slate-400 ml-1">(Locked)</span>
              )}
            </Button>
            <Button
              variant={view === "todo" ? "default" : "outline"}
              size="sm"
              onClick={() => (isGuest ? null : setView("todo"))}
              className={
                view === "todo"
                  ? "bg-primary hover:bg-primary/90 rounded-none"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }
            >
              <List className="h-4 w-4 mr-2" />
              Todo List{" "}
              {isGuest && (
                <span className="text-xs text-slate-400 ml-1">(Locked)</span>
              )}
            </Button>
          </div>
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
          ) : (
            // Full Report with Sidebar
            <div className="flex gap-8 px-4 sm:px-6 py-8">
              {/* Sidebar Navigation */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                {renderSidebar()}
              </aside>

              {/* Report Content */}
              <div className="flex-1 min-w-0 space-y-8">
                {/* How to Read */}
                <div id="overview">
                  <HowToReadReport />
                </div>

                {/* Overall Score */}
                <div id="overview" className="px-0">
                  <OverallScoreCard report={report} />
                </div>

                {/* Website Summary */}
                <div id="website-summary" className="px-0">
                  <WebsiteSummaryCard summary={report.websiteSummary} />
                </div>

                {/* First Impression */}
                <div id="first-impression" className="px-0">
                  <FirstImpressionCard
                    report={report.firstImpression}
                    isGuest={isGuest}
                  />
                </div>

                {/* Positioning Section */}
                <div id="positioning" className="relative space-y-8">
                  <div id="positioning-overview">
                    <PositioningCard
                      report={positioningReport}
                      isGuest={isGuest}
                    />
                  </div>

                  {/* Positioning Sub-metrics with IDs for navigation */}
                  {!isGuest && positioningReport.subMetrics && (
                    <>
                      <div id="category-ownership" className="px-0">
                        <MetricInsight
                          title="Category Ownership"
                          current={
                            positioningReport.subMetrics.categoryOwnership
                              .current
                          }
                          positiveComments={
                            positioningReport.subMetrics.categoryOwnership
                              .positiveComments
                          }
                          negativeComments={
                            positioningReport.subMetrics.categoryOwnership
                              .negativeComments
                          }
                          suggested={
                            positioningReport.subMetrics.categoryOwnership
                              .suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(positioningReport.subMetrics.categoryOwnership.score)}`}
                          >
                            Score:{" "}
                            {
                              positioningReport.subMetrics.categoryOwnership
                                .score
                            }
                            /100
                          </span>
                        </div>
                      </div>

                      <div id="unique-value-prop" className="px-0">
                        <MetricInsight
                          title="Unique Value Proposition"
                          current={
                            positioningReport.subMetrics.uniqueValueProp.current
                          }
                          positiveComments={
                            positioningReport.subMetrics.uniqueValueProp
                              .positiveComments
                          }
                          negativeComments={
                            positioningReport.subMetrics.uniqueValueProp
                              .negativeComments
                          }
                          suggested={
                            positioningReport.subMetrics.uniqueValueProp
                              .suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(positioningReport.subMetrics.uniqueValueProp.score)}`}
                          >
                            Score:{" "}
                            {positioningReport.subMetrics.uniqueValueProp.score}
                            /100
                          </span>
                        </div>
                      </div>

                      <div id="competitive-diff" className="px-0">
                        <MetricInsight
                          title="Competitive Differentiation"
                          current={
                            positioningReport.subMetrics.competitiveDiff.current
                          }
                          positiveComments={
                            positioningReport.subMetrics.competitiveDiff
                              .positiveComments
                          }
                          negativeComments={
                            positioningReport.subMetrics.competitiveDiff
                              .negativeComments
                          }
                          suggested={
                            positioningReport.subMetrics.competitiveDiff
                              .suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(positioningReport.subMetrics.competitiveDiff.score)}`}
                          >
                            Score:{" "}
                            {positioningReport.subMetrics.competitiveDiff.score}
                            /100
                          </span>
                        </div>
                      </div>

                      <div id="target-audience" className="px-0">
                        <MetricInsight
                          title="Target Audience Clarity"
                          current={
                            positioningReport.subMetrics.targetAudience.current
                          }
                          positiveComments={
                            positioningReport.subMetrics.targetAudience
                              .positiveComments
                          }
                          negativeComments={
                            positioningReport.subMetrics.targetAudience
                              .negativeComments
                          }
                          suggested={
                            positioningReport.subMetrics.targetAudience
                              .suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(positioningReport.subMetrics.targetAudience.score)}`}
                          >
                            Score:{" "}
                            {positioningReport.subMetrics.targetAudience.score}
                            /100
                          </span>
                        </div>
                      </div>

                      <div id="problem-solution" className="px-0">
                        <MetricInsight
                          title="Problem-Solution Fit"
                          current={
                            positioningReport.subMetrics.problemSolutionFit
                              .current
                          }
                          positiveComments={
                            positioningReport.subMetrics.problemSolutionFit
                              .positiveComments
                          }
                          negativeComments={
                            positioningReport.subMetrics.problemSolutionFit
                              .negativeComments
                          }
                          suggested={
                            positioningReport.subMetrics.problemSolutionFit
                              .suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(positioningReport.subMetrics.problemSolutionFit.score)}`}
                          >
                            Score:{" "}
                            {
                              positioningReport.subMetrics.problemSolutionFit
                                .score
                            }
                            /100
                          </span>
                        </div>
                      </div>

                      <div id="messaging-consistency" className="px-0">
                        <MetricInsight
                          title="Messaging Consistency"
                          current={
                            positioningReport.subMetrics.messagingConsistency
                              .current
                          }
                          positiveComments={
                            positioningReport.subMetrics.messagingConsistency
                              .positiveComments
                          }
                          negativeComments={
                            positioningReport.subMetrics.messagingConsistency
                              .negativeComments
                          }
                          suggested={
                            positioningReport.subMetrics.messagingConsistency
                              .suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(positioningReport.subMetrics.messagingConsistency.score)}`}
                          >
                            Score:{" "}
                            {
                              positioningReport.subMetrics.messagingConsistency
                                .score
                            }
                            /100
                          </span>
                        </div>
                      </div>
                    </>
                  )}

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

                {/* Clarity Section */}
                <div id="clarity" className="relative space-y-8">
                  <div id="clarity-overview">
                    <ClarityCard report={clarityReport} isGuest={isGuest} />
                  </div>

                  {/* Clarity Sub-metrics with IDs for navigation */}
                  {!isGuest && clarityReport.subMetrics && (
                    <>
                      <div id="headline-clarity" className="px-0">
                        <MetricInsight
                          title="Headline Clarity"
                          current={
                            clarityReport.subMetrics.headlineClarity.current
                          }
                          positiveComments={
                            clarityReport.subMetrics.headlineClarity
                              .positiveComments
                          }
                          negativeComments={
                            clarityReport.subMetrics.headlineClarity
                              .negativeComments
                          }
                          suggested={
                            clarityReport.subMetrics.headlineClarity.suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(clarityReport.subMetrics.headlineClarity.score)}`}
                          >
                            Score:{" "}
                            {clarityReport.subMetrics.headlineClarity.score}/100
                          </span>
                        </div>
                        {clarityReport.subMetrics.headlineClarity
                          .unclearTexts &&
                          clarityReport.subMetrics.headlineClarity.unclearTexts
                            .length > 0 && (
                            <div className="mt-4 space-y-2">
                              {clarityReport.subMetrics.headlineClarity.unclearTexts.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="border-l-2 border-orange-200 pl-3"
                                  >
                                    <div className="text-orange-700 text-sm line-through mb-1">
                                      "{item.text}"
                                    </div>
                                    <div className="text-orange-600 text-xs italic mb-2">
                                      ⚠ {item.issue}
                                    </div>
                                    <div className="text-green-700 text-sm font-medium">
                                      → {item.fix}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>

                      <div id="value-proposition" className="px-0">
                        <MetricInsight
                          title="Unique Value Proposition"
                          current={
                            clarityReport.subMetrics.valueProposition.current
                          }
                          positiveComments={
                            clarityReport.subMetrics.valueProposition
                              .positiveComments
                          }
                          negativeComments={
                            clarityReport.subMetrics.valueProposition
                              .negativeComments
                          }
                          suggested={
                            clarityReport.subMetrics.valueProposition.suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(clarityReport.subMetrics.valueProposition.score)}`}
                          >
                            Score:{" "}
                            {clarityReport.subMetrics.valueProposition.score}
                            /100
                          </span>
                        </div>
                        {clarityReport.subMetrics.valueProposition
                          .unclearTexts &&
                          clarityReport.subMetrics.valueProposition.unclearTexts
                            .length > 0 && (
                            <div className="mt-4 space-y-2">
                              {clarityReport.subMetrics.valueProposition.unclearTexts.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="border-l-2 border-orange-200 pl-3"
                                  >
                                    <div className="text-orange-700 text-sm line-through mb-1">
                                      "{item.text}"
                                    </div>
                                    <div className="text-orange-600 text-xs italic mb-2">
                                      ⚠ {item.issue}
                                    </div>
                                    <div className="text-green-700 text-sm font-medium">
                                      → {item.fix}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>

                      <div id="feature-benefit" className="px-0">
                        <MetricInsight
                          title="Feature-Benefit Mapping"
                          current={
                            clarityReport.subMetrics.featureBenefitMapping
                              .current
                          }
                          positiveComments={
                            clarityReport.subMetrics.featureBenefitMapping
                              .positiveComments
                          }
                          negativeComments={
                            clarityReport.subMetrics.featureBenefitMapping
                              .negativeComments
                          }
                          suggested={
                            clarityReport.subMetrics.featureBenefitMapping
                              .suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(clarityReport.subMetrics.featureBenefitMapping.score)}`}
                          >
                            Score:{" "}
                            {
                              clarityReport.subMetrics.featureBenefitMapping
                                .score
                            }
                            /100
                          </span>
                        </div>
                        {clarityReport.subMetrics.featureBenefitMapping
                          .unclearTexts &&
                          clarityReport.subMetrics.featureBenefitMapping
                            .unclearTexts.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {clarityReport.subMetrics.featureBenefitMapping.unclearTexts.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="border-l-2 border-orange-200 pl-3"
                                  >
                                    <div className="text-orange-700 text-sm line-through mb-1">
                                      "{item.text}"
                                    </div>
                                    <div className="text-orange-600 text-xs italic mb-2">
                                      ⚠ {item.issue}
                                    </div>
                                    <div className="text-green-700 text-sm font-medium">
                                      → {item.fix}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>

                      <div id="visual-hierarchy" className="px-0">
                        <MetricInsight
                          title="Visual Hierarchy"
                          current={
                            clarityReport.subMetrics.visualHierarchy.current
                          }
                          positiveComments={
                            clarityReport.subMetrics.visualHierarchy
                              .positiveComments
                          }
                          negativeComments={
                            clarityReport.subMetrics.visualHierarchy
                              .negativeComments
                          }
                          suggested={
                            clarityReport.subMetrics.visualHierarchy.suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(clarityReport.subMetrics.visualHierarchy.score)}`}
                          >
                            Score:{" "}
                            {clarityReport.subMetrics.visualHierarchy.score}/100
                          </span>
                        </div>
                        {clarityReport.subMetrics.visualHierarchy
                          .unclearTexts &&
                          clarityReport.subMetrics.visualHierarchy.unclearTexts
                            .length > 0 && (
                            <div className="mt-4 space-y-2">
                              {clarityReport.subMetrics.visualHierarchy.unclearTexts.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="border-l-2 border-orange-200 pl-3"
                                  >
                                    <div className="text-orange-700 text-sm line-through mb-1">
                                      "{item.text}"
                                    </div>
                                    <div className="text-orange-600 text-xs italic mb-2">
                                      ⚠ {item.issue}
                                    </div>
                                    <div className="text-green-700 text-sm font-medium">
                                      → {item.fix}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>

                      <div id="cta-clarity" className="px-0">
                        <MetricInsight
                          title="CTA Clarity"
                          current={clarityReport.subMetrics.ctaClarity.current}
                          positiveComments={
                            clarityReport.subMetrics.ctaClarity.positiveComments
                          }
                          negativeComments={
                            clarityReport.subMetrics.ctaClarity.negativeComments
                          }
                          suggested={
                            clarityReport.subMetrics.ctaClarity.suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(clarityReport.subMetrics.ctaClarity.score)}`}
                          >
                            Score: {clarityReport.subMetrics.ctaClarity.score}
                            /100
                          </span>
                        </div>
                        {clarityReport.subMetrics.ctaClarity.unclearTexts &&
                          clarityReport.subMetrics.ctaClarity.unclearTexts
                            .length > 0 && (
                            <div className="mt-4 space-y-2">
                              {clarityReport.subMetrics.ctaClarity.unclearTexts.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="border-l-2 border-orange-200 pl-3"
                                  >
                                    <div className="text-orange-700 text-sm line-through mb-1">
                                      "{item.text}"
                                    </div>
                                    <div className="text-orange-600 text-xs italic mb-2">
                                      ⚠ {item.issue}
                                    </div>
                                    <div className="text-green-700 text-sm font-medium">
                                      → {item.fix}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>

                      <div id="proof-placement" className="px-0">
                        <MetricInsight
                          title="Proof Placement"
                          current={
                            clarityReport.subMetrics.proofPlacement.current
                          }
                          positiveComments={
                            clarityReport.subMetrics.proofPlacement
                              .positiveComments
                          }
                          negativeComments={
                            clarityReport.subMetrics.proofPlacement
                              .negativeComments
                          }
                          suggested={
                            clarityReport.subMetrics.proofPlacement.suggested
                          }
                        />
                        <div className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(clarityReport.subMetrics.proofPlacement.score)}`}
                          >
                            Score:{" "}
                            {clarityReport.subMetrics.proofPlacement.score}
                            /100
                          </span>
                        </div>
                        {clarityReport.subMetrics.proofPlacement.unclearTexts &&
                          clarityReport.subMetrics.proofPlacement.unclearTexts
                            .length > 0 && (
                            <div className="mt-4 space-y-2">
                              {clarityReport.subMetrics.proofPlacement.unclearTexts.map(
                                (item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="border-l-2 border-orange-200 pl-3"
                                  >
                                    <div className="text-orange-700 text-sm line-through mb-1">
                                      "{item.text}"
                                    </div>
                                    <div className="text-orange-600 text-xs italic mb-2">
                                      ⚠ {item.issue}
                                    </div>
                                    <div className="text-green-700 text-sm font-medium">
                                      → {item.fix}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    </>
                  )}

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

                {/* AEO Section */}
                <div id="aeo">
                  <AEOCard report={report.aeo} />
                </div>

                {/* CTA to Sign Up */}
                {isGuest && (
                  <div className="bg-gradient-to-r from-secondary to-secondary/90 p-6 sm:p-8 text-center text-white rounded-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">
                      Ready To Fix Your Startup's Messaging?
                    </h2>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                      Sign up now to unlock the full report with detailed
                      analysis, specific recommendations, and copy-paste ready
                      rewrites for every section.
                    </p>
                    <Link href={signupHref}>
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
