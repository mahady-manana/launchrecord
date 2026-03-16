"use client";

import { Button } from "@/components/ui/button";
import { AEO_AUDIT_CHECKLIST } from "@/components/aeo-audit/audit-checklist";
import { AuditCheckDetail } from "@/components/aeo-audit/audit-check-detail";
import type { AEOAuditResult } from "@/services/aeo-audit/types";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FreeAuditResultPage() {
  const [result, setResult] = useState<AEOAuditResult | null>(null);
  const [url, setUrl] = useState("");

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
              className={`rounded-xl p-6 border-2 ${
                result.score >= 70
                  ? "bg-green-100 border-green-300"
                  : result.score >= 40
                  ? "bg-amber-100 border-amber-300"
                  : "bg-red-100 border-red-300"
              } text-center space-y-2`}
            >
              <p className="text-sm font-medium text-slate-600">
                Overall Score
              </p>
              <p
                className={`text-5xl font-bold ${
                  result.score >= 70
                    ? "text-green-600"
                    : result.score >= 40
                    ? "text-amber-600"
                    : "text-red-600"
                }`}
              >
                {result.score}
                <span className="text-2xl text-slate-400">/100</span>
              </p>
            </div>

            <div className="rounded-xl p-6 border-2 border-slate-200 bg-slate-50 space-y-2">
              <p className="text-sm font-medium text-slate-600">
                Checks Passed
              </p>
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
              <p className="text-sm text-slate-500">
                Free • No signup required
              </p>
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
                actual presence in AI engines (ChatGPT, Claude, Gemini),
                semantic authority, external mentions, or competitive
                positioning.
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
            {AEO_AUDIT_CHECKLIST.map((item) => {
              const checkResult = result.checks.find(
                (c: any) => c.id === item.id,
              );
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
              const checklistItem = AEO_AUDIT_CHECKLIST.find((item) => item.id === check.id);
              return (
                <AuditCheckDetail
                  key={check.id}
                  check={check}
                  checklistName={checklistItem?.name}
                  checklistDescription={checklistItem?.description}
                />
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
