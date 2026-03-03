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
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import { EarlyDashboard } from "@/components/early-dashboard";

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
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<AuditReportV1 | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetryScheduled, setIsRetryScheduled] = useState(false);
  const [retryAt, setRetryAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (!productId) {
      router.push("/survey");
      return;
    }

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

      // Call the audit API with product ID
      try {
        const response = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        const data = await response.json();

        if (response.ok) {
          setReport(data.data.analysis);
          
          // Final celebration animation
          await new Promise((resolve) => setTimeout(resolve, 500));
          setProgress(100);
          setShowResults(true);
        } else if (response.status === 503 && data.retry) {
          // Capacity error - retry scheduled
          setError(data.error || "System is at capacity");
          setIsRetryScheduled(true);
          if (data.retryAt) {
            setRetryAt(new Date(data.retryAt));
          }
        } else {
          throw new Error(data.error || "Failed to generate audit");
        }
      } catch (error: any) {
        console.error("Error running analysis:", error);
        setError(error.message || "Failed to generate audit report");
      }
    };

    runAnalysis();
  }, [productId, router]);

  // Update countdown timer
  useEffect(() => {
    if (!retryAt) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = retryAt.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown("Retry available - refreshing...");
        // Auto refresh when retry time is reached
        window.location.reload();
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [retryAt]);

  // Show error state
  if (error && !report) {
    if (isRetryScheduled) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <Card className="border-2 border-orange-200">
              <CardContent className="pt-8 space-y-4">
                <RefreshCcw className="h-16 w-16 text-orange-600 mx-auto animate-pulse" />
                <h2 className="text-2xl font-bold text-foreground">
                  Audit Scheduled for Retry
                </h2>
                <p className="text-muted-foreground">
                  {error}
                </p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-orange-600 mb-2">Automatic retry in</div>
                  <div className="text-3xl font-bold text-orange-700 font-mono">
                    {countdown}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This page will automatically refresh when the retry is available.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <Card>
            <CardContent className="pt-8 space-y-4">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">
                Audit Failed
              </h2>
              <p className="text-muted-foreground">
                {error}
              </p>
              <Button 
                onClick={() => router.push("/survey")}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults && report) {
    return <EarlyDashboard report={report} />;
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

export default function AuditReportPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuditReportContent />
    </Suspense>
  );
}
