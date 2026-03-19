"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProducts } from "@/hooks/use-products";
import { useProductStore } from "@/stores/product-store";
import { AuditReportV1 } from "@/types/audit-report-v1";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Loader2,
  RefreshCcw,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuditPageProps {
  params: Promise<{ product: string }>;
}

type AuditStatus = "idle" | "running" | "success" | "error" | "rate-limited";

export default function ProductAuditPage({ params }: AuditPageProps) {
  const router = useRouter();
  const { products, selectedProduct, setSelectedProduct } = useProductStore();
  const { fetchProducts } = useProducts();

  const [product, setProduct] = useState<typeof selectedProduct>(null);
  const [existingReport, setExistingReport] = useState<AuditReportV1 | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [auditStatus, setAuditStatus] = useState<AuditStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryAt, setRetryAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    async function loadProduct() {
      const { product: productId } = await params;
      await fetchProducts();

      const foundProduct = products.find(
        (p) => p.id === productId || p._id === productId,
      );
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedProduct(foundProduct);
        await checkExistingAudit(productId);
      } else {
        router.push("/dashboard");
      }
    }
    loadProduct();
  }, [params]);

  useEffect(() => {
    if (!retryAt) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = retryAt.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("Retry available");
        setAuditStatus("idle");
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

  const checkExistingAudit = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/audit/latest`);
      if (response.ok) {
        const data = await response.json();
        if (data.report) {
          setExistingReport(data.report);
        }
      }
    } catch (error) {
      console.error("Error checking existing audit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAudit = async () => {
    if (!product) return;

    setAuditStatus("running");
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 2000);

    try {
      const response = await fetch(
        `/api/products/${product.id}/audit?new=true`,
        {
          method: "POST",
        },
      );

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (response.ok) {
        setAuditStatus("success");
        setExistingReport(data.report || null);
        await fetchProducts();
        router.push("/dashboard/" + product.id);
      } else if (response.status === 429) {
        setAuditStatus("rate-limited");
        setErrorMessage(data.error || "Rate limit exceeded");
        if (data.retryAt) {
          setRetryAt(new Date(data.retryAt));
        }
      } else if (response.status === 503 && data.retry) {
        setAuditStatus("rate-limited");
        setErrorMessage(data.error || "System at capacity");
        if (data.retryAt) {
          setRetryAt(new Date(data.retryAt));
        }
      } else {
        setAuditStatus("error");
        setErrorMessage(data.error || "Failed to run audit");
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setAuditStatus("error");
      setErrorMessage(err.message || "Failed to run audit");
    }
  };

  const handleBack = () => {
    if (product) {
      router.push(`/dashboard/${product.id}`);
    } else {
      router.push("/dashboard");
    }
  };

  const handleViewResults = () => {
    if (product) {
      router.push(`/dashboard/${product.id}`);
    }
  };

  const handleRetry = () => {
    setAuditStatus("idle");
    setErrorMessage("");
    setRetryAt(null);
  };

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">SIO-V5 Audit</h1>
            <p className="text-muted-foreground">{product.name}</p>
          </div>
        </div>

        {/* Status Messages */}
        {auditStatus === "success" && (
          <Card className="border-2 border-green-200 bg-green-50 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-800">
                  Audit Completed Successfully!
                </CardTitle>
              </div>
              <CardDescription className="text-green-700 text-base">
                Your comprehensive SIO-V5 analysis is complete. We&apos;ve
                analyzed your positioning, AEO visibility, messaging clarity,
                momentum signals, and competitive landscape.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={handleViewResults}
                  className="bg-green-800 hover:bg-green-700"
                >
                  View Full Results
                </Button>
                <Button onClick={handleRetry} variant="outline">
                  Run Another Audit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {auditStatus === "rate-limited" && (
          <Card className="border-2 border-orange-200 bg-orange-50 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-orange-800">
                  Audit Temporarily Unavailable
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-orange-800 font-medium">
                  {errorMessage.includes("capacity") ||
                  errorMessage.includes("System at capacity")
                    ? "Our AI analysis system is currently at full capacity"
                    : "You've reached your audit limit for this period"}
                </p>
                <p className="text-orange-700 text-sm">
                  {errorMessage.includes("capacity") ||
                  errorMessage.includes("System at capacity")
                    ? "To ensure high-quality analysis for all users, we process audits sequentially. " +
                      "Your audit has been queued and will run automatically when capacity becomes available."
                    : "This prevents overuse and ensures fair access for all founders. " +
                      "Your audit will be available again shortly."}
                </p>
              </div>
              {retryAt && (
                <div className="bg-orange-100 rounded-lg p-4">
                  <div className="text-sm text-orange-600 mb-2 font-medium">
                    {errorMessage.includes("capacity") ||
                    errorMessage.includes("System at capacity")
                      ? "Automatic retry in"
                      : "You can run another audit in"}
                  </div>
                  <div className="text-4xl font-bold text-orange-700 font-mono">
                    {countdown}
                  </div>
                  <p className="text-xs text-orange-600 mt-2">
                    This page will automatically refresh when ready
                  </p>
                </div>
              )}

              {/* Upgrade CTA - Only show for rate limits, not capacity */}
              {!errorMessage.includes("capacity") &&
                !errorMessage.includes("System at capacity") && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-800">
                          Need More Audits?
                        </h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Upgrade to Founder or Growth plan for more monthly
                          audits, weekly audits, and advanced features like
                          competitive tracking and trend analysis.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            📊 Founder: 15 audits/month + 1 auto /week
                          </div>
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            🚀 Growth: 30 audits/month + 5/week
                          </div>
                          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            👑 Sovereign: Unlimited audits
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() =>
                          product &&
                          router.push(`/dashboard/${product.id}/subscription`)
                        }
                        className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                      >
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                )}

              <Button
                onClick={handleRetry}
                disabled={!!retryAt && countdown !== "Retry available"}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {countdown !== "Retry available"
                  ? "Waiting for Retry..."
                  : "Try Again Now"}
              </Button>
            </CardContent>
          </Card>
        )}

        {auditStatus === "error" && (
          <Card className="border-2 border-red-200 bg-red-50 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-red-800">
                  Unable to Complete Audit
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-red-800 font-medium">
                  We encountered an issue while analyzing your SaaS
                </p>
                <p className="text-red-700 text-sm">
                  {errorMessage.includes("network") ||
                  errorMessage.includes("fetch")
                    ? "We couldn&apos;t access your website. Please verify the URL is correct and publicly accessible."
                    : errorMessage.includes("timeout")
                      ? "The analysis took too long to complete. This can happen with complex websites."
                      : "Something went wrong on our end. Our team has been notified."}
                </p>
              </div>
              <div className="bg-red-100 rounded-lg p-3">
                <p className="text-xs text-red-600 font-mono break-all">
                  Technical details: {errorMessage}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Try Again
                </Button>
                <Button onClick={handleBack} variant="outline">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Running State */}
        {auditStatus === "running" && (
          <Card className="border-2 border-orange-200 bg-orange-50 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
                <CardTitle className="text-orange-800">
                  Running Your SIO-V5 Audit
                </CardTitle>
              </div>
              <CardDescription className="text-orange-700 text-base">
                Our AI is analyzing your SaaS across 6 critical dimensions. This
                deep analysis typically takes 30-60 seconds to ensure
                comprehensive insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600 font-medium">
                    Analysis Progress
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Website Analysis
                </div>
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  AEO Detection
                </div>
                <div className="flex items-center gap-2 text-xs text-orange-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Positioning Check
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-100 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                Please keep this window open. Closing will interrupt the
                analysis.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!existingReport && auditStatus === "idle" ? (
          /* No Audit - Show Start Card */
          <Card className="border-2 border-orange-200 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl">
                Ready to Analyze Your SaaS?
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Get a comprehensive SIO-V5 defensibility audit covering AEO
                visibility, positioning sharpness, clarity velocity, momentum
                signals, and founder proof.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* What You'll Get */}
              <div className="text-center">
                <h3 className="font-semibold text-orange-800 mb-4">
                  What Your Audit Includes
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
                    <Globe className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-orange-800">
                        AEO Index
                      </h3>
                      <p className="text-sm text-orange-700">
                        Visibility across ChatGPT, Claude, Perplexity and AI
                        assistants
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
                    <BarChart3 className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-orange-800">
                        Positioning Sharpness
                      </h3>
                      <p className="text-sm text-orange-700">
                        Category definition and competitive differentiation
                        analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
                    <Clock className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-orange-800">
                        Clarity Velocity
                      </h3>
                      <p className="text-sm text-orange-700">
                        Message clarity and time-to-value communication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 text-left">
                    <FileText className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-orange-800">
                        Founder Proof Vault
                      </h3>
                      <p className="text-sm text-orange-700">
                        Why you&apos;re the one to solve this problem
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why This Matters */}
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-6 border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Why This Audit Matters
                </h3>
                <p className="text-sm text-orange-700 leading-relaxed">
                  In today&apos;s AI-driven market, 73% of B2B buyers use AI
                  assistants to research solutions. If your SaaS isn&apos;t
                  visible in AI recommendations, you&apos;re losing customers
                  before they even reach your website. This audit identifies
                  exactly where you stand and what to fix.
                </p>
              </div>

              {/* Start Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleStartAudit}
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-lg px-12 py-6"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Audit
                </Button>
              </div>

              {/* Info */}
              <div className="text-center text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  Audit takes approximately 30-60 seconds
                </p>
              </div>
            </CardContent>
          </Card>
        ) : existingReport && auditStatus === "idle" ? (
          /* Has Existing Audit */
          <div className="space-y-6">
            {/* Existing Audit Card */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <CardTitle>Audit Already Completed</CardTitle>
                </div>
                <CardDescription className="text-green-700 text-base">
                  You&apos;ve already run a comprehensive SIO-V5 audit for this
                  product. View your results to see actionable insights on
                  positioning, AEO visibility, and defensibility.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleViewResults}
                    className=""
                    variant="outline"
                  >
                    View Full Results
                  </Button>
                  <Button
                    onClick={handleStartAudit}
                    variant="secondary"
                    className="text-white"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Run New Audit
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-4">
                  💡 Tip: Re-run your audit after making significant changes to
                  your website or messaging
                </p>

                {/* Upgrade CTA */}
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-xs text-green-700 font-medium mb-2">
                    🔓 Want to track changes over time?
                  </p>
                  <p className="text-xs text-green-600 mb-3">
                    Upgrade to run more audits and monitor your SIO-V5 score
                    trends
                  </p>
                  <Button
                    onClick={() =>
                      product &&
                      router.push(`/dashboard/${product.id}/subscription`)
                    }
                    size="sm"
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    View Plans
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Audit Summary</CardTitle>
                <CardDescription>
                  Quick overview of your SIO-V5 scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  <ScoreCard
                    label="AEO Index"
                    score={existingReport.aeo_index.score}
                    color="blue"
                  />
                  <ScoreCard
                    label="Positioning"
                    score={existingReport.positioning_sharpness.score}
                    color="purple"
                  />
                  <ScoreCard
                    label="Clarity"
                    score={existingReport.clarity_velocity.score}
                    color="green"
                  />
                  <ScoreCard
                    label="Momentum"
                    score={existingReport.momentum_signal.score}
                    color="orange"
                  />
                  <ScoreCard
                    label="Proof"
                    score={existingReport.founder_proof_vault.score}
                    color="red"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-green-100 text-green-700 border-green-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className={`p-4 rounded-lg border text-center ${colorClasses[color]}`}>
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-xs mt-1">{label}</div>
    </div>
  );
}
