"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  BarChart3,
  Brain,
  CheckCircle,
  Cpu,
  Globe,
  LineChart,
  Loader2,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "active" | "completed";
}

interface AuditProgressModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onError: (error: string) => void;
  productId: string;
}

const INITIAL_STEPS: AnalysisStep[] = [
  {
    id: 1,
    title: "Analyzing Website Structure",
    description: "Scanning landing page architecture and messaging clarity",
    icon: <Globe className="h-6 w-6" />,
    status: "pending",
  },
  {
    id: 2,
    title: "Running Genericity Algorithm",
    description: "Comparing against 10,000+ SaaS positioning patterns",
    icon: <Brain className="h-6 w-6" />,
    status: "pending",
  },
  {
    id: 3,
    title: "Simulating Buyer Intent",
    description: "Running 1,000 buyer journey simulations",
    icon: <Target className="h-6 w-6" />,
    status: "pending",
  },
  {
    id: 4,
    title: "Computing AEO Pulse",
    description: "Checking visibility across ChatGPT, Claude, Perplexity",
    icon: <BarChart3 className="h-6 w-6" />,
    status: "pending",
  },
  {
    id: 5,
    title: "AI Threat Assessment",
    description: "Analyzing competitive threat from AI-native solutions",
    icon: <Cpu className="h-6 w-6" />,
    status: "pending",
  },
  {
    id: 6,
    title: "Generating War Briefing",
    description: "Compiling your personalized audit report",
    icon: <LineChart className="h-6 w-6" />,
    status: "pending",
  },
];

export function AuditProgressModal({
  isOpen,
  onComplete,
  onError,
  productId,
}: AuditProgressModalProps) {
  const [steps, setSteps] = useState<AnalysisStep[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(30);

  useEffect(() => {
    if (!isOpen) {
      setSteps(INITIAL_STEPS);
      setCurrentStepIndex(0);
      setProgress(0);
      setElapsedTime(0);
      setEstimatedTimeRemaining(30);
      return;
    }

    // Start the audit process
    runAudit();

    // Timer for elapsed time
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Update step visualization
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < steps.length) {
          setSteps((currentSteps) =>
            currentSteps.map((step, idx) => ({
              ...step,
              status:
                idx < next ? "completed" : idx === next ? "active" : "pending",
            })),
          );
          setProgress(((next + 1) / steps.length) * 100);
        }
        return next >= steps.length ? prev : next;
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, [isOpen]);

  const runAudit = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/audit`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        // Mark all steps as completed
        setSteps((currentSteps) =>
          currentSteps.map((step) => ({ ...step, status: "completed" })),
        );
        setProgress(100);
        
        // Small delay to show completion before closing
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to run audit");
      }
    } catch (err: any) {
      console.error("Audit error:", err);
      onError(err.message || "Failed to run audit");
    }
  };

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-xl">
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <Badge className="bg-orange-600 hover:bg-orange-700 animate-pulse">
                <Zap className="h-3 w-3 mr-1" />
                Running Audit
              </Badge>
              <h2 className="text-2xl font-bold text-foreground">
                Analyzing Your SaaS
              </h2>
              <p className="text-muted-foreground">
                This takes about 30-60 seconds. Don&apos;t close this window.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Timer */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-xs text-muted-foreground">Elapsed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatTime(Math.max(0, estimatedTimeRemaining - elapsedTime))}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
            </div>

            {/* Current Step Highlight */}
            {steps[currentStepIndex] && (
              <div className="text-center space-y-2 py-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-orange-600 text-white flex items-center justify-center animate-pulse">
                    {steps[currentStepIndex].icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-orange-600">
                  {steps[currentStepIndex].title}
                </h3>
                <p className="text-muted-foreground">
                  {steps[currentStepIndex].description}
                </p>
              </div>
            )}

            {/* All Steps */}
            <div className="space-y-3">
              {steps.map((step, index) => {
                const isActive = step.status === "active";
                const isCompleted = step.status === "completed";

                return (
                  <Card
                    key={step.id}
                    className={`transition-all duration-500 ${
                      isActive
                        ? "border-orange-600 bg-orange-50 shadow-md"
                        : isCompleted
                          ? "border-green-600 bg-green-50"
                          : "border-border opacity-50"
                    }`}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isActive
                              ? "bg-orange-600 border-orange-600 text-white animate-pulse"
                              : isCompleted
                                ? "bg-green-600 border-green-600 text-white"
                                : "bg-white border-border text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            isActive ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              step.icon
                            )
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-semibold ${
                              isActive
                                ? "text-orange-600"
                                : isCompleted
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

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
                  <div className="text-2xl font-bold text-orange-600">~60s</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total Time
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
