"use client";

import { FirstImpressionCard, OverallScoreCard } from "@/components/sio-report";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/use-products";
import { SIOV5Report } from "@/services/sio-report/schema";
import { useProductStore } from "@/stores/product-store";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

export default function SIOAuditPage() {
  const { selectedProduct } = useProductStore();
  const { fetchProducts } = useProducts();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SIOV5Report | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !selectedProduct) return;

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

      // TODO: Save report to database
      // await fetch(`/api/products/${selectedProduct.id}/sio-reports`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data.data),
      // });
    } catch (err: any) {
      setError(err.message || "Failed to generate audit report");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Please select a product first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">SIO-V5 Audit</h1>
          <p className="text-slate-500 mt-1">
            Comprehensive startup positioning, clarity, and AI visibility audit
          </p>
        </div>
      </div>

      {/* Audit Input Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Run SIO-V5 Audit
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
          <Button type="submit" disabled={isLoading} className="min-w-[200px]">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Run Full Audit
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
          <OverallScoreCard report={report} />
          <FirstImpressionCard report={report.firstImpression} />

          {/* TODO: Add remaining report sections */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
            <p className="text-slate-600">
              Additional report sections (Positioning, Clarity, AEO) coming
              soon...
            </p>
          </div>
        </div>
      )}

      {!report && !isLoading && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
          <Sparkles className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            Ready to Audit Your Startup?
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Enter your startup's URL above to get a comprehensive SIO-V5 audit
            covering positioning, messaging clarity, and AI visibility.
          </p>
        </div>
      )}
    </div>
  );
}
