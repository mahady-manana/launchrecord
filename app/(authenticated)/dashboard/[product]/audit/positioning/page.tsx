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
import { runStandalonePositioningAudit } from "@/services/positioning-audit";
import { useProductStore } from "@/stores/product-store";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  ExternalLink,
  Layers,
  Loader2,
  Search,
  Shield,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PositioningAuditPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.product as string;
  const { selectedProduct } = useProductStore();

  const [url, setUrl] = useState(selectedProduct?.website || "");
  const [isRunning, setIsRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState("");

  const handleRunAudit = async () => {
    if (!url.trim()) {
      alert("Please enter a URL to audit");
      return;
    }

    setIsRunning(true);
    setAuditProgress("Analyzing category ownership...");

    try {
      const websiteUrl = url.startsWith("http") ? url : `https://${url}`;

      setAuditProgress("Fetching website content...");

      const result = await runStandalonePositioningAudit({
        url: websiteUrl,
        timeout: 60000,
      });

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

      setTimeout(() => {
        setIsRunning(false);
        setAuditProgress("");
        // Redirect to reports page
        router.push(`/dashboard/${productId}/audit/positioning/reports`);
      }, 1000);
    } catch (error) {
      console.error("Positioning Audit failed:", error);
      setAuditProgress("Audit failed. Please try again.");
      setTimeout(() => {
        setIsRunning(false);
        setAuditProgress("");
      }, 2000);
    }
  };

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
                onClick={handleRunAudit}
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
    </div>
  );
}
