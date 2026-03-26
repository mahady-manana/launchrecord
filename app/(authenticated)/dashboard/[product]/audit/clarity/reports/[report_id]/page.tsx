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
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Lightbulb,
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
  executiveSummary: string;
  metrics: {
    headlineClarity: {
      score: number;
      verdict: string;
      currentHeadline?: string;
      problem: string;
      suggestedHeadline: string;
      why: string;
    };
    valueProposition: {
      score: number;
      verdict: string;
      currentValueProp?: string;
      problem: string;
      suggestedValueProp: string;
      why: string;
    };
    visualHierarchy: {
      score: number;
      verdict: string;
      problem: string;
      specificIssue: string;
      fix: string;
    };
    benefitClarity: {
      score: number;
      verdict: string;
      problem: string;
      missingBenefits: string[];
      suggestedBenefits: string[];
    };
    ctaClarity: {
      score: number;
      verdict: string;
      currentCTA?: string;
      problem: string;
      suggestedCTA: string;
      placement: string;
    };
    proofElements: {
      score: number;
      verdict: string;
      foundProof: string[];
      missingProof: string[];
      suggestedProof: string[];
    };
  };
  fiveSecondTest: {
    passes: boolean;
    estimatedTimeToUnderstand: number;
    firstImpression: string;
    confusionPoints: string[];
    clarityWins: string[];
  };
  findings: {
    critical: Array<{
      issue: string;
      location: string;
      impact: string;
      evidence: string;
    }>;
    warnings: Array<{
      issue: string;
      location: string;
      impact: string;
      evidence: string;
    }>;
    positives: Array<{
      strength: string;
      location: string;
      why: string;
    }>;
  };
  recommendations: Array<{
    priority: "critical" | "high" | "medium" | "low";
    category: string;
    action: string;
    why: string;
    before: string;
    after: string;
    implementation: {
      steps: string[];
      effort: "low" | "medium" | "high";
      expectedImpact: string;
    };
    example: string;
  }>;
  competitiveContext: {
    clarityVsCompetitors: "behind" | "average" | "ahead";
    industryStandardClarity: number;
    yourClarity: number;
    gap: string;
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
  const [expandedRecs, setExpandedRecs] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/clarity-reports?reportId=${reportId}`);
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

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-700 border-red-200",
      high: "bg-orange-100 text-orange-700 border-orange-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      low: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return colors[priority];
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleRec = (index: number) => {
    const newExpanded = new Set(expandedRecs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRecs(newExpanded);
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
                {report.band.toUpperCase()}
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

      {/* Executive Summary - THE BRUTAL TRUTH */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-red-800 font-medium">
            {report.executiveSummary}
          </p>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              {report.fiveSecondTest.passes ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {report.fiveSecondTest.passes
                  ? "Passes 5-Second Test"
                  : "FAILS 5-Second Test"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>
                Time to understand: ~
                {report.fiveSecondTest.estimatedTimeToUnderstand}s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

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
              {report.score}/100
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <Badge className={getBandColor(report.band)}>
                  {report.band.toUpperCase()}
                </Badge>
              </div>
              <p className="text-slate-600">
                {report.fiveSecondTest.firstImpression}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Findings - MUST FIX */}
      {report.findings.critical.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <XCircle className="h-5 w-5" />
              Critical Issues (Fix These First)
            </CardTitle>
            <CardDescription className="text-red-700">
              These issues are actively costing you conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.findings.critical.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-lg border border-red-200"
                >
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">
                        {finding.issue}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        <span className="font-medium">Location:</span>{" "}
                        {finding.location}
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        <span className="font-medium">Impact:</span>{" "}
                        {finding.impact}
                      </p>
                      <p className="text-sm text-slate-500 mt-2 italic">
                        &ldquo;{finding.evidence}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metric Deep Dives */}
      <div className="grid gap-4">
        {/* Headline Clarity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Headline Clarity
              <span
                className={`text-2xl font-bold ${getScoreColor(report.metrics.headlineClarity.score)}`}
              >
                {report.metrics.headlineClarity.score}/100
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-slate-600">
              {report.metrics.headlineClarity.verdict}
            </p>

            {report.metrics.headlineClarity.currentHeadline && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  CURRENT HEADLINE:
                </p>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="text-slate-700">
                    {report.metrics.headlineClarity.currentHeadline}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-red-600 mb-1">PROBLEM:</p>
              <p className="text-slate-700">
                {report.metrics.headlineClarity.problem}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-green-600">
                  SUGGESTED HEADLINE:
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      report.metrics.headlineClarity.suggestedHeadline,
                    )
                  }
                  className="h-6 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <p className="text-green-800 font-medium">
                  {report.metrics.headlineClarity.suggestedHeadline}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {report.metrics.headlineClarity.why}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Value Proposition
              <span
                className={`text-2xl font-bold ${getScoreColor(report.metrics.valueProposition.score)}`}
              >
                {report.metrics.valueProposition.score}/100
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-slate-600">
              {report.metrics.valueProposition.verdict}
            </p>

            {report.metrics.valueProposition.currentValueProp && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  CURRENT:
                </p>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="text-slate-700">
                    {report.metrics.valueProposition.currentValueProp}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-red-600 mb-1">PROBLEM:</p>
              <p className="text-slate-700">
                {report.metrics.valueProposition.problem}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-green-600">SUGGESTED:</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      report.metrics.valueProposition.suggestedValueProp,
                    )
                  }
                  className="h-6 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <p className="text-green-800 font-medium">
                  {report.metrics.valueProposition.suggestedValueProp}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {report.metrics.valueProposition.why}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Clarity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              CTA Clarity
              <span
                className={`text-2xl font-bold ${getScoreColor(report.metrics.ctaClarity.score)}`}
              >
                {report.metrics.ctaClarity.score}/100
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm font-medium text-slate-600">
              {report.metrics.ctaClarity.verdict}
            </p>

            {report.metrics.ctaClarity.currentCTA && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  CURRENT CTA:
                </p>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="text-slate-700">
                    {report.metrics.ctaClarity.currentCTA}
                  </p>
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-red-600 mb-1">PROBLEM:</p>
              <p className="text-slate-700">
                {report.metrics.ctaClarity.problem}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-green-600">
                  SUGGESTED CTA:
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(report.metrics.ctaClarity.suggestedCTA)
                  }
                  className="h-6 text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <p className="text-green-800 font-medium">
                  {report.metrics.ctaClarity.suggestedCTA}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-medium">Placement:</span>{" "}
                {report.metrics.ctaClarity.placement}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prioritized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Action Plan (Prioritized)
          </CardTitle>
          <CardDescription>
            Click each recommendation to see implementation steps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.recommendations
            .sort((a, b) => {
              const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((rec, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <div
                  className="p-4 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleRec(idx)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {rec.category}
                        </Badge>
                      </div>
                      <p className="font-semibold text-slate-900">
                        {rec.action}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">{rec.why}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      {expandedRecs.has(idx) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedRecs.has(idx) && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4">
                    {/* Before/After */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-red-600 mb-1">
                          BEFORE:
                        </p>
                        <div className="p-3 bg-red-50 rounded border border-red-200">
                          <p className="text-red-800">{rec.before}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-green-600 mb-1">
                          AFTER:
                        </p>
                        <div className="p-3 bg-green-50 rounded border border-green-200">
                          <p className="text-green-800">{rec.after}</p>
                        </div>
                      </div>
                    </div>

                    {/* Implementation Steps */}
                    <div>
                      <p className="text-xs font-medium text-slate-600 mb-2">
                        IMPLEMENTATION STEPS:
                      </p>
                      <ol className="space-y-2">
                        {rec.implementation.steps.map((step, stepIdx) => (
                          <li
                            key={stepIdx}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                              {stepIdx + 1}
                            </span>
                            <span className="text-slate-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Effort & Impact */}
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Effort:</span>
                        <span className="ml-2 font-medium capitalize">
                          {rec.implementation.effort}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expected Impact:</span>
                        <span className="ml-2 font-medium text-green-700">
                          {rec.implementation.expectedImpact}
                        </span>
                      </div>
                    </div>

                    {/* Example */}
                    {rec.example && (
                      <div>
                        <p className="text-xs font-medium text-slate-600 mb-1">
                          EXAMPLE:
                        </p>
                        <div className="p-3 bg-white rounded border border-slate-200">
                          <p className="text-slate-700 text-sm">
                            {rec.example}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </CardContent>
      </Card>

      {/* 5-Second Test Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            5-Second Test Details
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
                  Estimated time to understand: ~
                  {report.fiveSecondTest.estimatedTimeToUnderstand} seconds
                </div>
              </div>
            </div>

            {report.fiveSecondTest.confusionPoints.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-700 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Confusion Points:
                </h4>
                <ul className="space-y-2">
                  {report.fiveSecondTest.confusionPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-slate-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.fiveSecondTest.clarityWins.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  What Works Well:
                </h4>
                <ul className="space-y-2">
                  {report.fiveSecondTest.clarityWins.map((win, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-slate-700">{win}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
