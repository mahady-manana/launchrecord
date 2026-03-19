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
import type { AEOAuditResult } from "@/services/aeo-audit/types";
import { useProductStore } from "@/stores/product-store";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Bot,
  CheckCircle,
  Download,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AEOReportsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const { selectedProduct } = useProductStore();

  const [report, setReport] = useState<AEOAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load report from sessionStorage
    const storedResult = sessionStorage.getItem("aeoAuditResult");
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        // Verify it's for this product
        console.log("====================================");
        console.log(parsed, productId, productId);
        console.log("====================================");
        if (parsed.productId === productId) {
          setReport(parsed);
        }
      } catch (error) {
        console.error("Failed to parse audit result:", error);
      }
    }

    setIsLoading(false);
  }, [productId, selectedProduct?.website]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    if (score >= 30) return "text-orange-600";
    return "text-red-600";
  };

  const getBandColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading AEO report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">AEO Audit Report</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-cyan-100 rounded-full">
                <Bot className="h-12 w-12 text-cyan-600" />
              </div>
            </div>
            <CardTitle>No Report Available</CardTitle>
            <CardDescription>
              Run an AEO audit to generate your AI visibility report
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button
              onClick={() => router.push(`/dashboard/${productId}/audit/aeo`)}
            >
              Run AEO Audit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passedChecks = report.checks.filter((c) => c.passed).length;
  const failedChecks = report.checks.filter((c) => !c.passed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">AEO Audit Report</h1>
              <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
                <Bot className="h-3 w-3 mr-1" />
                AI Visibility
              </Badge>
            </div>
            <p className="text-slate-500">
              {report.url} • {new Date(report.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/${productId}/audit/aeo`)}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Run New Audit
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-600" />
              AEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div
                className={`text-6xl font-bold ${getScoreColor(report.score)} mb-2`}
              >
                {report.score}
              </div>
              <div className="text-sm text-slate-500 mb-4">
                out of {report.maxScore}
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getBandColor(report.score)}`}
                  style={{ width: `${report.score}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Audit Summary</CardTitle>
            <CardDescription>Overview of AEO checks performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {report.checks.length}
                </div>
                <div className="text-sm text-slate-500">Total Checks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {passedChecks}
                </div>
                <div className="text-sm text-slate-500">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {failedChecks}
                </div>
                <div className="text-sm text-slate-500">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Passed Checks */}
      {passedChecks > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Passed Checks ({passedChecks})
            </CardTitle>
            <CardDescription className="text-green-700">
              AEO optimizations you're doing well
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.checks
                .filter((c) => c.passed)
                .map((check, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-lg bg-white border border-green-200"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {check.name}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {check.description}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {check.score}/{check.maxScore} pts
                    </Badge>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Failed Checks with Recommendations */}
      {failedChecks > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Needs Improvement ({failedChecks})
            </CardTitle>
            <CardDescription className="text-orange-700">
              Actionable recommendations to improve your AEO score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {report.checks
                .filter((c) => !c.passed)
                .map((check) => (
                  <div
                    key={check.id}
                    className="p-4 rounded-lg bg-white border border-orange-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {check.name}
                        </h4>
                        <p className="text-sm text-slate-600 mb-2">
                          {check.description}
                        </p>
                        {check.evidence && check.evidence.length > 0 && (
                          <div className="text-xs text-slate-500 mb-2">
                            <strong>Evidence:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {check.evidence.map((ev, idx) => (
                                <li key={idx}>{ev}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                        {check.score}/{check.maxScore} pts
                      </Badge>
                    </div>
                    {check.recommendations &&
                      check.recommendations.length > 0 && (
                        <div className="ml-8 space-y-2">
                          <p className="text-sm font-medium text-orange-900">
                            Recommendations:
                          </p>
                          <ul className="text-sm text-orange-800 space-y-1">
                            {check.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-orange-600">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* All Checks Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
          <CardDescription>
            All {report.checks.length} AEO checks performed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {report.checks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {check.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm">
                      {check.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {check.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      <span
                        className={
                          check.passed ? "text-green-600" : "text-orange-600"
                        }
                      >
                        {check.score}
                      </span>
                      <span className="text-slate-400">
                        /{check.maxScore} pts
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={check.passed ? "default" : "secondary"}
                    className={
                      check.passed
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-orange-100 text-orange-700 border-orange-200"
                    }
                  >
                    {check.passed ? "Pass" : "Fail"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-900 mb-1">
                  Improve Your Score
                </h4>
                <p className="text-sm text-orange-700">
                  Address the failed checks above to improve your AEO score.
                  Focus on high-impact items first (higher point values).
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/aeo-audit">
                <Button className="w-full" variant="outline">
                  <Bot className="h-4 w-4 mr-2" />
                  Public AEO Page
                </Button>
              </Link>
              <Link href="/sio-v5-engine">
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Learn About SIO-V5
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Link(props: React.ComponentProps<"a">) {
  return <a {...props} />;
}
