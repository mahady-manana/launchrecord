"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, BarChart3, Clock, Eye, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ClarityReport {
  _id: string;
  url: string;
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  fiveSecondTest: {
    passes: boolean;
    timeToUnderstand: number;
  };
  createdAt: string;
}

export default function ClarityReportsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;

  const [reports, setReports] = useState<ClarityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadReports();
  }, [productId, page]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/clarity-reports?productId=${productId}&page=${page}&limit=20`,
      );
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 50) return "text-yellow-600";
    if (score >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getBandColor = (band: string) => {
    const colors: Record<string, string> = {
      instant: "bg-green-100 text-green-700 border-green-200",
      clear: "bg-lime-100 text-lime-700 border-lime-200",
      average: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confusing: "bg-orange-100 text-orange-700 border-orange-200",
      opaque: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[band] || colors.average;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Clarity Audit Reports</h1>
          <p className="text-slate-500">
            View all your product clarity audit results
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Reports</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-3xl">
              {reports.length > 0
                ? Math.round(
                    reports.reduce((sum, r) => sum + r.score, 0) /
                      reports.length,
                  )
                : 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pass Rate (5-Second Test)</CardDescription>
            <CardTitle className="text-3xl">
              {reports.length > 0
                ? Math.round(
                    (reports.filter((r) => r.fiveSecondTest.passes).length /
                      reports.length) *
                      100,
                  )
                : 0}
              %
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            All Reports
          </CardTitle>
          <CardDescription>
            {total} clarity audit{total !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Reports Yet
              </h3>
              <p className="text-slate-500 mb-4">
                Run your first clarity audit to see results here
              </p>
              <Button
                onClick={() =>
                  router.push(`/dashboard/${productId}/audit/clarity`)
                }
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Run Clarity Audit
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/${productId}/audit/clarity/reports/${report._id}`,
                    )
                  }
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(report.score)}`}
                    >
                      {report.score}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getBandColor(report.band)}>
                          {report.band}
                        </Badge>
                        {report.fiveSecondTest.passes && (
                          <Badge
                            variant="outline"
                            className="text-green-700 border-green-300 bg-green-50"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Passes 5s Test
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">{report.url}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDate(report.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(Math.ceil(total / 20), p + 1))
            }
            disabled={page >= Math.ceil(total / 20)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
