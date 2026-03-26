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
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Clock,
  Eye,
  Layout,
  Loader2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ClarityReport {
  _id: string;
  url: string;
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  fiveSecondTest: {
    passes: boolean;
    timeToUnderstand: number;
  };
  createdAt: string;
  cacheAge?: number;
  fromCache?: boolean;
}

interface UsageInfo {
  clarityAuditsUsed: number;
  clarityAuditsLimit: number;
  clarityWeeklyAuditUsed: number;
  clarityWeeklyAuditLimit: number;
  resetAt: string;
}

interface LimitError {
  limitReached: true;
  limitType: "monthly" | "weekly";
  used: number;
  limit: number;
  resetAt?: string;
}

export default function ClarityAuditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedProduct } = useProductStore();
  const productId = params.product as string;

  const [url, setUrl] = useState(selectedProduct?.website || "");
  const [isRunning, setIsRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState("");
  const [reports, setReports] = useState<ClarityReport[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [showCacheWarning, setShowCacheWarning] = useState(false);
  const [cachedReport, setCachedReport] = useState<ClarityReport | null>(null);
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
        `/api/clarity-reports?productId=${productId}&page=1&limit=5`,
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
    const colors: Record<string, string> = {
      instant: "bg-green-100 text-green-700 border-green-200",
      clear: "bg-lime-100 text-lime-700 border-lime-200",
      average: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confusing: "bg-orange-100 text-orange-700 border-orange-200",
      opaque: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[band] || colors.average;
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
    setAuditProgress("Running clarity audit...");

    try {
      const websiteUrl = url.startsWith("http") ? url : `https://${url}`;

      const response = await fetch("/api/clarity-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: websiteUrl,
          productId: selectedProduct?.id || productId,
          saveToDb: true,
          force: force,
          name: selectedProduct?.name,
          tagline: selectedProduct?.tagline || "",
          description: selectedProduct?.description || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 403 && errorData.limitReached) {
          setLimitError(errorData);
          throw new Error(errorData.error || "Audit limit reached");
        }

        throw new Error(errorData.message || "Audit failed");
      }

      const result = await response.json();

      if (result.usage) {
        setUsage(result.usage);
      }

      if (result.fromCache && !force) {
        setCachedReport(result);
        setShowCacheWarning(true);
        setIsRunning(false);
        setAuditProgress("");
        return;
      }

      setAuditProgress("Saving results...");

      sessionStorage.setItem(
        "clarityAuditResult",
        JSON.stringify({
          ...result,
          productId: selectedProduct?.id,
          productName: selectedProduct?.name,
        }),
      );

      setAuditProgress("Complete!");

      await loadReports();

      setTimeout(() => {
        setIsRunning(false);
        setAuditProgress("");
        if (result._id) {
          router.push(
            `/dashboard/${productId}/audit/clarity/reports/${result._id}`,
          );
        } else {
          router.push(`/dashboard/${productId}/audit/clarity/reports`);
        }
      }, 1000);
    } catch (error) {
      console.error("Clarity Audit failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Audit failed. Please try again.";

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

    // Check if we already ran autorun for this session
    const hasRunKey = `clarity_autorun_${productId}`;
    const hasRun = sessionStorage.getItem(hasRunKey);
    if (hasRun) return;

    if (!url.trim()) return;

    // Mark as run so it doesn't run again on back/navigation
    sessionStorage.setItem(hasRunKey, "true");
    handleRunAudit();
  }, [searchParams, url, productId]);

  return (
    <div className="space-y-8">
      {/* Header - Green gradient theme */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Product Clarity Audit</h1>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Clock className="h-3 w-3 mr-1" />
                5-Second Test
              </Badge>
            </div>
            <p className="text-slate-500">
              If they don't get it in 5 seconds, they're gone
            </p>
          </div>
        </div>
        <Button
          onClick={() => handleRunAudit()}
          disabled={isRunning || !url.trim()}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 relative"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {auditProgress}
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Test Clarity
            </>
          )}
        </Button>
      </div>

      {/* URL Input Section */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900">
                  Audit Any Page on Your Website
                </h3>
                <p className="text-sm text-green-700">
                  Enter any URL from your website to analyze clarity.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to audit (e.g., https://example.com)"
                className="flex h-10 w-96 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isRunning}
              />
              <Button
                onClick={() => handleRunAudit()}
                disabled={isRunning || !url.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {auditProgress}
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Run Clarity Audit
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-6 text-xs text-green-700">
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
                <span>Product pages</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Pricing pages</span>
              </div>
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

      {/* Usage Display */}
      {usage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Eye className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">
                    Clarity Audit Usage
                  </h3>
                  <p className="text-sm text-green-700">
                    {usage.clarityAuditsUsed} of {usage.clarityAuditsLimit} used
                    this month
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-green-700">Weekly Limit</div>
                  <div className="text-lg font-bold text-green-900">
                    {usage.clarityWeeklyAuditUsed} /{" "}
                    {usage.clarityWeeklyAuditLimit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-700">Monthly Limit</div>
                  <div className="text-lg font-bold text-green-900">
                    {usage.clarityAuditsUsed} / {usage.clarityAuditsLimit}
                  </div>
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
                <BarChart3 className="h-5 w-5 text-green-600" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Your latest clarity audit results
              </CardDescription>
            </div>
            {reports.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/${productId}/audit/clarity/reports`)
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
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Reports Yet
              </h3>
              <p className="text-slate-500 mb-4">
                Run your first clarity audit to see results here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/dashboard/${productId}/audit/clarity/reports/${report._id}`,
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
                        <Badge className={getBandColor(report.band)}>
                          {report.band}
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

      {/* Hero - 5-second countdown visual */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Eye className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">The 5-Second Rule</h2>
              <p className="text-green-100">
                Visitors decide in seconds whether to stay or leave. Your
                clarity determines conversion.
              </p>
            </div>
          </div>

          {/* Countdown visual */}
          <div className="flex items-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((sec) => (
              <div
                key={sec}
                className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-lg font-bold ${
                  sec <= 3
                    ? "bg-white text-green-600 border-white"
                    : "border-white/50 text-white/70"
                }`}
              >
                {sec}
              </div>
            ))}
            <span className="text-green-100 ml-2">seconds to impress</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">6</div>
              <div className="text-sm text-green-100">Clarity Signals</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">&lt;5s</div>
              <div className="text-sm text-green-100">Target Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-sm text-green-100">Clarity Levels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Clarity Levels - Timeline style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Clarity Levels
          </CardTitle>
          <CardDescription>
            How quickly do visitors understand your value?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                level: "Instant",
                time: "&lt;3 sec",
                desc: "Crystal clear value proposition",
                color: "bg-green-500",
              },
              {
                level: "Clear",
                time: "3-5 sec",
                desc: "Value understood quickly",
                color: "bg-emerald-500",
              },
              {
                level: "Average",
                time: "5-10 sec",
                desc: "Some friction exists",
                color: "bg-yellow-500",
              },
              {
                level: "Confusing",
                time: "10-20 sec",
                desc: "Visitors struggle",
                color: "bg-orange-500",
              },
              {
                level: "Opaque",
                time: "&gt;20 sec",
                desc: "Completely unclear",
                color: "bg-red-500",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-green-300 transition-colors"
              >
                <div
                  className={`h-12 w-12 ${item.color} rounded-lg flex items-center justify-center text-white font-bold`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{item.level}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.time}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What We Analyze */}
      <Card>
        <CardHeader>
          <CardTitle>Clarity Dimensions</CardTitle>
          <CardDescription>
            Six elements that determine instant understanding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: <MessageSquare className="h-5 w-5" />,
                label: "Headline Clarity",
                desc: "Instant headline comprehension",
              },
              {
                icon: <Eye className="h-5 w-5" />,
                label: "Visual Flow",
                desc: "Design guides attention",
              },
              {
                icon: <Layout className="h-5 w-5" />,
                label: "Value Hierarchy",
                desc: "Most important info visible",
              },
              {
                icon: <ArrowUpRight className="h-5 w-5" />,
                label: "Benefit Clarity",
                desc: "Outcomes clearly stated",
              },
              {
                icon: <CheckCircle className="h-5 w-5" />,
                label: "CTA Clarity",
                desc: "Next step is obvious",
              },
              {
                icon: <Clock className="h-5 w-5" />,
                label: "Speed",
                desc: "Fast load = clear message",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-green-50 border border-green-200"
              >
                <div className="text-green-600 mb-2">{item.icon}</div>
                <h4 className="font-semibold text-slate-900 mb-1">
                  {item.label}
                </h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Questions */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">Critical Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              "Can a stranger explain what you do after 5 seconds?",
              "Is your value proposition above the fold?",
              "Do you lead with benefits or features?",
              "Is the next step obvious and compelling?",
            ].map((question, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <span className="text-green-800">{question}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Link */}
      <Card>
        <CardContent className="pt-6">
          <Link href="/clarity-audit" target="_blank">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <ExternalLink className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Public Version</h4>
                <p className="text-sm text-slate-500">View public audit page</p>
              </div>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function ExternalLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
