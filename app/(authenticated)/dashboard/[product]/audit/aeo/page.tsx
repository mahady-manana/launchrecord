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
  Bot,
  Brain,
  CheckCircle,
  Clock,
  Cpu,
  Eye,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AEOReport {
  _id: string;
  url: string;
  score: number;
  maxScore: number;
  checks: Array<{ passed: boolean; score: number }>;
  createdAt: string;
  cacheAge?: number;
  fromCache?: boolean;
}

export default function AEOAuditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const { selectedProduct } = useProductStore();

  const [url, setUrl] = useState(selectedProduct?.website || "");
  const [isRunning, setIsRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState("");
  const [reports, setReports] = useState<AEOReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [showCacheWarning, setShowCacheWarning] = useState(false);
  const [cachedReport, setCachedReport] = useState<AEOReport | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, [productId]);

  const loadReports = async () => {
    try {
      setIsLoadingReports(true);
      const response = await fetch(
        `/api/aeo-reports?productId=${productId}&page=1&limit=5`,
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
    setIsRunning(true);
    setAuditProgress("Checking for existing reports...");

    try {
      const websiteUrl = url.startsWith("http") ? url : `https://${url}`;

      // Call API endpoint which handles database operations and caching
      const response = await fetch("/api/aeo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: websiteUrl,
          productId: selectedProduct?.id,
          saveToDb: true,
          force: force,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Audit failed");
      }

      const result = await response.json();

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
        "aeoAuditResult",
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
            `/dashboard/${productId}/audit/aeo/reports/${result._id}`,
          );
        } else {
          router.push(`/dashboard/${productId}/audit/aeo/reports`);
        }
      }, 1000);
    } catch (error) {
      console.error("AEO Audit failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Audit failed. Please try again.";
      setAuditError(errorMessage);
      setAuditProgress("");
      setTimeout(() => {
        setIsRunning(false);
      }, 500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - Cyan/Blue gradient theme */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">AEO Audit</h1>
            <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
              <Bot className="h-3 w-3 mr-1" />
              AI Visibility
            </Badge>
          </div>
          <p className="text-slate-500">
            {selectedProduct?.website
              ? "Audit any page for AI engine visibility"
              : "Are AI engines recommending you?"}
          </p>
        </div>
      </div>

      {/* URL Input Section */}
      <Card className="border-cyan-200 bg-cyan-50/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Search className="h-5 w-5 text-cyan-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-900">
                  Audit Any Page on Your Website
                </h3>
                <p className="text-sm text-cyan-700">
                  Enter any URL from your website to analyze how AI engines like
                  ChatGPT, Claude, and Gemini perceive and recommend that
                  specific page.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to audit (e.g., https://example.com)"
                className="flex h-10 w-96 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isRunning}
              />
              <Button
                onClick={() => handleRunAudit()}
                disabled={isRunning || !url.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {auditProgress}
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Run AEO Audit
                  </>
                )}
              </Button>
            </div>
          </div>
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

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-600" />
                Recent Reports
              </CardTitle>
              <CardDescription>Your latest AEO audit results</CardDescription>
            </div>
            {reports.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/${productId}/audit/aeo/reports`)
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
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-cyan-100 rounded-full">
                  <Bot className="h-8 w-8 text-cyan-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Reports Yet
              </h3>
              <p className="text-slate-500 mb-4">
                Run your first AEO audit to see results here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/${productId}/audit/aeo/reports/${report._id}`,
                    )
                  }
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(report.score)}`}
                    >
                      {report.score}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={
                            report.score >= 70
                              ? "bg-green-100 text-green-700 border-green-200"
                              : report.score >= 50
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                : "bg-red-100 text-red-700 border-red-200"
                          }
                        >
                          {report.score >= 70
                            ? "Good"
                            : report.score >= 50
                              ? "Moderate"
                              : "Needs Work"}
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

      {/* Hero - AI/Technology theme */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Bot className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                AI Engine Visibility Audit
              </h2>
              <p className="text-cyan-100">
                Powered by SIO-V5 engine. Comprehensive analysis across ChatGPT,
                Claude, Gemini, and emerging LLMs.
              </p>
            </div>
          </div>

          {/* AI engines visual */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold">ChatGPT</div>
              <div className="text-xs text-cyan-100">OpenAI</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold">Claude</div>
              <div className="text-xs text-cyan-100">Anthropic</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <div className="h-12 w-12 mx-auto mb-2 rounded-lg bg-white/20 flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold">Gemini</div>
              <div className="text-xs text-cyan-100">Google</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-cyan-100">AI Metrics</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">3+</div>
              <div className="text-sm text-cyan-100">AI Engines</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">2-3 min</div>
              <div className="text-sm text-cyan-100">Analysis Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* What This Audit Measures - From public page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-cyan-600" />
            What This Audit Measures
          </CardTitle>
          <CardDescription>
            Six critical dimensions of AI visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Bot className="h-5 w-5" />,
                title: "AI Engine Optimization",
                desc: "Ensure your startup appears in AI-generated responses from ChatGPT, Claude, Gemini, and emerging LLMs.",
              },
              {
                icon: <Search className="h-5 w-5" />,
                title: "Answer Engine Visibility",
                desc: "Optimize for zero-click searches and AI answer boxes that dominate modern search results.",
              },
              {
                icon: <Brain className="h-5 w-5" />,
                title: "Semantic Authority",
                desc: "Build topical authority and semantic relevance that AI engines recognize and trust.",
              },
              {
                icon: <Eye className="h-5 w-5" />,
                title: "Entity Recognition",
                desc: "Strengthen your brand entity signals across knowledge graphs and AI training datasets.",
              },
              {
                icon: <Zap className="h-5 w-5" />,
                title: "Defensibility Score",
                desc: "Measure how difficult it would be for AI to replace or commoditize your value proposition.",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Competitive Gap Analysis",
                desc: "Identify where competitors are winning AI visibility and how to reclaim your position.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-cyan-300 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
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

      {/* How The Audit Works - From public page */}
      <Card>
        <CardHeader>
          <CardTitle>How The Audit Works</CardTitle>
          <CardDescription>Four-step SIO-V5 analysis process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                number: "01",
                title: "Submit Your URL",
                desc: "Enter your startup's website and we'll begin comprehensive analysis across multiple AI engines.",
              },
              {
                number: "02",
                title: "AI Engine Scanning",
                desc: "Our SIO-V5 engine queries major LLMs and answer engines to assess your visibility and positioning.",
              },
              {
                number: "03",
                title: "Defensibility Audit",
                desc: "Analyze your semantic authority, entity strength, and competitive differentiation signals.",
              },
              {
                number: "04",
                title: "Strategic War Briefing",
                desc: "Receive your AI visibility score, competitive gap analysis, and prioritized action items.",
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Benefits - From public page */}
      <Card className="border-cyan-200 bg-cyan-50">
        <CardHeader>
          <CardTitle className="text-cyan-900 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            What You'll Get
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3">
            {[
              "Discover if AI engines can find and recommend your startup",
              "Get actionable recommendations to improve AI visibility",
              "Understand your semantic positioning in the AI landscape",
              "Benchmark against 10,000+ startups in our SIO-V5 database",
              "Receive a prioritized roadmap for AEO improvements",
              "Future-proof your startup against AI-driven commoditization",
            ].map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <span className="text-cyan-800">{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Stats Banner - From public page */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-1">50%</div>
            <div className="text-sm text-slate-300">
              Searches end with AI answers
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-1">74%</div>
            <div className="text-sm text-slate-300">
              Trust AI recommendations
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-400 mb-1">3x</div>
            <div className="text-sm text-slate-300">Higher conversion rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400 mb-1">60%</div>
            <div className="text-sm text-slate-300">Gen Z starts with AI</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <Link href="/aeo-audit" target="_blank">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Public AEO Audit</h4>
                  <p className="text-sm text-slate-500">View public version</p>
                </div>
                <Button variant="outline" size="sm">
                  Open
                </Button>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Link href="/sio-v5-engine">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">SIO-V5 Engine</h4>
                  <p className="text-sm text-slate-500">Learn about our AI</p>
                </div>
                <Button variant="outline" size="sm">
                  Learn
                </Button>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Cache Warning Dialog */}
      {showCacheWarning && cachedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-cyan-100 rounded-full">
                  <Bot className="h-6 w-6 text-cyan-600" />
                </div>
                Recent Report Found
              </CardTitle>
              <CardDescription>
                An AEO audit for this URL was already run recently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <p className="text-sm text-cyan-800 mb-3">
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
                    className={`text-3xl font-bold ${getScoreColor(cachedReport.score)}`}
                  >
                    {cachedReport.score}
                  </div>
                  <div className="text-xs text-slate-500">Score</div>
                </div>
                <div className="text-center p-3 bg-white border rounded-lg">
                  <div className="text-lg font-semibold text-slate-900">
                    {cachedReport.score >= 70
                      ? "Good"
                      : cachedReport.score >= 50
                        ? "Moderate"
                        : "Needs Work"}
                  </div>
                  <div className="text-xs text-slate-500">Rating</div>
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
                    `/dashboard/${productId}/audit/aeo/reports/${cachedReport._id}`,
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
