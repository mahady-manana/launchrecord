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
import { SIOV5Report } from "@/services/sio-report/schema";
import { useProductStore } from "@/stores/product-store";
import { BarChart3, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDashboard() {
  const router = useRouter();
  const { selectedProduct } = useProductStore();

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

          <DashboardSIOReport {...report} />
        </>
      )}
    </div>
  );
}
