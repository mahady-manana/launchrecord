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
import { useProductStore } from "@/stores/product-store";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  ExternalLink,
  Layers,
  Loader2,
  Search,
  Shield,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PositioningReport {
  _id: string;
  url: string;
  overallScore: number;
  positioningBand: "Dominant" | "Strong" | "Blended" | "Weak" | "Ghost";
  categoryOwnership: {
    categoryOwnershipLevel: string;
  };
  createdAt: string;
  cacheAge?: number;
  fromCache?: boolean;
}

interface UsageInfo {
  positioningAuditsUsed: number;
  positioningAuditsLimit: number;
  positioningWeeklyAuditUsed: number;
  positioningWeeklyAuditLimit: number;
  resetAt: string;
}

interface LimitError {
  limitReached: true;
  limitType: "monthly" | "weekly";
  used: number;
  limit: number;
  resetAt?: string;
}

export default function PositioningAuditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params.product as string;
  const { selectedProduct } = useProductStore();

  const [url, setUrl] = useState(selectedProduct?.website || "");
  const [isRunning, setIsRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState("");
  const [reports, setReports] = useState<PositioningReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [showCacheWarning, setShowCacheWarning] = useState(false);
  const [cachedReport, setCachedReport] = useState<PositioningReport | null>(
    null,
  );
  const [forceAudit, setForceAudit] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<LimitError | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const autoRunStartedRef = useRef(false);

  useEffect(() => {
    loadReports();
  }, [productId]);

  useEffect(() => {
    if (url.trim()) return;
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(urlParam);
      return;
    }
    if (selectedProduct?.website) {
      setUrl(selectedProduct.website);
    }
  }, [searchParams, selectedProduct, url]);

  const loadReports = async () => {
    try {
      setIsLoadingReports(true);
      const response = await fetch(
        `/api/positioning-reports?productId=${productId}&page=1&limit=5`,
      );
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setIsLoadingReports(false);
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
    if (band === "Dominant")
      return "bg-green-100 text-green-700 border-green-200";
    if (band === "Strong") return "bg-lime-100 text-lime-700 border-lime-200";
    if (band === "Blended")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (band === "Weak")
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleRunAudit = async (force = false) => {
    if (!url.trim()) {
      alert("Please enter a URL to audit");
      return;
    }

    setAuditError(null);
    setLimitError(null);
    setIsRunning(true);
    setAuditProgress("Checking for existing reports...");

    try {
      const websiteUrl = url.startsWith("http") ? url : `https://${url}`;

      // Call API endpoint which handles database operations
      const response = await fetch("/api/positioning-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: websiteUrl,
          productId: selectedProduct?.id || productId,
          saveToDb: true,
          force: force,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle limit errors
        if (response.status === 403 && errorData.limitReached) {
          setLimitError(errorData);
          throw new Error(errorData.error || "Audit limit reached");
        }

        throw new Error(errorData.message || "Audit failed");
      }

      const result = await response.json();

      // Update usage info if available
      if (result.usage) {
        setUsage(result.usage);
      }

      // Check if this is a cached report
      if (result.fromCache && !force) {
        setCachedReport(result);
        setShowCacheWarning(true);
        setIsRunning(false);
        setAuditProgress("");
        return;
      }

      setAuditProgress("Saving results...");

      // Store result in session storage
      sessionStorage.setItem(
        "positioningAuditResult",
        JSON.stringify({
          ...result,
          productId: selectedProduct?.id,
          productName: selectedProduct?.name,
        }),
      );

      setAuditProgress("Complete!");

      // Reload reports list
      await loadReports();

      setTimeout(() => {
        setIsRunning(false);
        setAuditProgress("");
        // Redirect to the specific report page
        if (result._id) {
          router.push(
            `/dashboard/${productId}/audit/positioning/reports/${result._id}`,
          );
        } else {
          router.push(`/dashboard/${productId}/audit/positioning/reports`);
        }
      }, 1000);
    } catch (error) {
      console.error("Positioning Audit failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Audit failed. Please try again.";

      // Don't set auditError for limit errors (we show upgrade dialog instead)
      if (!limitError) {
        setAuditError(errorMessage);
      }
      setAuditProgress("");
      setTimeout(() => {
        setIsRunning(false);
      }, 500);
    }
  };

  useEffect(() => {
    const shouldAutoRun =
      searchParams.get("autorun") === "1" ||
      searchParams.get("autorun") === "true";
    if (!shouldAutoRun) return;
    if (autoRunStartedRef.current) return;
    if (!url.trim()) return;
    autoRunStartedRef.current = true;
    handleRunAudit();
  }, [searchParams, url]);

  return (
    <div className="space-y-8">
      {/* Header - Blue gradient theme */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">Positioning Audit</h1>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              <Target className="h-3 w-3 mr-1" />
              Category Defense
            </Badge>
          </div>
          <p className="text-slate-500">
            Own your category or become a feature
          </p>
        </div>
      </div>

      {/* URL Input Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Search className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">
                  Audit Any Page on Your Website
                </h3>
                <p className="text-sm text-blue-700">
                  Enter any URL from your website to analyze your positioning.
                  Leave as-is to audit your homepage, or enter a specific page
                  URL to check product pages, landing pages, or about pages.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to audit (e.g., https://example.com)"
                className="flex h-10 w-96 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isRunning}
              />
              <Button
                onClick={() => handleRunAudit()}
                disabled={isRunning || !url.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {auditProgress}
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Run Positioning Audit
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-6 text-xs text-blue-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Homepage default</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Landing pages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>About/Story pages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Product pages</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Your latest positioning audit results
              </CardDescription>
            </div>
            {reports.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(
                    `/dashboard/${productId}/audit/positioning/reports`,
                  )
                }
              >
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingReports ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Reports Yet
              </h3>
              <p className="text-slate-500 mb-4">
                Run your first positioning audit to see results here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/${productId}/audit/positioning/reports/${report._id}`,
                    )
                  }
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(report.overallScore)}`}
                    >
                      {report.overallScore}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getBandColor(report.positioningBand)}>
                          {report.positioningBand}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(report.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 truncate">
                        {report.url}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Error Display */}
      {auditError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Audit Failed
                </h3>
                <p className="text-red-700 mb-4">{auditError}</p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAuditError(null)}
                  >
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRunAudit(true)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Display */}
      {usage && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    Positioning Audit Usage
                  </h3>
                  <p className="text-sm text-blue-700">
                    {usage.positioningAuditsUsed} of{" "}
                    {usage.positioningAuditsLimit} used this month
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-blue-700">Weekly Limit</div>
                  <div className="text-lg font-bold text-blue-900">
                    {usage.positioningWeeklyAuditUsed} /{" "}
                    {usage.positioningWeeklyAuditLimit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-700">Monthly Limit</div>
                  <div className="text-lg font-bold text-blue-900">
                    {usage.positioningAuditsUsed} /{" "}
                    {usage.positioningAuditsLimit}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Banner - Strategic positioning theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Category Position Analysis
              </h2>
              <p className="text-blue-100">
                Measure how distinctly your startup occupies a unique space in
                the market. Weak positioning = commoditization risk.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">6</div>
              <div className="text-sm text-blue-100">Key Dimensions</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">2-3 min</div>
              <div className="text-sm text-blue-100">Analysis Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-blue-100">Positioning Bands</div>
            </div>
          </div>
        </div>
      </div>

      {/* Positioning Bands - Visual hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Positioning Bands
          </CardTitle>
          <CardDescription>
            Where does your startup rank in market consciousness?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-3">
            {[
              {
                name: "Dominant",
                score: "90-100",
                desc: "You own the category",
                color: "from-green-500 to-emerald-600",
              },
              {
                name: "Strong",
                score: "70-89",
                desc: "Clear differentiation",
                color: "from-blue-500 to-indigo-600",
              },
              {
                name: "Blended",
                score: "50-69",
                desc: "Understandable",
                color: "from-yellow-500 to-amber-600",
              },
              {
                name: "Weak",
                score: "30-49",
                desc: "Unclear positioning",
                color: "from-orange-500 to-red-600",
              },
              {
                name: "Ghost",
                score: "0-29",
                desc: "Invisible",
                color: "from-red-600 to-rose-700",
              },
            ].map((band, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${band.color} rounded-xl p-4 text-white text-center`}
              >
                <div className="text-lg font-bold">{band.name}</div>
                <div className="text-xs opacity-80 mb-2">{band.score}</div>
                <div className="text-xs opacity-70">{band.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Dimensions */}
      <Card>
        <CardHeader>
          <CardTitle>What We Measure</CardTitle>
          <CardDescription>
            Four critical dimensions of market positioning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Brain className="h-6 w-6" />,
                title: "Category Definition",
                desc: "How clearly you define and own your market category",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: <Shield className="h-6 w-6" />,
                title: "Unique Value Proposition",
                desc: "Distinctiveness of your value vs competitors",
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Competitive Differentiation",
                desc: "Your ability to stand out meaningfully",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "AI Entity Recognition",
                desc: "How well AI systems recognize your brand",
                color: "bg-violet-100 text-violet-600",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
              >
                <div
                  className={`h-12 w-12 rounded-lg flex items-center justify-center ${item.color}`}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}

      {/* Strategic Questions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Strategic Questions This Audit Answers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Do you own a distinct category or are you 'another option'?",
              "Can visitors articulate your unique value in 10 seconds?",
              "Are you the default choice or a comparison candidate?",
              "How would AI describe your market position?",
            ].map((question, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-blue-800">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <Link href="/positioning-audit" target="_blank">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Public Version</h4>
                  <p className="text-sm text-slate-500">
                    View public audit page
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Limit Reached - Upgrade Dialog */}
      {limitError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                Audit Limit Reached
              </CardTitle>
              <CardDescription>
                {limitError.limitType === "weekly"
                  ? "You've used all your weekly positioning audits"
                  : "You've used all your monthly positioning audits"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white border rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {limitError.used}
                  </div>
                  <div className="text-xs text-slate-500">Used</div>
                </div>
                <div className="text-center p-3 bg-white border rounded-lg">
                  <div className="text-3xl font-bold text-slate-900">
                    {limitError.limit}
                  </div>
                  <div className="text-xs text-slate-500">Limit</div>
                </div>
              </div>

              {limitError.limitType === "weekly" && limitError.resetAt && (
                <div className="text-center text-sm text-slate-600">
                  Weekly limit resets on{" "}
                  {new Date(limitError.resetAt).toLocaleDateString()}
                </div>
              )}

              <div className="p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Upgrade to Founder Plan
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>5 positioning audits per week</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>15 audits per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Advanced analytics</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-2 text-orange-700 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Only $49/month - Cancel anytime</span>
              </div>
            </CardContent>
            <div className="flex gap-3 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setLimitError(null);
                }}
              >
                Maybe Later
              </Button>
              <Link href="/dashboard/subscription" className="flex-1">
                <Button className="w-full bg-orange-600 text-white hover:bg-orange-700">
                  Upgrade to Founder
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Cache Warning Dialog */}
      {showCacheWarning && cachedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                Recent Report Found
              </CardTitle>
              <CardDescription>
                A positioning audit for this URL was already run recently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-3">
                  <strong>Why are we showing this?</strong>
                  <br />
                  To ensure consistent and reliable scores, we cache audit
                  results for 30 days. Running multiple audits on the same
                  website can produce varying scores due to AI analysis
                  differences, which undermines trust in the system.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white border rounded-lg">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(cachedReport.overallScore)}`}
                  >
                    {cachedReport.overallScore}
                  </div>
                  <div className="text-xs text-slate-500">Score</div>
                </div>
                <div className="text-center p-3 bg-white border rounded-lg">
                  <div className="text-lg font-semibold text-slate-900">
                    {cachedReport.positioningBand}
                  </div>
                  <div className="text-xs text-slate-500">Positioning</div>
                </div>
              </div>

              <div className="text-center text-sm text-slate-600">
                Report generated {formatDate(cachedReport.createdAt)}(
                {cachedReport.cacheAge} days ago)
              </div>
            </CardContent>
            <div className="flex gap-3 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCacheWarning(false);
                  setCachedReport(null);
                  router.push(
                    `/dashboard/${productId}/audit/positioning/reports/${cachedReport._id}`,
                  );
                }}
              >
                View Existing Report
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCacheWarning(false);
                  setCachedReport(null);
                  setForceAudit(true);
                  handleRunAudit(true);
                }}
              >
                Force New Audit
              </Button>
            </div>
            <div className="px-6 pb-6">
              <p className="text-xs text-center text-slate-500">
                ⚠️ Force new audit only if the website has significantly changed
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
