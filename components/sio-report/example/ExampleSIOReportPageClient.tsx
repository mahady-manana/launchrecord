"use client";

import { useState } from "react";
import { AEOCard } from "./AEOCard";
import { ClarityCard } from "./ClarityCard";
import { FirstImpressionCard } from "./FirstImpressionCard";
import { mockReport, mockStartup } from "./mock-data";
import { OverallScoreCard } from "./OverallScoreCard";
import { PositioningCard } from "./PositioningCard";
import { WebsiteSummaryCard } from "./WebsiteSummaryCard";

export default function ExampleSIOReportPageClient() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<typeof mockReport | null>(null);

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

  const displayReport = report || mockReport;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                SIO-V5 Report Example
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Research preview • {mockStartup.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-700">
                {mockStartup.name}
              </div>
              <div className="text-xs text-slate-500">{mockStartup.url}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Audit Input Form */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Run Your Own SIO-V5 Audit
          </h2>
          <form onSubmit={handleAudit} className="flex gap-3">
            <input
              type="url"
              placeholder="https://your-startup.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-400 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Auditing..." : "Audit My Startup"}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Report Content */}
        {displayReport && (
          <>
            <OverallScoreCard report={displayReport} />
            <WebsiteSummaryCard summary={displayReport.websiteSummary} />
            <FirstImpressionCard report={displayReport.firstImpression} />
            <PositioningCard report={displayReport.positioning} />
            <ClarityCard report={displayReport.clarity} />
            <AEOCard report={displayReport.aeo} />
          </>
        )}

        <div className="border-t border-slate-200 pt-6 pb-12">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500">
              This is a research preview demonstrating the SIO-V5 report schema.
            </p>
            <p className="text-xs text-slate-400">
              Data shown is for {mockStartup.name} - a fictional startup used
              for demonstration purposes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
