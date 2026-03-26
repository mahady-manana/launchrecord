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
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Layout,
  Loader2,
  MessageSquare,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ClarityReport {
  _id: string;
  url: string;
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  critique: string;
  metrics: {
    headlineClarity: number;
    visualFlow: number;
    valueHierarchy: number;
    benefitClarity: number;
    ctaClarity: number;
    proofPlacement: number;
  };
  findings: string[];
  recommendations: Array<{
    action: string;
    priority: number;
  }>;
  fiveSecondTest: {
    passes: boolean;
    timeToUnderstand: number;
    frictionPoints: string[];
  };
  createdAt: string;
}

export default function ClarityReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const reportId = params.report_id as string;

  const [report, setReport] = useState<ClarityReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/clarity-reports?reportId=${reportId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (error) {
      console.error("Failed to load report:", error);
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

  const getMetricColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Report Not Found
        </h2>
        <p className="text-slate-500 mb-4">
          The requested clarity audit report could not be found.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold">Clarity Audit Report</h1>
              <Badge className={getBandColor(report.band)}>
                {report.band}
              </Badge>
            </div>
            <p className="text-slate-500">
              {formatDate(report.createdAt)} • {report.url}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={report.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit URL
            </Button>
          </Link>
          <Button
            onClick={() => router.push(`/dashboard/${productId}/audit/clarity`)}
            className="bg-green-600 text-white hover:bg-green-700"
            size="sm"
          >
            Run New Audit
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Overall Clarity Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div
              className={`text-6xl font-bold ${getScoreColor(report.score)}`}
            >
              {report.score}
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <Badge className={getBandColor(report.band)}>
                  {report.band}
                </Badge>
              </div>
              <p className="text-slate-600">{report.critique}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {report.fiveSecondTest.passes ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {report.fiveSecondTest.passes
                      ? "Passes 5-Second Test"
                      : "Doesn't Pass 5-Second Test"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Time to understand: ~{report.fiveSecondTest.timeToUnderstand}
                    s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Clarity Metrics</CardTitle>
          <CardDescription>
            Six dimensions that determine instant understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Headline Clarity",
                score: report.metrics.headlineClarity,
                icon: <MessageSquare className="h-4 w-4" />,
              },
              {
                name: "Visual Flow",
                score: report.metrics.visualFlow,
                icon: <Eye className="h-4 w-4" />,
              },
              {
                name: "Value Hierarchy",
                score: report.metrics.valueHierarchy,
                icon: <Layout className="h-4 w-4" />,
              },
              {
                name: "Benefit Clarity",
                score: report.metrics.benefitClarity,
                icon: <Target className="h-4 w-4" />,
              },
              {
                name: "CTA Clarity",
                score: report.metrics.ctaClarity,
                icon: <TrendingUp className="h-4 w-4" />,
              },
              {
                name: "Proof Placement",
                score: report.metrics.proofPlacement,
                icon: <CheckCircle2 className="h-4 w-4" />,
              },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-slate-200 hover:border-green-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-green-600">{metric.icon}</div>
                  <span className="text-sm font-medium text-slate-700">
                    {metric.name}
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold ${getMetricColor(metric.score)}`}
                >
                  {metric.score}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5-Second Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            5-Second Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {report.fiveSecondTest.passes ? (
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              )}
              <div>
                <div className="font-semibold">
                  {report.fiveSecondTest.passes
                    ? "Passes the 5-Second Test"
                    : "Doesn't Pass the 5-Second Test"}
                </div>
                <div className="text-sm text-slate-600">
                  Estimated time to understand: ~{report.fiveSecondTest.timeToUnderstand} seconds
                </div>
              </div>
            </div>

            {report.fiveSecondTest.frictionPoints.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-700">
                  Friction Points Identified:
                </h4>
                <ul className="space-y-2">
                  {report.fiveSecondTest.frictionPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Findings */}
      <Card>
        <CardHeader>
          <CardTitle>Key Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.findings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </div>
                <span className="text-slate-700">{finding}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Recommendations
          </CardTitle>
          <CardDescription>
            Actionable steps to improve clarity (sorted by priority)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.recommendations
              .sort((a, b) => b.priority - a.priority)
              .map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200"
                >
                  <div className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700">{rec.action}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${rec.priority}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Priority: {rec.priority}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
