"use client";

import { Button } from "@/components/ui/button";
import { mockReport } from "@/research/example-sio-report";
import { ISanitizedSIOReport } from "@/services/sio-report/sanitizer";
import { Loader2, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DashboardSIOReport from "../sio-report/DashboardSIOReport";
import { Input } from "../ui/input";

export default function PublicAuditPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ISanitizedSIOReport | null>(mockReport);
  const [cachedWarning, setCachedWarning] = useState<string | null>(null);
  const pathname = usePathname() || "/audit";
  const redirectTarget = `${pathname}?url=${encodeURIComponent(url)}`;
  const signupHref = `/register?callbackUrl=${encodeURIComponent(redirectTarget)}`;

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

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setCachedWarning(null);

    try {
      const response = await fetch("/api/sio-v5-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, isGuest: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate audit report");
      }

      setReport(data.data);
      if (data?.warning) {
        setCachedWarning(data.warning);
      } else if (data?.metadata?.cached && data?.metadata?.reportGeneratedAt) {
        const formattedDate = new Date(
          data.metadata.reportGeneratedAt,
        ).toLocaleDateString();
        setCachedWarning(
          `This is a report generated on ${formattedDate}. Please sign up to get the latest report.`,
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate audit report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-5xl mx-auto mt-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Run Your Free Audit
        </h2>
        <form onSubmit={handleAudit} className="flex gap-3">
          <Input
            // type="url"
            placeholder="https://your-startup.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[200px] bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get Free Audit
              </>
            )}
          </Button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {cachedWarning && (
          <div className="max-w-5xl mx-auto border border-amber-200 bg-amber-50 text-amber-800 rounded-lg p-4">
            <p className="text-sm">{cachedWarning}</p>
          </div>
        )}
        {/* Hero Section */}
        {!report && (
          <div className="text-center py-12">
            <Sparkles className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Is Your Startup's Messaging Clear?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Get a free, comprehensive audit of your startup's positioning,
              messaging clarity, and AI visibility. Enter your website URL below
              to get started.
            </p>
          </div>
        )}

        {/* Audit Input Form */}

        {report ? <DashboardSIOReport {...report!} isGuest /> : null}

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
