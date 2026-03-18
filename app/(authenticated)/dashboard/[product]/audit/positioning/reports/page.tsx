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
import type { PositioningAuditResult } from "@/services/positioning-audit";
import { useProductStore } from "@/stores/product-store";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Brain,
  Download,
  Layers,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PositioningReportsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const { selectedProduct } = useProductStore();

  const [report, setReport] = useState<PositioningAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load report from sessionStorage
    const storedResult = sessionStorage.getItem("positioningAuditResult");

    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        // Verify it's for this product
        if (
          parsed.url.includes(selectedProduct?.website || "") ||
          parsed.productId === productId
        ) {
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
    if (score >= 90) return "from-green-500 to-emerald-600";
    if (score >= 70) return "from-blue-500 to-indigo-600";
    if (score >= 50) return "from-yellow-500 to-amber-600";
    if (score >= 30) return "from-orange-500 to-red-600";
    return "from-red-600 to-rose-700";
  };

  const getPositioningBand = (score: number) => {
    if (score >= 90) return "Dominant";
    if (score >= 70) return "Strong";
    if (score >= 50) return "Blended";
    if (score >= 30) return "Weak";
    return "Ghost";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading positioning report...</p>
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
          <h1 className="text-3xl font-bold">Positioning Audit Report</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Target className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle>No Report Available</CardTitle>
            <CardDescription>
              Run a positioning audit to generate your category position report
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button
              onClick={() =>
                router.push(`/dashboard/${productId}/audit/positioning`)
              }
            >
              Run Positioning Audit
            </Button>
          </CardContent>
        </Card>
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
              <h1 className="text-3xl font-bold">Positioning Audit Report</h1>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Target className="h-3 w-3 mr-1" />
                Category Defense
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
            onClick={() =>
              router.push(`/dashboard/${productId}/audit/positioning`)
            }
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
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Positioning Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div
                className={`text-6xl font-bold ${getScoreColor(report.overallScore)} mb-2`}
              >
                {report.overallScore}
              </div>
              <div className="text-sm text-slate-500 mb-4">
                out of 100 - {getPositioningBand(report.overallScore)}
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getBandColor(report.overallScore)}`}
                  style={{ width: `${report.overallScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimension Scores */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dimension Breakdown</CardTitle>
            <CardDescription>
              Scores across 6 positioning dimensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <DimensionBar
                icon={<Brain className="h-4 w-4" />}
                name="Category Ownership"
                score={report.categoryOwnership.score}
                maxScore={report.categoryOwnership.maxScore}
              />
              <DimensionBar
                icon={<Shield className="h-4 w-4" />}
                name="Unique Value Proposition"
                score={report.uniqueValueProposition.score}
                maxScore={report.uniqueValueProposition.maxScore}
              />
              <DimensionBar
                icon={<Layers className="h-4 w-4" />}
                name="Competitive Differentiation"
                score={report.competitiveDifferentiation.score}
                maxScore={report.competitiveDifferentiation.maxScore}
              />
              <DimensionBar
                icon={<Target className="h-4 w-4" />}
                name="Target Audience Clarity"
                score={report.targetAudienceClarity.score}
                maxScore={report.targetAudienceClarity.maxScore}
              />
              <DimensionBar
                icon={<Target className="h-4 w-4" />}
                name="Problem-Solution Fit"
                score={report.problemSolutionFit.score}
                maxScore={report.problemSolutionFit.maxScore}
              />
              <DimensionBar
                icon={<BarChart3 className="h-4 w-4" />}
                name="Messaging Consistency"
                score={report.messagingConsistency.score}
                maxScore={report.messagingConsistency.maxScore}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Ownership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Category Ownership
          </CardTitle>
          <CardDescription>
            How well you define and own your market category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Category Definition
                </h4>
                <p className="text-sm text-slate-600">
                  {report.categoryOwnership.categoryDefinition ||
                    "No category definition identified"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Category Leaders
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.categoryOwnership.categoryLeaders.length > 0 ? (
                    report.categoryOwnership.categoryLeaders.map(
                      (leader, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-slate-100"
                        >
                          {leader}
                        </Badge>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-slate-500">
                      No competitors identified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Owned Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.categoryOwnership.ownedKeywords.length > 0 ? (
                    report.categoryOwnership.ownedKeywords.map((kw, idx) => (
                      <Badge
                        key={idx}
                        className="bg-green-100 text-green-700 border-green-200"
                      >
                        {kw}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      No keywords owned
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.categoryOwnership.missingKeywords.length > 0 ? (
                    report.categoryOwnership.missingKeywords.map((kw, idx) => (
                      <Badge
                        key={idx}
                        className="bg-orange-100 text-orange-700 border-orange-200"
                      >
                        {kw}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      No missing keywords
                    </span>
                  )}
                </div>
              </div>
            </div>

            {report.categoryOwnership.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {report.categoryOwnership.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Unique Value Proposition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Unique Value Proposition
          </CardTitle>
          <CardDescription>
            Clarity and uniqueness of your value proposition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Identified UVP
                </h4>
                <p className="text-sm text-slate-600">
                  {report.uniqueValueProposition.identifiedUVP ||
                    "No clear UVP identified"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    UVP Clarity
                  </h4>
                  <Badge
                    className={
                      report.uniqueValueProposition.uvpClarity === "clear"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : report.uniqueValueProposition.uvpClarity ===
                            "somewhat clear"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {report.uniqueValueProposition.uvpClarity}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Uniqueness
                  </h4>
                  <Badge
                    className={
                      report.uniqueValueProposition.uniquenessLevel ===
                      "highly unique"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : report.uniqueValueProposition.uniquenessLevel ===
                            "moderately unique"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {report.uniqueValueProposition.uniquenessLevel}
                  </Badge>
                </div>
              </div>
            </div>

            {report.uniqueValueProposition.supportingEvidence.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Supporting Evidence
                </h4>
                <ul className="space-y-1">
                  {report.uniqueValueProposition.supportingEvidence.map(
                    (ev, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-600 flex items-start gap-2"
                      >
                        <span className="text-indigo-600 mt-0.5">•</span>
                        <span>{ev}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {report.uniqueValueProposition.recommendations.length > 0 && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-semibold text-indigo-900 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {report.uniqueValueProposition.recommendations.map(
                    (rec, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-indigo-800 flex items-start gap-2"
                      >
                        <span className="text-indigo-600 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Differentiation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-600" />
            Competitive Differentiation
          </CardTitle>
          <CardDescription>
            How well you differentiate from competitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">
                Differentiation Factors
              </h4>
              <div className="space-y-2">
                {report.competitiveDifferentiation.differentiationFactors
                  .length > 0 ? (
                  report.competitiveDifferentiation.differentiationFactors.map(
                    (factor, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <span className="text-sm text-green-800">{factor}</span>
                      </div>
                    ),
                  )
                ) : (
                  <span className="text-sm text-slate-500">
                    No differentiation factors identified
                  </span>
                )}
              </div>
            </div>

            {report.competitiveDifferentiation.weakPoints.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Weak Points
                </h4>
                <div className="space-y-2">
                  {report.competitiveDifferentiation.weakPoints.map(
                    (weakness, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <span className="text-sm text-orange-800">
                          {weakness}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {report.competitiveDifferentiation.recommendations.length > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {report.competitiveDifferentiation.recommendations.map(
                    (rec, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-purple-800 flex items-start gap-2"
                      >
                        <span className="text-purple-600 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Target Audience & Problem-Solution Fit */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Target Audience Clarity
            </CardTitle>
            <CardDescription>
              How well you define your audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Identified Audiences
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.targetAudienceClarity.identifiedAudiences.length >
                  0 ? (
                    report.targetAudienceClarity.identifiedAudiences.map(
                      (audience, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {audience}
                        </Badge>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-slate-500">
                      No specific audiences identified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Specificity
                  </h4>
                  <Badge
                    className={
                      report.targetAudienceClarity.audienceSpecificity ===
                      "very specific"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : report.targetAudienceClarity.audienceSpecificity ===
                            "somewhat specific"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-orange-100 text-orange-700 border-orange-200"
                    }
                  >
                    {report.targetAudienceClarity.audienceSpecificity}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">
                    Persona Depth
                  </h4>
                  <Badge
                    className={
                      report.targetAudienceClarity.personaDepth === "detailed"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : report.targetAudienceClarity.personaDepth === "basic"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    {report.targetAudienceClarity.personaDepth}
                  </Badge>
                </div>
              </div>

              {report.targetAudienceClarity.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {report.targetAudienceClarity.recommendations.map(
                      (rec, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-blue-800 flex items-start gap-2"
                        >
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              Problem-Solution Fit
            </CardTitle>
            <CardDescription>
              Quality of problem-solution alignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Identified Problems
                </h4>
                <div className="space-y-2">
                  {report.problemSolutionFit.identifiedProblems.length > 0 ? (
                    report.problemSolutionFit.identifiedProblems.map(
                      (problem, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <span className="text-sm text-slate-700">
                            {problem}
                          </span>
                        </div>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-slate-500">
                      No specific problems identified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Solution Clarity
                </h4>
                <p className="text-sm text-slate-600">
                  {report.problemSolutionFit.solutionClarity ||
                    "No clear solution articulated"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Fit Quality</h4>
                <Badge
                  className={
                    report.problemSolutionFit.fitQuality === "strong"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : report.problemSolutionFit.fitQuality === "moderate"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  {report.problemSolutionFit.fitQuality}
                </Badge>
              </div>

              {report.problemSolutionFit.recommendations.length > 0 && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {report.problemSolutionFit.recommendations.map(
                      (rec, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-indigo-800 flex items-start gap-2"
                        >
                          <span className="text-indigo-600 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messaging Consistency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            Messaging Consistency
          </CardTitle>
          <CardDescription>
            Consistency of messaging across content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Tone Consistency
                </h4>
                <Badge
                  className={
                    report.messagingConsistency.toneConsistency === "consistent"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : report.messagingConsistency.toneConsistency ===
                          "somewhat consistent"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  {report.messagingConsistency.toneConsistency}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Value Prop Consistency
                </h4>
                <Badge
                  className={
                    report.messagingConsistency.valuePropConsistency ===
                    "consistent"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : report.messagingConsistency.valuePropConsistency ===
                          "somewhat consistent"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  {report.messagingConsistency.valuePropConsistency}
                </Badge>
              </div>
            </div>

            {report.messagingConsistency.channelAlignment.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">
                  Channel Alignment
                </h4>
                <ul className="space-y-1">
                  {report.messagingConsistency.channelAlignment.map(
                    (channel, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-slate-600 flex items-start gap-2"
                      >
                        <span className="text-teal-600 mt-0.5">•</span>
                        <span>{channel}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {report.messagingConsistency.recommendations.length > 0 && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <h4 className="font-semibold text-teal-900 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {report.messagingConsistency.recommendations.map(
                    (rec, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-teal-800 flex items-start gap-2"
                      >
                        <span className="text-teal-600 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
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
                  Improve Your Positioning
                </h4>
                <p className="text-sm text-orange-700">
                  Focus on the dimensions with the lowest scores. Strong
                  positioning requires clarity across all six dimensions. Start
                  with category definition and UVP clarity.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/${productId}/audit/positioning`)
                }
              >
                <Target className="h-4 w-4 mr-2" />
                Run Another Audit
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/${productId}/audit/aeo`)
                }
              >
                <Brain className="h-4 w-4 mr-2" />
                Run AEO Audit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DimensionBar({
  icon,
  name,
  score,
  maxScore,
}: {
  icon: React.ReactNode;
  name: string;
  score: number;
  maxScore: number;
}) {
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{icon}</span>
          <span className="font-medium text-slate-900">{name}</span>
        </div>
        <span className="text-slate-600">
          {score}/{maxScore} ({percentage}%)
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${
            percentage >= 70
              ? "from-green-500 to-emerald-600"
              : percentage >= 50
                ? "from-yellow-500 to-amber-600"
                : percentage >= 30
                  ? "from-orange-500 to-red-600"
                  : "from-red-600 to-rose-700"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
