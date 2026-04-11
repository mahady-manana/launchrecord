"use client";

import { MissingDataBanner } from "@/components/missing-data-banner";
import { ProductDashboardHeader } from "@/components/product-dashboard";
import DashboardSIOReport from "@/components/sio-report/DashboardSIOReport";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscription";
import { SIOV5Report } from "@/services/sio-report/schema";
import { useProductStore } from "@/stores/product-store";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDashboard() {
  const router = useRouter();
  const { selectedProduct } = useProductStore();
  const { subscription, isFree } = useSubscription();

  const [report, setReport] = useState<SIOV5Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchReport = async () => {
      try {
        const response = await fetch(
          `/api/products/${selectedProduct.id}/sio-v5-reports/latest`,
        );
        if (response.ok) {
          const data = await response.json();
          setReport(data.report || null);
        }
      } catch (error) {
        console.error("Error fetching SIO-V5 report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [selectedProduct]);

  const handleRunAudit = () => {
    if (!selectedProduct) return;
    router.push(`/dashboard/${selectedProduct.id}/select-tool`);
  };

  const handleExport = () => {
    // Export feature coming soon
  };

  const handleSettings = () => {
    if (selectedProduct) {
      router.push(`/dashboard/${selectedProduct.id}/settings`);
    }
  };

  if (isLoading || !selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading product dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProductDashboardHeader
        onRunAudit={handleRunAudit}
        onExport={handleExport}
        onSettings={handleSettings}
      />

      {/* Subscription CTA Banner */}
      {isFree && (
        <div className="relative overflow-hidden rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50">
          <div className="absolute top-0 right-0 -mt-4 -mr-4">
            <div className="h-24 w-24 rounded-full bg-orange-500/10 blur-xl" />
          </div>
          <div className="absolute bottom-0 left-1/3 -mb-4">
            <div className="h-20 w-20 rounded-full bg-amber-500/10 blur-xl" />
          </div>
          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Left: Content */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                    Free Plan
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Unlock full audits reports and powerful growth tools
                </h3>
                <p className="text-sm text-slate-600 mb-5 max-w-2xl">
                  Upgrade to get full audits report, weekly auto-audits that
                  catch issues before they hurt conversions
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">
                      Full SIO-V5 audits
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">
                      Weekly auto-audits
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href={`/dashboard/${selectedProduct?.id}/subscription`}
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Upgrade now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Missing Data Warning Banner */}
      <MissingDataBanner />

      {/* Info Banner */}

      {!report ? (
        /* No Report State */
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-orange-100 rounded-full">
                <BarChart3 className="h-12 w-12 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">No Audit Available</CardTitle>
            <CardDescription>
              Run an audit to generate your SIO-V5 report
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleRunAudit} size="lg">
              <RefreshCcw className="h-5 w-5 mr-2" />
              Run First Audit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Audit Date Badge */}

          <DashboardSIOReport {...report} subscription={subscription} />
        </>
      )}
    </div>
  );
}
