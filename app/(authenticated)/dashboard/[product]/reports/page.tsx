"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIOV5Report } from "@/services/sio-report/schema";
import { useProductStore } from "@/stores/product-store";
import { BarChart3, Calendar, ChevronRight, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const { selectedProduct } = useProductStore();
  const router = useRouter();
  const [reports, setReports] = useState<SIOV5Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchReports = async () => {
      try {
        const response = await fetch(
          `/api/products/${selectedProduct.id}/sio-v5-reports`,
        );
        if (response.ok) {
          const data = await response.json();
          setReports(data.reports || []);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [selectedProduct]);

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
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage all your audit reports
        </p>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-orange-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                No reports yet
              </h3>
              <p className="text-slate-500 mt-1">
                Run your first audit to generate a report
              </p>
            </div>
            <Button
              onClick={() =>
                router.push(`/dashboard/${selectedProduct.id}/select-tool`)
              }
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <FileText className="h-4 w-4 mr-2" />
              Run Audit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <Card
              key={report._id || index}
              className="hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/10 transition-all duration-200 cursor-pointer"
              onClick={() =>
                router.push(
                  `/dashboard/${selectedProduct.id}/reports/${report._id}`,
                )
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 flex-shrink-0">
                      <FileText className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        SIO-V5 Audit Report
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {report.overallScore && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {report.overallScore}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase">
                          Score
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/dashboard/${selectedProduct.id}/reports/${report._id}`,
                        );
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Overall Audit</Badge>
                  {report.positioning?.score && (
                    <Badge variant="outline">
                      Positioning: {report.positioning.score}
                    </Badge>
                  )}
                  {report.clarity?.score && (
                    <Badge variant="outline">
                      Clarity: {report.clarity.score}
                    </Badge>
                  )}
                  {report.aeo?.score && (
                    <Badge variant="outline">AEO: {report.aeo.score}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
