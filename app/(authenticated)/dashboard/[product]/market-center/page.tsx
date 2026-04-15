"use client";

import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import { ScanSearchIcon } from "lucide-react";

export default function SIOAuditPage() {
  const { selectedProduct } = useProductStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Market Analysis: Competitions and Difficulties
          </h1>
          <p className="text-slate-500 mt-1">
            Command center for market analysis and competitors spying
          </p>
        </div>
      </div>

      {/* Audit Input Form */}
      <div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-12">
          <div className="flex items-center gap-4">
            <ScanSearchIcon />

            <h3 className="text-lg font-semibold text-slate-700">
              Competitors Analysis and Intelligent Reports
            </h3>
          </div>

          <p className="text-slate-500">
            Enter your startup's URL above to get a comprehensive SIO-V5 audit
            covering positioning, messaging clarity, and AI visibility.
          </p>
          <div className="py-4">
            <Button>Scan my competitors</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
