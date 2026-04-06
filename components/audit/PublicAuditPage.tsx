"use client";

import { AuditForm, AuditLoader, useAudit } from "@/components/audit";
import { SIOV5Report } from "@/services/sio-report/schema";
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSIOReport from "../sio-report/DashboardSIOReport";

export default function PublicAuditPage() {
  const [url, setUrl] = useState("");
  const [cachedWarning, setCachedWarning] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const { status, startAudit, isRunning, isComplete, isFailed } = useAudit({
    isGuest: true,
    onComplete: (report: SIOV5Report) => {
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
      const reportDate = new Date(status.data.analyzedAt);
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

    const stepMessages: Record<string, string> = {
      init: "Failed to initialize audit. Please check the URL and try again.",
      content_fetch:
        "Failed to fetch website content. The site may be unavailable or client-side rendered.",
      content_validation:
        "This website has insufficient content for analysis. We don't support client-side rendered websites yet.",
      summary_generation:
        "Failed to analyze website summary. Please try again.",
      positioning_clarity_generation:
        "Failed to analyze positioning and clarity. Please try again.",
      aeo_generation: "Failed to analyze AEO visibility. Please try again.",
      scoring: "Failed to calculate audit scores. Please try again.",
      refinement: "Failed to finalize audit report. Please try again.",
      polling:
        "Lost connection to audit service. Please refresh and try again.",
    };

    return stepMessages[status.failedAt || ""] || status.error;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
              currentProgress={status.progress}
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
                  <p className="text-sm text-red-700 mb-4">
                    {getErrorMessage()}
                  </p>
                  {status.failedAt && (
                    <p className="text-xs text-red-500 mb-4 font-mono">
                      Failed at: {status.failedAt}
                    </p>
                  )}
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
        {isComplete && status.data && <DashboardSIOReport {...status.data} />}

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
    </div>
  );
}
