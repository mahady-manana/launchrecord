"use client";

import { OverallScoreCard, FirstImpressionCard } from "@/components/sio-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ISanitizedSIOReport } from "@/services/sio-report/sanitizer";
import { Loader2, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PublicAuditPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ISanitizedSIOReport | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sio-v5-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate audit report");
      }

      setReport(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to generate audit report");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Free SIO-V5 Startup Audit
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Get instant feedback on your startup's positioning and clarity
              </p>
            </div>
            <Link href="/register">
              <Button variant="outline">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
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
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Run Your Free Audit
          </h2>
          <form onSubmit={handleAudit} className="flex gap-3">
            <Input
              type="url"
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

        {/* Report Results */}
        {report && (
          <div className="space-y-6">
            {/* Full Report Sections */}
            <OverallScoreCard report={report} />

            {/* First Impression - Teaser */}
            <div className="relative">
              <FirstImpressionCard report={report.firstImpression} isGuest />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center">
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-lg">
                  <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Unlock Full Report
                  </h3>
                  <p className="text-slate-600 mb-4 max-w-md">
                    Sign up for free to see detailed analysis of your headline,
                    subheadline, CTA, positioning sub-metrics, and clarity
                    recommendations.
                  </p>
                  <Link href={`/register?redirect=/audit?url=${encodeURIComponent(url)}`}>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Sign Up to See Full Report
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Positioning - Teaser */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Positioning Analysis
                  </h2>
                  <div className="text-sm text-slate-500">
                    Score: {report.positioning.score}/100
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                {report.positioning.statement}
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-4">
                  Detailed positioning analysis across 6 dimensions (Category
                  Ownership, UVP, Competitive Differentiation, etc.)
                </p>
                <Link href={`/register?redirect=/audit?url=${encodeURIComponent(url)}`}>
                  <Button variant="outline">Sign Up to See Details</Button>
                </Link>
              </div>
            </div>

            {/* Clarity - Teaser */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Clarity Analysis
                  </h2>
                  <div className="text-sm text-slate-500">
                    Score: {report.clarity.score}/100
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                {report.clarity.statement}
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <Lock className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-4">
                  Detailed clarity analysis with unclear sentence detection and
                  6 dimension breakdown
                </p>
                <Link href={`/register?redirect=/audit?url=${encodeURIComponent(url)}`}>
                  <Button variant="outline">Sign Up to See Details</Button>
                </Link>
              </div>
            </div>

            {/* AEO - Full data shown (free tier) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    AI Visibility (AEO)
                  </h2>
                  <div className="text-sm text-slate-500">
                    Score: {report.aeo.score}/100
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                {report.aeo.statement}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${report.aeo.aiPresence.isPresent ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm text-slate-600">
                    {report.aeo.aiPresence.isPresent
                      ? "Present in AI engines"
                      : "Not found in AI engines"}
                  </span>
                </div>
                {report.aeo.aiPresence.engines.length > 0 && (
                  <div className="text-sm text-slate-600">
                    Found in: {report.aeo.aiPresence.engines.join(", ")}
                  </div>
                )}
                <div className="mt-4">
                  <div className="text-sm font-semibold text-slate-700 mb-2">
                    Recommendations:
                  </div>
                  <ul className="space-y-1">
                    {report.aeo.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-slate-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA to Sign Up */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Fix Your Startup's Messaging?
              </h2>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Sign up now to unlock the full report with detailed analysis,
                specific recommendations, and copy-paste ready rewrites for
                every section.
              </p>
              <Link href={`/register?redirect=/audit?url=${encodeURIComponent(url)}`}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-bold text-orange-600"
                >
                  Create Free Account to See Full Report
                </Button>
              </Link>
            </div>
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
    </div>
  );
}
