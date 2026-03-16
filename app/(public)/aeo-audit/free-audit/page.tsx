"use client";

import { Button } from "@/components/ui/button";
import type { AEOAuditResult } from "@/services/aeo-audit/types";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const auditChecklist = [
  { id: "crawlability", name: "Crawlability", description: "AI bot access via robots.txt and sitemap" },
  { id: "schema_jsonld", name: "Structured Data", description: "JSON-LD schema markup" },
  { id: "answer_blocks", name: "Answer Blocks", description: "Headings, paragraphs, and lists" },
  { id: "topic_authority", name: "Topic Authority", description: "Internal links and cluster structure" },
  { id: "entities_relations", name: "Entities", description: "Core entities and relationships" },
  { id: "citation_author", name: "Citations", description: "Author info and references" },
  { id: "clarity_structure", name: "Clarity", description: "Bullets, tables, minimal fluff" },
  { id: "freshness", name: "Freshness", description: "Last-modified signals" },
  { id: "external_mentions", name: "External Mentions", description: "Third-party mentions" },
  { id: "featured_snippet", name: "Featured Snippet", description: "Snippet-friendly content" },
  { id: "answer_depth", name: "Answer Depth", description: "Rationale and context" },
  { id: "ai_retrieval_vector", name: "AI Retrieval", description: "Structured content for vectors" },
  { id: "keywords_semantic", name: "Semantic Keywords", description: "LSI and NLP entities" },
  { id: "tech_perf_cwv", name: "Performance", description: "Core Web Vitals and mobile" },
  { id: "multimodal", name: "Multimodal", description: "Images with alt text" },
  { id: "trust_security", name: "Trust", description: "HTTPS and compliance" },
  { id: "uniqueness", name: "Uniqueness", description: "Original content and research" },
];

export default function FreeAuditResultPage() {
  const [result, setResult] = useState<AEOAuditResult | null>(null);
  const [url, setUrl] = useState("");
  const [expandedChecks, setExpandedChecks] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    if (urlParam) {
      setUrl(urlParam);
    }

    const stored = sessionStorage.getItem("freeAuditResult");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setResult(parsed);
      } catch (error) {
        console.error("Failed to parse audit result:", error);
      }
    }
  }, []);

  const toggleCheck = (checkId: string) => {
    setExpandedChecks((prev) => ({
      ...prev,
      [checkId]: !prev[checkId],
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-100 border-green-300";
    if (score >= 40) return "bg-amber-100 border-amber-300";
    return "bg-red-100 border-red-300";
  };

  const getPassedIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getChecklistItem = (id: string) => {
    return auditChecklist.find((item) => item.id === id);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading audit results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/aeo-audit">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Audit
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>{new Date(result.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">
              Technical Audit Results
            </h1>
            <p className="text-slate-600">
              Website:{" "}
              <span className="font-mono bg-slate-100 px-2 py-1 rounded">
                {url}
              </span>
            </p>
          </div>

          {/* Overall Score */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            <div
              className={`rounded-xl p-6 border-2 ${getScoreBg(result.score)} text-center space-y-2`}
            >
              <p className="text-sm font-medium text-slate-600">Overall Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}
                <span className="text-2xl text-slate-400">/100</span>
              </p>
            </div>

            <div className="rounded-xl p-6 border-2 border-slate-200 bg-slate-50 space-y-2">
              <p className="text-sm font-medium text-slate-600">Checks Passed</p>
              <p className="text-4xl font-bold text-slate-800">
                {result.checks.filter((c: any) => c.passed).length}
                <span className="text-lg text-slate-400">
                  /{result.checks.length}
                </span>
              </p>
            </div>

            <div className="rounded-xl p-6 border-2 border-slate-200 bg-slate-50 space-y-2">
              <p className="text-sm font-medium text-slate-600">Audit Type</p>
              <p className="text-xl font-semibold text-slate-800">
                Technical & Implementation
              </p>
              <p className="text-sm text-slate-500">Free • No signup required</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-800">
                This is a Technical-Only Audit
              </h3>
              <p className="text-amber-700 leading-relaxed">
                AEO is complex and involves many factors beyond technical
                implementation. This audit only checks your website&apos;s
                technical readiness for AI crawlers. It does not analyze your
                actual presence in AI engines (ChatGPT, Claude, Gemini), semantic
                authority, external mentions, or competitive positioning.
              </p>
              <Link href="/survey/audit">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white mt-2">
                  Get Complete AI-Powered Audit
                  <TrendingUp className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Checklist Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            AEO Checklist Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {auditChecklist.map((item) => {
              const checkResult = result.checks.find((c: any) => c.id === item.id);
              const passed = checkResult?.passed || false;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    passed
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  {passed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  )}
                  <span className="text-xs font-medium text-slate-700">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Checks */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Detailed Analysis
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Click on each check to see evidence and recommendations
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {result.checks.map((check: any) => {
              const checklistItem = getChecklistItem(check.id);
              return (
                <div key={check.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <button
                    onClick={() => toggleCheck(check.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        {getPassedIcon(check.passed)}
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {checklistItem?.name || check.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {checklistItem?.description || check.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(check.score)}`}>
                          {check.score}
                          <span className="text-sm text-slate-400 font-normal">/{check.maxScore}</span>
                        </p>
                      </div>
                      {expandedChecks[check.id] ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {expandedChecks[check.id] && (
                    <div className="mt-4 ml-12 space-y-4 animate-in slide-in-from-top-2">
                      {/* Score Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Score</span>
                          <span className="font-medium text-slate-800">
                            {Math.round((check.score / check.maxScore) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              check.passed
                                ? "bg-green-500"
                                : check.score > 0
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${(check.score / check.maxScore) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Evidence */}
                      {check.evidence && check.evidence.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                          <p className="font-medium text-green-800 text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Evidence Found
                          </p>
                          <ul className="space-y-1">
                            {check.evidence.map((item: any, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm text-green-700 flex items-start gap-2"
                              >
                                <span className="text-green-500 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {check.recommendations && check.recommendations.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                          <p className="font-medium text-amber-800 text-sm flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Recommendations
                          </p>
                          <ul className="space-y-1">
                            {check.recommendations.map((item: any, idx: number) => (
                              <li
                                key={idx}
                                className="text-sm text-amber-700 flex items-start gap-2"
                              >
                                <span className="text-amber-500 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-8 text-white space-y-4 text-center">
          <h2 className="text-2xl font-bold">Want the Complete Picture?</h2>
          <p className="text-orange-100 max-w-2xl mx-auto">
            Upgrade to Advanced Audit with AI to analyze your actual presence in
            ChatGPT, Claude, and Gemini, plus get prioritized recommendations
            and competitive insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/survey/audit">
              <Button className="h-12 px-8 bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                Get Advanced AI Audit
                <TrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-12 px-8 border-white text-white hover:bg-white/10"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4 mr-2" />
              Save as PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
