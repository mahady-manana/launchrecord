"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface Insights {
  founderName: string;
  saasName: string;
  genericityScore: number;
  sovereignRank: number;
  diagnostics: {
    aeoPulse: {
      mentionShare: string;
      sectorAverage: string;
      firstMentionPosition: string;
      diagnosis: string;
    };
    marketPositionVector: {
      genericityScore: number;
      riskLevel: string;
      overlapCount: number;
      differentiationDelta: string;
    };
    founderProofVault: {
      shippingConsistency: string;
      revenueVelocity: string;
      socialProofStrength: string;
    };
    aiThreatRadar: {
      threatLevel: string;
      roadmapOverlap: string;
      recommendedAction: string;
    };
    productClarityIndex: {
      cfoClarity: number;
      techLeadClarity: number;
      timeToAha: string;
      targetTime: string;
    };
  };
  recommendedTier: string;
  actionPlan: string[];
}

function SurveyCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!sessionId) {
        router.push("/survey");
        return;
      }

      try {
        // First, we need to get the userId from the survey submission
        // For now, we'll fetch insights directly
        const response = await fetch(`/api/survey?session=${sessionId}`);
        if (!response.ok) throw new Error("Failed to fetch insights");

        const data = await response.json();
        setInsights(data.insights);
        setUserId(data.userId);
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-foreground">
            Analyzing your positioning...
          </p>
          <p className="text-sm text-muted-foreground">
            Running 1,000 buyer intent simulations
          </p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">
            Analysis Failed
          </h2>
          <p className="text-muted-foreground">
            We couldn't generate your War Briefing. Please try again.
          </p>
          <Button onClick={() => router.push("/survey")} className="bg-orange-600 hover:bg-orange-700">
            Retake Survey
          </Button>
        </div>
      </div>
    );
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "RED":
        return "text-red-600 bg-red-50 border-red-200";
      case "HIGH":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getRiskColor = (score: number) => {
    if (score > 70) return "text-red-600";
    if (score > 50) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Welcome to LaunchRecord
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            Your SF-1 War Briefing Preview
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thanks, <strong>{insights.founderName}</strong>. Here's what we found
            about <strong>{insights.saasName}</strong>
          </p>
        </div>

        {/* Genericity Score - Hero Metric */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Your Genericity Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center items-center gap-8">
              <div
                className={`text-7xl font-bold ${getRiskColor(insights.genericityScore)}`}
              >
                {insights.genericityScore}
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <div className="text-left space-y-2">
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <div
                  className={`text-xl font-semibold px-4 py-2 rounded-lg ${getRiskColor(insights.genericityScore)} ${getThreatColor(insights.diagnostics.marketPositionVector.riskLevel)}`}
                >
                  {insights.diagnostics.marketPositionVector.riskLevel} RISK
                </div>
              </div>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {insights.genericityScore > 70
                ? "⚠️ You're converging toward commodity territory. Your differentiation is bleeding."
                : insights.genericityScore > 50
                ? "⚖️ Moderate differentiation. Some overlap with competitors detected."
                : "✅ Strong positioning. You're standing out from the crowd."}
            </p>
          </CardContent>
        </Card>

        {/* Diagnostics Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* AEO Pulse */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">AEO Pulse</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Mention Share
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.aeoPulse.mentionShare}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Sector Average
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.aeoPulse.sectorAverage}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  First Mention Position
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.aeoPulse.firstMentionPosition}
                </span>
              </div>
              <p className="text-sm text-muted-foreground pt-2 border-t">
                "{insights.diagnostics.aeoPulse.diagnosis}"
              </p>
            </CardContent>
          </Card>

          {/* Market Position Vector */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Market Position Vector</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Overlap Count
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.marketPositionVector.overlapCount}{" "}
                  competitors
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Differentiation Delta
                </span>
                <span className="font-semibold text-red-600">
                  {insights.diagnostics.marketPositionVector.differentiationDelta}
                </span>
              </div>
              <p className="text-sm text-muted-foreground pt-2 border-t">
                You are converging toward commodity territory.
              </p>
            </CardContent>
          </Card>

          {/* Founder Proof Vault */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Founder Proof Vault</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Shipping Consistency
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.founderProofVault.shippingConsistency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Revenue Velocity
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.founderProofVault.revenueVelocity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Social Proof Strength
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.founderProofVault.socialProofStrength}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AI Threat Radar */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">AI Threat Radar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Threat Level
                </span>
                <Badge
                  className={getThreatColor(
                    insights.diagnostics.aiThreatRadar.threatLevel
                  )}
                >
                  {insights.diagnostics.aiThreatRadar.threatLevel}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Roadmap Overlap
                </span>
                <span className="font-semibold">
                  {insights.diagnostics.aiThreatRadar.roadmapOverlap}
                </span>
              </div>
              <p className="text-sm text-muted-foreground pt-2 border-t">
                {insights.diagnostics.aiThreatRadar.recommendedAction}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Product Clarity Index */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Product Clarity Index</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {insights.diagnostics.productClarityIndex.cfoClarity}/10
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  CFO Clarity
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {insights.diagnostics.productClarityIndex.techLeadClarity}/10
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Tech Lead Clarity
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {insights.diagnostics.productClarityIndex.timeToAha}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Time-to-Aha (Target: {insights.diagnostics.productClarityIndex.targetTime})
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Tier */}
        <Card className="border-2 border-orange-600 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Recommended Tier</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {insights.recommendedTier}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on your survey responses, this tier will give you the
              highest ROI.
            </p>
          </CardContent>
        </Card>

        {/* Action Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Your 3 Missions This Week</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.actionPlan.map((mission, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-foreground">{mission}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h3 className="text-2xl font-bold text-foreground">
            Want Full Access to Your War Briefing?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join LaunchRecord to unlock weekly diagnostics, track your Sovereign
            Rank, and get AI threat alerts before your competitors do.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/")}
              className="h-12 px-8 bg-orange-600 hover:bg-orange-700 text-lg"
            >
              Back to Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            🔒 You're on the waitlist. We'll notify you when LaunchRecord opens.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SurveyCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SurveyCompleteContent />
    </Suspense>
  );
}
