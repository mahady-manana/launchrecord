"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { SubscriptionRecord } from "@/types/subscription";
import { ArrowRight, FileText, Lightbulb, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useSubscription } from "@/hooks/use-subscription";
import { useProductStore } from "@/stores/product-store";
import {
  CategoryInsightsSection,
  FirstImpressionTeaser,
  IssuesPreview,
  IssuesSection,
  MetricsSection,
  OverallScoreCardV2,
  ScoringOverview,
  StrengthsSection,
  WebsiteSummarySectionV2,
} from "./components";

// Re-exports for external consumers
export type { SubscriptionTier } from "@/hooks/use-subscription";

type ReportView = "full" | "issues" | "strengths" | "scoring";

/**
 * Plain data type for the dashboard SIO v2 report.
 */
export interface SIOV2ReportData {
  reportId: string;
  version: 2;
  url: string;
  overallScore: number;
  statement: string;
  firstImpressions?: {
    isPositioningClear: boolean;
    isMessagingClear: boolean;
    isUserLeftGuessing: boolean;
    ten_second_test: boolean;
    statement: string;
  };
  reportBand: "Dominant" | "Strong" | "Average" | "Weak" | "Ghost";
  websiteSummary: {
    overview: string;
    problems: string[];
    outcomes: string[];
    solutions: string[];
  };
  issues: Array<{
    id: string;
    category: "positioning" | "clarity" | "first_impression" | "aeo";
    metricKey?: string;
    severity: "critical" | "high" | "medium" | "low";
    statement: string;
    explanation?: string;
    current?: string;
    recommendations: string[];
    fixes: string[];
    isVisibleInFree?: boolean;
    isFixLocked?: boolean;
    impactScore?: number;
  }>;
  strengths: Array<{
    statement: string;
    impact: string;
  }>;
  scoring: {
    overall: number;
    positioning: number;
    clarity: number;
    first_impression: number;
    aeo: number;
  };
  categoryInsights: {
    positioning: { statement: string; summary: string };
    clarity: { statement: string; summary: string };
    first_impression: { statement: string; summary: string };
    aeo: { statement: string; summary: string };
  };
  metrics?: Record<
    string,
    {
      check: boolean;
      statement: string;
    }
  >;
  progress:
    | "idle"
    | "content_fetched"
    | "summary_complete"
    | "positioning_clarity_complete"
    | "aeo_complete"
    | "complete"
    | "failed"
    | "issues_generated"
    | "scoring_complete";
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardSIOReportV2Props {
  report: SIOV2ReportData;
  isGuest?: boolean;
  subscription?: SubscriptionRecord | null;
}

export default function DashboardSIOReportV2({
  report,
  isGuest: propsIsGuest,
  subscription = null,
}: DashboardSIOReportV2Props) {
  const [view, setView] = useState<ReportView>("full");
  const [activeSection, setActiveSection] = useState("overview");
  const { isFree, isPaid } = useSubscription();
  // const isFree = false;
  // const isPaid = true;
  const isGuestFromStore = useUserStore((s: any) => s.isGuest);
  const selectedProduct = useProductStore((s) => s.selectedProduct);
  // Allow prop override or use store
  const isGuest = propsIsGuest !== undefined ? propsIsGuest : isGuestFromStore;

  const reportUrl = report.url || "";
  const reportId = report.reportId || "unknown";

  const isLocked = (isGuest || isFree) && activeSection !== "overview";

  // Navigation sections for v2
  const navigation = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "website-summary", label: "Website Summary", icon: "🌐" },
    { id: "metrics", label: "Audit Metrics", icon: "✅" },
    { id: "issues", label: "Issues & Recommendations", icon: "⚠️" },
    { id: "scoring", label: "Scoring Breakdown", icon: "📈" },
    { id: "strengths", label: "Strengths", icon: "💪" },
    { id: "insights", label: "Category Insights", icon: "💡" },
  ];

  const criticalIssuesCount =
    report.issues?.filter((i) => i.severity === "critical").length || 0;
  const highIssuesCount =
    report.issues?.filter((i) => i.severity === "high").length || 0;
  const mediumIssuesCount =
    report.issues?.filter((i) => i.severity === "medium").length || 0;
  const lowIssuesCount =
    report.issues?.filter((i) => i.severity === "low").length || 0;

  const ctaHref = isGuest
    ? `/register?productUrl=${encodeURIComponent(reportUrl)}`
    : `/dashboard/${selectedProduct?._id}/subscription`;

  // Internal Paywall Component
  const PaywallSection = ({
    title,
    context,
  }: {
    title: string;
    context: string;
  }) => {
    const issueParts = [];
    if (criticalIssuesCount > 0) {
      issueParts.push(
        <span key="crit" className="text-red-600 font-bold underline">
          {criticalIssuesCount} critical issues
        </span>,
      );
    }
    if (highIssuesCount > 0) {
      if (issueParts.length > 0) issueParts.push(<span key="sep1">, </span>);
      issueParts.push(
        <span key="high" className="text-orange-600 font-bold">
          {highIssuesCount} high friction issues
        </span>,
      );
    }
    if (mediumIssuesCount > 0) {
      if (issueParts.length > 0) issueParts.push(<span key="sep2">, </span>);
      issueParts.push(
        <span key="med" className="text-amber-600 font-bold">
          {mediumIssuesCount} medium issues
        </span>,
      );
    }
    if (lowIssuesCount > 0) {
      if (issueParts.length > 0) issueParts.push(<span key="sep2"> and </span>);
      issueParts.push(
        <span key="low" className="text-blue-600 font-bold">
          {lowIssuesCount} recommendations
        </span>,
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-400 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white p-5 rounded-2xl shadow-xl border border-slate-100">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-4 animate-bounce">
          Action Required
        </div>

        <h3 className="text-xl font-bold text-red-700 mb-4 tracking-tight leading-[1.1]">
          {criticalIssuesCount > 0
            ? `We found ${criticalIssuesCount + highIssuesCount} high friction issues in your positioning and messaging clarity`
            : `See your full ${title} analysis`}
        </h3>

        <p className="text-slate-600 max-w-lg text-lg leading-relaxed">
          Our analysis detected {issueParts} on your website. This is costing
          you on conversions.
        </p>

        <p className="font-bold text-slate-900 underline block my-4">
          Get full access to fix these issues and improve your website
        </p>

        <div className="w-full max-w-md grid grid-cols-1 gap-3 mb-10 text-left">
          {[
            "Detailed analysis of each issue",
            "Step-by-step implementation roadmap",
            "Copy-paste ready solutions",
            "AI-Search Visibility (AEO) expansion strategy",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 text-green-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">{item}</span>
            </div>
          ))}
        </div>

        <Button
          asChild
          size="lg"
          className="h-16 px-10 text-lg font-bold bg-slate-900 hover:bg-black text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none"
        >
          <Link href={ctaHref}>
            {isGuest ? "Sign Up to Stop Bounces" : "Upgrade to Stop Bounces"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>

        <p className="mt-6 text-slate-400 text-sm font-medium">
          ⚡️ Takes 30 seconds. Unlock instant access.
        </p>
      </div>
    );
  };

  const getSectionContent = (sectionId: string) => {
    // If locked and not overview, show paywall
    if (isLocked) {
      const sectionLabels: Record<string, string> = {
        "website-summary": "Website Summary",
        metrics: "Audit Metrics",
        scoring: "Scoring Breakdown",
        issues: "Issues & Recommendations",
        strengths: "Strengths to keep",
        insights: "Category Insights",
      };

      const sectionContext: Record<string, string> = {
        "website-summary": "Structure",
        metrics: "Checklist",
        scoring: "Scores",
        issues: "Strategy",
        strengths: "Defensibility",
        insights: "Positioning",
      };

      const currentLabel = sectionLabels[sectionId] || "This section";
      const context = sectionContext[sectionId] || "Website";

      return <PaywallSection title={currentLabel} context={context} />;
    }

    switch (sectionId) {
      case "overview":
        return (
          <div className="space-y-6">
            <OverallScoreCardV2
              score={report.overallScore}
              band={report.reportBand}
              statement={report.statement}
            />

            <FirstImpressionTeaser firstImpressions={report.firstImpressions} />

            <ScoringOverview scoring={report.scoring} />

            <CategoryInsightsSection insights={report.categoryInsights} />

            <IssuesPreview
              issues={report.issues}
              onViewAll={() => setActiveSection("issues")}
            />
            <PaywallSection title="" context="" />
          </div>
        );

      case "website-summary":
        return <WebsiteSummarySectionV2 summary={report.websiteSummary} />;

      case "metrics":
        return <MetricsSection metrics={report.metrics} />;

      case "scoring":
        return <ScoringOverview scoring={report.scoring} detailed />;

      case "issues":
        return <IssuesSection issues={report.issues} isFree={isFree} />;

      case "strengths":
        return <StrengthsSection strengths={report.strengths} />;

      case "insights":
        return <CategoryInsightsSection insights={report.categoryInsights} />;

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Section not found</p>
          </div>
        );
    }
  };

  const renderViewSwitcher = () => (
    <div className="flex gap-2 mb-6">
      <Button
        variant={view === "full" ? "default" : "outline"}
        size="sm"
        onClick={() => setView("full")}
      >
        <FileText className="w-4 h-4 mr-2" />
        Full Report
      </Button>
      <Button
        variant={view === "issues" ? "default" : "outline"}
        size="sm"
        onClick={() => {
          setView("issues");
          if (!isLocked) setActiveSection("issues");
        }}
      >
        <Lightbulb className="w-4 h-4 mr-2" />
        Issues Only
      </Button>
      <Button
        variant={view === "strengths" ? "default" : "outline"}
        size="sm"
        onClick={() => {
          setView("strengths");
          if (!isLocked) setActiveSection("strengths");
        }}
      >
        💪 Strengths Only
      </Button>
      <Button
        variant={view === "scoring" ? "default" : "outline"}
        size="sm"
        onClick={() => {
          setView("scoring");
          if (!isLocked) setActiveSection("scoring");
        }}
      >
        📈 Scoring Only
      </Button>
    </div>
  );

  const renderContent = () => {
    // If not full view, the view switcher handles the section
    if (view === "issues") {
      return isLocked ? (
        <PaywallSection title="Issues & Recommendations" context="Strategy" />
      ) : (
        <IssuesSection issues={report.issues} isFree={isFree} />
      );
    }

    if (view === "strengths") {
      return isLocked ? (
        <PaywallSection title="Strengths" context="Defensibility" />
      ) : (
        <StrengthsSection strengths={report.strengths} />
      );
    }

    if (view === "scoring") {
      return isLocked ? (
        <PaywallSection title="Scoring Breakdown" context="Scores" />
      ) : (
        <ScoringOverview scoring={report.scoring} detailed />
      );
    }

    // Full view with navigation
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4 sticky top-4">
            <h3 className="font-semibold mb-4">Report Sections</h3>
            <nav className="space-y-2">
              {navigation.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.label}
                  {!isPaid && section.id !== "overview" ? (
                    <Lock className="w-3 h-3 ml-2 text-gray-400 inline" />
                  ) : null}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border p-6">
            {getSectionContent(activeSection)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              SIO Audit Report V2
            </h1>
            <p className="text-gray-600 mt-1">Analysis for: {report.url}</p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.progress === "complete"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {report.progress === "complete" ? "Complete" : "In Progress"}
            </span>
          </div>
        </div>

        {renderViewSwitcher()}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Footer CTA */}
    </div>
  );
}
