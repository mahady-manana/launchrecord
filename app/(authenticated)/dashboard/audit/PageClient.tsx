"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import type { ISIOReport } from "@/models/sio-report";
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
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const analysisSteps: AnalysisStep[] = [
  {
    id: 1,
    title: "Analyzing Website Structure",
    description: "Scanning landing page architecture and messaging clarity",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    id: 2,
    title: "Running Genericity Algorithm",
    description: "Comparing against 10,000+ SaaS positioning patterns",
    icon: <Brain className="h-6 w-6" />,
  },
  {
    id: 3,
    title: "Simulating Buyer Intent",
    description: "Running 1,000 buyer journey simulations",
    icon: <Target className="h-6 w-6" />,
  },
  {
    id: 4,
    title: "Computing AEO Pulse",
    description: "Checking visibility across ChatGPT, Claude, Perplexity",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    id: 5,
    title: "AI Threat Assessment",
    description: "Analyzing competitive threat from AI-native solutions",
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    id: 6,
    title: "Generating War Briefing",
    description: "Compiling your personalized audit report",
    icon: <LineChart className="h-6 w-6" />,
  },
];

function DashboardAuditContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const { fetchProducts } = useProducts();
  const { selectedProduct } = useProductStore();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [report, setReport] = useState<ISIOReport | null>(null);
  const [productUrl, setProductUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRetryScheduled, setShowRetryScheduled] = useState(false);
  const [retryAt, setRetryAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const auditStartedRef = useRef(false);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      if (isProcessing) {
        setCurrentStepIndex((prev) => (prev + 1) % analysisSteps.length);
      }
    }, 1500);

    return () => clearInterval(stepInterval);
  }, [isProcessing]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      if (selectedProduct?.id === productId && selectedProduct.website) {
        setProductUrl(selectedProduct.website);
        return;
      }

      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        if (response.ok && data.product?.website) {
          setProductUrl(data.product.website);
          return;
        }
        throw new Error("Product website is required to run an audit");
      } catch (err: any) {
        setError(err.message || "Failed to load product details");
      }
    };

    loadProduct();
  }, [productId, selectedProduct]);

  useEffect(() => {
    if (productId && productUrl && !auditStartedRef.current) {
      auditStartedRef.current = true;
      runAudit(productId, productUrl);
    }
  }, [productId, productUrl]);

  const runAudit = async (id: string, url: string) => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/sio-v5-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, url }),
      });

      const data = await response.json();

      if (response.ok) {
        setReport(data.data);
        setShowResults(true);
        setIsProcessing(false);
        await fetchProducts(id);
        router.push("/dashboard/" + id);
        // Refetch products and update selected product with new audit data
      } else if (response.status === 503 && data.retry) {
        setShowRetryScheduled(true);
        setError(data.error || "System is at capacity");
        setIsProcessing(false);
        if (data.retryAt) {
          setRetryAt(new Date(data.retryAt));
        }
      } else {
        throw new Error(data.error || "Failed to generate audit");
      }
    } catch (err: any) {
      console.error("Error running analysis:", err);
      setError(err.message || "Failed to generate audit report");
      setIsProcessing(false);
    }
  };

  // Update countdown timer
  useEffect(() => {
    if (!retryAt) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = retryAt.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Retry available - refreshing...");
        if (productId && productUrl) {
          runAudit(productId, productUrl);
        }
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [retryAt, productId, productUrl]);

  // Show error state
  if (error && !report) {
    if (showRetryScheduled) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <Card className="border-2 border-orange-200">
              <CardContent className="pt-8 space-y-4">
                <Loader2 className="h-16 w-16 text-orange-600 mx-auto animate-spin" />
                <h2 className="text-2xl font-bold text-foreground">
                  Audit Scheduled for Retry
                </h2>
                <p className="text-muted-foreground">{error}</p>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-orange-600 mb-2">
                    Automatic retry in
                  </div>
                  <div className="text-3xl font-bold text-orange-700 font-mono">
                    {countdown}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This page will automatically refresh when the retry is
                  available.
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
              <p className="text-muted-foreground">{error}</p>
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
    return (
      <div className="text-center space-y-4">
        <Badge className="bg-orange-600 hover:bg-orange-700 animate-pulse">
          <Zap className="h-3 w-3 mr-1" />
          Report ready...
        </Badge>
        <h1 className="text-4xl font-bold text-foreground">Redirecting</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Our AI is analyzing your positioning across multiple dimensions
        </p>
      </div>
    );
  }

  const currentStep = analysisSteps[currentStepIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
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

        {/* Loading Indicator */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-xl">
          <CardContent className="pt-12 pb-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-orange-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-24 h-24 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Current Step */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center animate-pulse">
                  {currentStep.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-orange-600">
                {currentStep.title}
              </h3>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* All Steps Indicator */}
        <div className="space-y-3">
          {analysisSteps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted =
              index < currentStepIndex ||
              (index === 0 && currentStepIndex === analysisSteps.length - 1);

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
                        step.icon
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
                    {isActive && (
                      <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                    )}
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
              <div className="text-2xl font-bold text-orange-600">~10s</div>
              <div className="text-xs text-muted-foreground mt-1">
                Total Time
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardAuditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardAuditContent />
    </Suspense>
  );
}
