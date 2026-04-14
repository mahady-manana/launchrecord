"use client";

import DashboardSIOReport from "@/components/sio-report/DashboardSIOReport";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { SIOV5Report } from "@/services/sio-report/schema";
import { useProductStore } from "@/stores/product-store";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardSIOReportClientProps {
  params: { product: string; report: string };
}

export default function DashboardSIOReportClient({
  params,
}: DashboardSIOReportClientProps) {
  const { selectedProduct } = useProductStore();
  const { subscription } = useSubscription();
  const router = useRouter();
  const [report, setReport] = useState<SIOV5Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedProduct || !params.report) return;

    const fetchReport = async () => {
      try {
        const response = await fetch(
          `/api/products/${selectedProduct.id}/sio-v5-reports/${params.report}`,
        );
        if (response.ok) {
          const data = await response.json();
          setReport(data.report || null);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [selectedProduct, params.report]);

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">No product selected</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-600" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-12">
          <p className="text-slate-500">Report not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push(`/dashboard/${selectedProduct.id}/reports`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reports
      </Button>

      {/* Report */}
      <DashboardSIOReport report={report as any} subscription={subscription} />
    </div>
  );
}
