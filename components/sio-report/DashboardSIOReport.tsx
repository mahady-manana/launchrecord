"use client";

import { HowToReadReport, OverallScoreCard } from "@/components/sio-report";
import {
  ActionableReport,
  TodoListView,
} from "@/components/sio-report/actionable";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { SubscriptionRecord } from "@/types/subscription";
import { ArrowRight, FileText, Lightbulb, Lock, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useUserStore } from "@/stores/user-store";
import {
  AEOSection,
  ClaritySection,
  FirstImpressionSection,
  PositioningSection,
  RecommendationsView,
  ReportSidebar,
  WebsiteSummarySection,
} from "./DashboardSIOReport/components";

// Re-exports for external consumers
export type { SubscriptionTier } from "@/hooks/use-subscription";
export { ReportSidebar } from "./DashboardSIOReport/components/ReportSidebar";
export {
  getAllSectionIds,
  reportNavigation,
} from "./DashboardSIOReport/constants/navigation";
export { getUserType, limitArray } from "./DashboardSIOReport/utils";

type ReportView = "full" | "actionable" | "todo" | "recommendations";

/**
 * Plain data type for the dashboard SIO report.
 * Accepts both API responses and Mongoose documents (after .lean() or .toObject()).
 */
export interface SIOReportData {
  _id?: string;
  product?: string;
  url: string;
  overallScore: number;
  score?: number;
  statement: string;
  reportBand?: string;
  overallCommentPositive: string[];
  overallCommentNegative: string[];
  websiteSummary: any;
  firstImpression: any;
  positioning: any;
  clarity: any;
  aeo: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DashboardSIOReportProps {
  report: SIOReportData;
  isGuest?: boolean;
  subscription?: SubscriptionRecord | null;
}

export default function DashboardSIOReport({
  report,
  subscription = null,
}: DashboardSIOReportProps) {
  const [view, setView] = useState<ReportView>("full");
  const [activeSection, setActiveSection] = useState("overview");
  const { isFree, isPaid } = useSubscription();
  const isGuest = useUserStore((s) => s.isGuest);
  const reportUrl = report.url || "";
  const productId = report._id || report.product || "unknown";

  const ctaHref = isFree
    ? `/dashboard/${productId}/subscription`
    : `/register?productUrl=${encodeURIComponent(reportUrl)}`;

  // Navigation sections
  const navigation = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "website-summary", label: "Website Summary", icon: "🌐" },
    { id: "first-impression", label: "First Impression", icon: "👁️" },
    {
      id: "positioning",
      label: "Positioning Analysis",
      icon: "🎯",
      children: [
        { id: "positioning-overview", label: "Market Positioning" },
        {
          id: "positioning-categoryOwnership",
          label: "Category Ownership",
        },
        {
          id: "positioning-uniqueValueProp",
          label: "Unique Value Proposition",
        },
        {
          id: "positioning-competitiveDiff",
          label: "Competitive Differentiation",
        },
        { id: "positioning-targetAudience", label: "Target Audience Clarity" },
        {
          id: "positioning-problemSolutionFit",
          label: "Problem-Solution Fit",
        },
        {
          id: "positioning-messagingConsistency",
          label: "Messaging Consistency",
        },
      ],
    },
    {
      id: "clarity",
      label: "Clarity Analysis",
      icon: "✨",
      children: [
        { id: "clarity-overview", label: "Messaging Clarity" },
        { id: "clarity-headlineClarity", label: "Headline Clarity" },
        { id: "clarity-valueProposition", label: "Value Proposition" },
        {
          id: "clarity-featureBenefitMapping",
          label: "Feature-Benefit Mapping",
        },
        { id: "clarity-visualHierarchy", label: "Visual Hierarchy" },
        { id: "clarity-ctaClarity", label: "CTA Clarity" },
        { id: "clarity-proofPlacement", label: "Proof Placement" },
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
    <div className="max-w-7xl mx-auto border bg-white rounded-lg ">
      {/* Browser-style Header */}
      <div className="sticky top-2 z-50   bg-slate-800 border-b rounded-t-md">
        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex flex-1 h-7 items-center gap-4 bg-slate-200 text-slate-700 border border-slate-200 px-6 rounded-full justify-start">
            <RotateCw className="h-4 w-4" />
            <span>{report.url || "URL unavailable"}</span>
          </div>
          <div className="hidden md:flex items-center text-slate-200 gap-2">
            <span className="text-xs sm:text-sm">
              {report.createdAt
                ? new Date(report.createdAt).toLocaleString()
                : "Date unavailable"}
            </span>
            {isGuest && (
              <Link href={ctaHref} className="shrink-0 ">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full rounded-none px-0 text-slate-200 sm:w-auto"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Sign up for full report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="pt-2 z-40 grid grid-cols-2 md:grid-cols-2 bg-slate-50 border-b border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("full")}
            className={
              view === "full"
                ? "border-b-2 rounded-none border-primary text-primary bg-white hover:bg-slate-50"
                : "border-b-2 rounded-none border-slate-300 text-slate-700 hover:bg-slate-50"
            }
          >
            <FileText className="h-4 w-4 mr-2" />
            Full Report
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("recommendations")}
            className={
              view === "recommendations"
                ? "border-b-2  rounded-none border-primary text-orange-700 bg-white hover:bg-slate-50"
                : "border-b-2 rounded-none border-slate-300 text-orange-700 hover:bg-slate-50 bg-white"
            }
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Recommendations{" "}
            <span className="hidden md:block"> and exact fixes</span>
          </Button>
        </div>
      </div>

      {/* Page Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl font-bold text-slate-600">
              {isGuest ? "Free SIO-V5 startup audit" : "SIO-V5 audit report"}
            </h1>
            <p className="text-slate-600">
              Startup&apos;s positioning audit, messaging analysis and AEO
              visibility check with actionable insights.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="border-b border-slate-200 bg-white">
          {/* View Toggle - Sticky */}

          {/* Content */}
          {view === "recommendations" ? (
            <RecommendationsView
              report={report as any}
              productId={productId}
              isGuest={isGuest}
              isPaid={isPaid}
            />
          ) : view === "actionable" ? (
            <ActionableReport
              report={report as any}
              productId={productId}
              isGuest={!isPaid}
            />
          ) : view === "todo" ? (
            <TodoListView
              report={report as any}
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
              <div className="flex-1 min-w-0 space-y-0">
                {/* Overview */}
                <div id="overview" className="px-0 mb-8">
                  <HowToReadReport />
                </div>
                <div id="overview-score" className="px-0 mb-8">
                  <OverallScoreCard
                    report={report as any}
                    isGuest={isGuest}
                    ctaHref={ctaHref}
                  />
                </div>

                {/* Website Summary */}
                <div id="website-summary" className="px-0 mb-8">
                  <WebsiteSummarySection summary={report.websiteSummary} />
                </div>

                {/* First Impression */}
                <div id="first-impression" className="px-0 mb-8">
                  <FirstImpressionSection
                    report={report.firstImpression}
                    ctaHref={ctaHref}
                    isGuest={isGuest}
                  />
                </div>

                {/* Positioning */}
                <div id="positioning" className="px-0 mb-8">
                  <PositioningSection
                    report={report.positioning}
                    ctaHref={ctaHref}
                    isGuest={isGuest}
                  />
                </div>

                {/* Clarity */}
                <div id="clarity" className="px-0 mb-8">
                  <ClaritySection
                    report={report.clarity}
                    ctaHref={ctaHref}
                    isGuest={isGuest}
                  />
                </div>

                {/* AEO */}
                <div id="aeo" className="px-0 mb-8">
                  <AEOSection report={report.aeo} />
                </div>

                {/* Recommendations Section */}
                <div id="recommendations" className="px-0 mb-8">
                  <RecommendationsView
                    report={report as any}
                    productId={productId}
                    isGuest={isGuest}
                    isPaid={isPaid}
                  />
                </div>

                {/* Guest CTA */}
                {isGuest && (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 text-center text-white rounded-lg">
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
                        className="bg-white text-slate-900 hover:bg-white/90 font-bold"
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
