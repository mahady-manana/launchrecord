"use client";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { SubscriptionRecord } from "@/types/subscription";
import { ArrowRight, FileText, Lightbulb, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useUserStore } from "@/stores/user-store";
import {
  CategoryInsightsSection,
  IssuesSection,
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
  reportBand: "Dominant" | "Strong" | "Average" | "Weak" | "Ghost";
  websiteSummaryV2: {
    overview: string;
    problems: string[];
    solutions: string[];
  };
  issues: Array<{
    id: string;
    category: "positioning" | "clarity" | "first_impression" | "aeo";
    metricKey?: string;
    severity: "critical" | "medium" | "low";
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
  progress:
    | "idle"
    | "content_fetched"
    | "issues_generated"
    | "scoring_complete"
    | "complete"
    | "failed";
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
  subscription = null,
}: DashboardSIOReportV2Props) {
  const [view, setView] = useState<ReportView>("full");
  const [activeSection, setActiveSection] = useState("overview");
  const { isFree, isPaid } = useSubscription();
  const isGuest = useUserStore((s) => s.isGuest);
  const reportUrl = report.url || "";
  const reportId = report.reportId || "unknown";

  const ctaHref = isFree
    ? `/dashboard/${reportId}/subscription`
    : `/register?productUrl=${encodeURIComponent(reportUrl)}`;

  // Navigation sections for v2
  const navigation = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "website-summary", label: "Website Summary", icon: "🌐" },
    { id: "scoring", label: "Scoring Breakdown", icon: "📈" },
    { id: "issues", label: "Issues & Recommendations", icon: "⚠️" },
    { id: "strengths", label: "Strengths", icon: "💪" },
    { id: "insights", label: "Category Insights", icon: "💡" },
  ];

  const getSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "overview":
        return (
          <div className="space-y-6">
            <OverallScoreCardV2
              score={report.overallScore}
              band={report.reportBand}
              statement={report.statement}
            />
            <ScoringOverview scoring={report.scoring} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">First Impression</h3>
                <p className="text-gray-700">
                  {report.categoryInsights.first_impression.statement}
                </p>
              </div>
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Report Summary</h3>
                <p className="text-gray-700">{report.statement}</p>
              </div>
            </div>
          </div>
        );

      case "website-summary":
        return <WebsiteSummarySectionV2 summary={report.websiteSummaryV2} />;

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
        onClick={() => setView("issues")}
      >
        <Lightbulb className="w-4 h-4 mr-2" />
        Issues Only
      </Button>
      <Button
        variant={view === "strengths" ? "default" : "outline"}
        size="sm"
        onClick={() => setView("strengths")}
      >
        💪 Strengths Only
      </Button>
      <Button
        variant={view === "scoring" ? "default" : "outline"}
        size="sm"
        onClick={() => setView("scoring")}
      >
        📈 Scoring Only
      </Button>
    </div>
  );

  const renderContent = () => {
    if (view === "issues") {
      return <IssuesSection issues={report.issues} isFree={isFree} />;
    }

    if (view === "strengths") {
      return <StrengthsSection strengths={report.strengths} />;
    }

    if (view === "scoring") {
      return <ScoringOverview scoring={report.scoring} detailed />;
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
      {isFree && (
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Unlock Full Report & Recommendations
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get detailed fixes, implementation guides, and priority
            recommendations to improve your website's conversion potential.
          </p>
          <Button asChild size="lg">
            <Link href={ctaHref}>
              Upgrade to Unlock <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
