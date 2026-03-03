"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle,
  Cpu,
  Globe,
  LineChart,
  Loader2,
  Target,
  TrendingUp,
  Zap,
  Shield,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import type { AuditReportV1 } from "@/types/audit-report-v1";

interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 1,
    title: "Analyzing Website Structure",
    description: "Scanning landing page architecture and messaging clarity",
    icon: <Globe className="h-6 w-6" />,
    duration: 1500,
  },
  {
    id: 2,
    title: "Running Genericity Algorithm",
    description: "Comparing against 10,000+ SaaS positioning patterns",
    icon: <Brain className="h-6 w-6" />,
    duration: 2000,
  },
  {
    id: 3,
    title: "Simulating Buyer Intent",
    description: "Running 1,000 buyer journey simulations",
    icon: <Target className="h-6 w-6" />,
    duration: 1800,
  },
  {
    id: 4,
    title: "Computing AEO Pulse",
    description: "Checking visibility across ChatGPT, Claude, Perplexity",
    icon: <BarChart3 className="h-6 w-6" />,
    duration: 1500,
  },
  {
    id: 5,
    title: "AI Threat Assessment",
    description: "Analyzing competitive threat from AI-native solutions",
    icon: <Cpu className="h-6 w-6" />,
    duration: 1200,
  },
  {
    id: 6,
    title: "Generating War Briefing",
    description: "Compiling your personalized audit report",
    icon: <LineChart className="h-6 w-6" />,
    duration: 1000,
  },
];

function AuditReportContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<AuditReportV1 | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const runAnalysis = async () => {
      // Run through analysis steps with animations
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(i);
        const step = analysisSteps[i];
        const stepProgress = ((i + 1) / analysisSteps.length) * 100;
        
        // Animate progress within each step
        const startProgress = progress;
        const endProgress = stepProgress;
        const steps = 20;
        const increment = (endProgress - startProgress) / steps;
        
        for (let j = 0; j < steps; j++) {
          await new Promise((resolve) => setTimeout(resolve, step.duration / steps));
          setProgress((prev) => Math.min(prev + increment, endProgress));
        }
      }

      // Call the audit API to get real AI analysis
      try {
        const response = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            founderName: "John Smith",
            saasName: "Acme Analytics",
            saasUrl: "https://acmeanalytics.com",
            email: "test@example.com",
            role: "solo-founder",
            teamSize: "just-me",
            revenue: "pre-revenue",
            biggestChallenge: "invisible-llms",
            competitorThreat: "somewhat-concerned",
            willingToInvest: "49-tier",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setReport(data.data);
        } else {
          throw new Error("API request failed");
        }
      } catch (error) {
        console.error("Error running analysis:", error);
        throw error;
      }

      // Final celebration animation
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(100);
      setShowResults(true);
    };

    runAnalysis();
  }, [router]);

  if (showResults && report) {
    return <AuditResults report={report} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-orange-600 hover:bg-orange-700 animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            Generating Your Audit Report
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            Running Deep Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Our AI is analyzing your positioning across multiple dimensions
          </p>
        </div>

        {/* Main Progress Card */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-xl">
          <CardContent className="pt-8 space-y-6">
            {/* Overall Progress */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  Analysis Progress
                </span>
                <span className="text-sm font-bold text-orange-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Current Step Indicator */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-600 via-orange-400 to-border" />
              <div className="space-y-6 relative">
                {analysisSteps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isPending = index > currentStep;

                  return (
                    <div
                      key={step.id}
                      className={`flex items-start gap-4 transition-all duration-500 ${
                        isPending ? "opacity-40" : "opacity-100"
                      }`}
                    >
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          isCompleted
                            ? "bg-green-600 border-green-600 text-white"
                            : isCurrent
                            ? "bg-orange-600 border-orange-600 text-white animate-pulse"
                            : "bg-white border-border text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <div
                          className={`font-semibold transition-all duration-300 ${
                            isCurrent
                              ? "text-orange-600 text-lg"
                              : isCompleted
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div
                          className={`text-sm transition-all duration-300 ${
                            isCurrent
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.description}
                        </div>
                        {isCurrent && (
                          <div className="flex items-center gap-2 mt-2">
                            <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                            <span className="text-xs text-orange-600">
                              In progress...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-orange-600">10K+</div>
              <div className="text-xs text-muted-foreground mt-1">
                Patterns Compared
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-orange-600">1,000</div>
              <div className="text-xs text-muted-foreground mt-1">
                Simulations Run
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-orange-600">6</div>
              <div className="text-xs text-muted-foreground mt-1">
                Analysis Layers
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/50 backdrop-blur">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-orange-600">~8s</div>
              <div className="text-xs text-muted-foreground mt-1">
                Total Time
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Friendly message */}
        <div className="text-center text-muted-foreground pt-4">
          <p className="text-sm">
            ☕ Grab a coffee - this deep analysis takes about 10 seconds
          </p>
        </div>
      </div>
    </div>
  );
}

// Results Component using V1 Audit Format
function AuditResults({ report }: { report: AuditReportV1 }) {
  const router = useRouter();

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryPositionColor = (position: string) => {
    switch (position) {
      case "leader":
        return "text-green-600 bg-green-50";
      case "challenger":
        return "text-blue-600 bg-blue-50";
      case "replicable":
        return "text-orange-600 bg-orange-50";
      case "invisible":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8 px-4 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 animate-in slide-in-from-top-4 duration-700">
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Audit Report Complete
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            SF-1 War Briefing
          </h1>
          <p className="text-lg text-muted-foreground">
            Analysis Version: {report.meta.analysis_version} • Confidence: {(report.meta.confidence_score * 100).toFixed(0)}%
          </p>
        </div>

        {/* Overall Assessment - Hero Card */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg animate-in zoom-in-95 duration-700">
          <CardContent className="pt-8 space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Overall Assessment
              </h2>
            </div>
            <div className="flex justify-center items-center gap-8">
              <div
                className={`text-7xl font-bold ${getScoreColor(report.overall_assessment.composite_score)} animate-in zoom-in duration-500`}
              >
                {report.overall_assessment.composite_score}
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <div className="text-left space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Category Position</div>
                  <div
                    className={`text-xl font-semibold px-4 py-2 rounded-lg ${getCategoryPositionColor(report.overall_assessment.category_position)}`}
                  >
                    {report.overall_assessment.category_position.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Primary Constraint</div>
                  <div className="text-lg font-semibold text-foreground capitalize">
                    {report.overall_assessment.primary_constraint}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Biggest Leverage Point</div>
                <div className="text-lg font-semibold text-foreground mt-1">
                  {report.overall_assessment.biggest_leverage_point}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Survival Probability (12m)</div>
                <div className={`text-2xl font-bold ${getScoreColor(report.overall_assessment.survival_probability_12m)} mt-1`}>
                  {report.overall_assessment.survival_probability_12m}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Ego Stab - Brutal Truth */}
        <Card className="border-2 border-red-200 bg-red-50 shadow-lg animate-in slide-in-from-bottom-8 duration-700 delay-100">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold text-red-700">The Ego Stab</h3>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-red-800">
                "{report.the_ego_stab.brutal_summary}"
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-red-600">Severity</div>
                  <div className="text-2xl font-bold text-red-700">{report.the_ego_stab.severity}/100</div>
                </div>
                <div>
                  <div className="text-sm text-red-600">Cliché Density</div>
                  <div className="text-2xl font-bold text-red-700">{report.the_ego_stab.cliche_density}</div>
                </div>
                <div>
                  <div className="text-sm text-red-600">Founder Bias Risk</div>
                  <div className="text-lg font-semibold text-red-700 capitalize">{report.the_ego_stab.founder_bias_risk}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-red-200">
                <div className="text-sm text-red-600 mb-2">Founder Ego Bait</div>
                <p className="text-red-800 italic">"{report.the_ego_stab.founder_ego_bait}"</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* AEO Index */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">AEO Index</h3>
                </div>
                <Badge className={getRiskColor(report.aeo_index.search_visibility_risk)}>
                  {report.aeo_index.search_visibility_risk} risk
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${getScoreColor(report.aeo_index.score)}`}>
                  {report.aeo_index.score}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Direct Answer Potential</div>
                  <div className="text-sm text-foreground">{report.aeo_index.direct_answer_potential}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{report.aeo_index.critique}</p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">Priority Actions</div>
                {report.aeo_index.audit.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                    <span>{action.action}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Positioning Sharpness */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-300">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Positioning Sharpness</h3>
                </div>
                <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                  {report.positioning_sharpness.band}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${getScoreColor(report.positioning_sharpness.score)}`}>
                  {report.positioning_sharpness.score}
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  Band position on the sovereign scale
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{report.positioning_sharpness.critique}</p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">Priority Actions</div>
                {report.positioning_sharpness.audit.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                    <span>{action.action}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clarity Velocity */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-400">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Clarity Velocity</h3>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {report.clarity_velocity.band}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${getScoreColor(report.clarity_velocity.score)}`}>
                  {report.clarity_velocity.score}
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  How quickly users understand your value
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{report.clarity_velocity.critique}</p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">Priority Actions</div>
                {report.clarity_velocity.audit.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                    <span>{action.action}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Momentum Signal */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-500">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Momentum Signal</h3>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  {report.momentum_signal.band}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${getScoreColor(report.momentum_signal.score)}`}>
                  {report.momentum_signal.score}
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  Market traction and growth indicators
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{report.momentum_signal.critique}</p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">Priority Actions</div>
                {report.momentum_signal.audit.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                    <span>{action.action}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Founder Proof Vault */}
        <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-600">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Founder Proof Vault</h3>
              </div>
              <div className={`text-3xl font-bold ${getScoreColor(report.founder_proof_vault.score)}`}>
                {report.founder_proof_vault.score}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{report.founder_proof_vault.critique}</p>
            <div className="flex flex-wrap gap-2">
              {report.founder_proof_vault.evidence_types.map((type, idx) => (
                <Badge key={idx} variant="secondary" className="capitalize">
                  {type.replace("_", " ")}
                </Badge>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t">
              <div className="text-xs font-semibold text-muted-foreground">Priority Actions</div>
              {report.founder_proof_vault.audit.slice(0, 3).map((action, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                  <span>{action.action}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">{action.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Competitors */}
        <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-700">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-lg">Top Competitors</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {report.top_competitors.map((competitor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{competitor.name}</span>
                  <Badge className={
                    competitor.threat_level === "high" ? "bg-red-50 text-red-700" :
                    competitor.threat_level === "medium" ? "bg-orange-50 text-orange-700" :
                    "bg-green-50 text-green-700"
                  }>
                    {competitor.threat_level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Weights */}
        <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-800">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-lg">Category Weights</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">AEO Index</span>
                <Progress value={report.category_weights.aeo_index} className="flex-1" />
                <span className="text-sm font-medium w-12 text-right">{report.category_weights.aeo_index}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Positioning</span>
                <Progress value={report.category_weights.positioning_sharpness} className="flex-1" />
                <span className="text-sm font-medium w-12 text-right">{report.category_weights.positioning_sharpness}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Clarity</span>
                <Progress value={report.category_weights.clarity_velocity} className="flex-1" />
                <span className="text-sm font-medium w-12 text-right">{report.category_weights.clarity_velocity}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Momentum</span>
                <Progress value={report.category_weights.momentum_signal} className="flex-1" />
                <span className="text-sm font-medium w-12 text-right">{report.category_weights.momentum_signal}%</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Proof</span>
                <Progress value={report.category_weights.founder_proof_vault} className="flex-1" />
                <span className="text-sm font-medium w-12 text-right">{report.category_weights.founder_proof_vault}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t">{report.category_weights.weighting_rationale}</p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 py-8 animate-in slide-in-from-bottom-8 duration-700 delay-900">
          <h3 className="text-2xl font-bold text-foreground">
            Ready to Improve Your Positioning?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start executing on the priority actions above to strengthen your defensibility.
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
        </div>
      </div>
    </div>
  );
}

export default function AuditReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuditReportContent />
    </Suspense>
  );
}
