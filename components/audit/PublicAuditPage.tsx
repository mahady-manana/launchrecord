"use client";

import {
    AuditForm,
    AuditLoader,
    AuditProgress,
    SIOV2Report,
    useAudit2,
} from "@/components/audit";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import {
    AlertCircle,
    ArrowRight,
    ExternalLink,
    FileText,
    Lock,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSIOReport from "../sio-report/DashboardSIOReport";
import {
    DashboardSIOReportV2,
    SIOV2ReportData,
} from "../sio-report/dashboardV2";

export default function PublicAuditPage() {
  const [url, setUrl] = useState("");
  const [cachedWarning, setCachedWarning] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const setIsGuest = useUserStore((s) => s.setIsGuest);
  const { status, startAudit, isRunning, isComplete, isFailed } = useAudit2({
    isGuest: true,
    onComplete: (report: SIOV2Report) => {
      console.log("Audit complete!", report);
    },
    onError: (error: string) => {
      console.error("Audit error:", error);
    },
  });

  // Handle pre-filled URL from query params
  useEffect(() => {
    const prefillUrl = searchParams.get("url");
    if (prefillUrl && !url && !isRunning && !isComplete && !isFailed) {
      setUrl(prefillUrl);
      startAudit(prefillUrl);
    }
  }, [searchParams, url, isRunning, isComplete, isFailed, startAudit]);

  useEffect(() => {
    setIsGuest(true);
  }, []);

  const handleSubmit = async (normalizedUrl: string) => {
    setUrl(normalizedUrl);
    setCachedWarning(null);
    await startAudit(normalizedUrl);
  };

  const handleRetry = async () => {
    if (url) {
      setCachedWarning(null);
      await startAudit(url);
    }
  };

  // Show cached report warning
  useEffect(() => {
    if (isComplete && status.data) {
      const reportDate = new Date(status.data.createdAt || Date.now());
      const daysAgo = Math.floor(
        (Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysAgo > 0) {
        setCachedWarning(
          `This is a report generated on ${reportDate.toLocaleDateString()}. Please sign up to get the latest report.`,
        );
      }
    }
  }, [isComplete, status.data]);

  // Get user-friendly error message based on failed step
  const getErrorMessage = () => {
    if (!status.error) return "An unknown error occurred";

    // For init errors, show the actual API error message if it's descriptive
    if (status.failedAt === "init" && status.error) {
      // If it's a specific error like client-side rendering, show it directly
      if (
        status.error.includes("client-side") ||
        status.error.includes("insufficient content") ||
        status.error.includes("contentLength")
      ) {
        return status.error;
      }
    }

    const stepMessages: Record<string, string> = {
      init: status.error, // Show the actual error from API
      content_fetch:
        "Failed to fetch website content. The site may be unavailable or client-side rendered.",
      content_validation:
        "This website has insufficient content for analysis. We don't support client-side rendered websites yet.",
      v2_summary_and_issues:
        "Failed to analyze summary and first impressions. Please try again.",
      v2_scoring_and_fixes:
        "Failed to analyze positioning and messaging. Please try again.",
      v2_aeo_analysis: "Failed to analyze AEO visibility. Please try again.",
      v2_validation_improvement:
        "Failed to validate and finalize the report. Please try again.",
      polling:
        "Lost connection to audit service. Please refresh and try again.",
    };

    return stepMessages[status.failedAt || ""] || status.error;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-5xl mx-auto mt-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Run Your Free Audit
        </h2>
        <AuditForm
          onSubmit={handleSubmit}
          isLoading={isRunning}
          error={null}
          defaultUrl={url}
          buttonText="Get Free Audit"
          loadingText="Running audit (3-4 min)..."
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Loading State */}
        {isRunning && status.reportId && (
          <div className="max-w-5xl mx-auto">
            <AuditLoader
              currentProgress={status.progress as AuditProgress}
              url={url}
              className="max-w-none"
            />
          </div>
        )}

        {/* Error State */}
        {isFailed && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-red-800 mb-2">
                    Audit Failed
                  </h3>
                  <p className="text-sm text-red-700 mb-4 whitespace-pre-line">
                    {getErrorMessage()}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cached Report Warning */}
        {cachedWarning && (
          <div className="max-w-5xl mx-auto border border-amber-200 bg-amber-50 text-amber-800 rounded-lg p-4">
            <p className="text-sm">{cachedWarning}</p>
          </div>
        )}

        {/* Hero Section - Only show when no report */}
        {!isComplete && !isRunning && !isFailed && (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Is Your Startup&apos;s Messaging Clear?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Get a free, comprehensive audit of your startup&apos;s
              positioning, messaging clarity, and AI visibility. Enter your
              website URL below to get started.
            </p>
          </div>
        )}

        {/* Report Display */}
        {isComplete && status.data && (
          <div className={isComplete ? "pb-20" : ""}>
            {(status.data as any).version === 2 ? (
              <DashboardSIOReportV2
                report={status.data as SIOV2ReportData}
                isGuest
              />
            ) : (
              <DashboardSIOReport report={status.data as any} isGuest />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 pt-8 pb-12">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500">
              This is a free audit tool. Sign up to save your reports and access
              detailed recommendations.
            </p>
            <p className="text-xs text-slate-400">
              Your report is saved automatically. Create an account to access it
              anytime.
            </p>
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA - Only show when report is complete */}
      {isComplete && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
          <div className="flex flex-col bg-primary border border-slate-200 rounded-2xl shadow-xl px-6 py-4 max-w-xl w-full">
            {/* Top row: title + CTA */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Lock className="h-5 w-5 text-orange-100 flex-shrink-0" />
                <p className="text-sm font-semibold text-slate-100 truncate">
                  Sign up to unlock full analysis et recommendations
                </p>
              </div>
              <Link
                href={`/register?productUrl=${encodeURIComponent(status.data?.url || "")}`}
                className="flex-shrink-0"
              >
                <Button
                  size="sm"
                  className="bg-secondary hover:bg-orange-600 text-white rounded-full"
                >
                  Get full report
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {/* Benefits row */}
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-1.5 text-xs">
                <FileText className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-slate-700 font-medium">
                  Full detailed audit report
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-1.5 text-xs">
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-slate-700 font-medium">
                  Free listing in our startup directory
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
