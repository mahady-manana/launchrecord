"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle, Info, TrendingUp, AlertCircle } from "lucide-react";

interface GradeSummaryProps {
  score: number;
  pillarType: "aeo" | "positioning" | "clarity" | "momentum" | "proof";
}

// Static summaries for each grade level by pillar type
const gradeSummaries = {
  aeo: {
    excellent: {
      label: "Excellent",
      range: "90-100",
      summary: "Your content is well-optimized for AI search engines. You're likely to be selected as a direct answer.",
      color: "text-green-700 bg-green-50 border-green-200",
    },
    good: {
      label: "Good",
      range: "70-89",
      summary: "Strong AEO foundation. Minor improvements could increase your AI search visibility.",
      color: "text-lime-700 bg-lime-50 border-lime-200",
    },
    needsWork: {
      label: "Needs Work",
      range: "40-69",
      summary: "Basic optimization present but significant gaps limit your AI search performance.",
      color: "text-orange-700 bg-orange-50 border-orange-200",
    },
    critical: {
      label: "Critical",
      range: "0-39",
      summary: "Poor AEO optimization. You're likely invisible in AI-powered search results.",
      color: "text-red-700 bg-red-50 border-red-200",
    },
  },
  positioning: {
    excellent: {
      label: "Dominant",
      range: "90-100",
      summary: "Crystal-clear positioning. You're perceived as the category leader or innovator.",
      color: "text-green-700 bg-green-50 border-green-200",
    },
    good: {
      label: "Strong",
      range: "70-89",
      summary: "Clear differentiation. You stand out well from most competitors.",
      color: "text-lime-700 bg-lime-50 border-lime-200",
    },
    needsWork: {
      label: "Blended",
      range: "40-69",
      summary: "Some unique elements but you share similarities with competitors. Room to sharpen.",
      color: "text-orange-700 bg-orange-50 border-orange-200",
    },
    critical: {
      label: "Weak/Ghost",
      range: "0-39",
      summary: "Unclear or no differentiation. You're easily replaceable or invisible.",
      color: "text-red-700 bg-red-50 border-red-200",
    },
  },
  clarity: {
    excellent: {
      label: "Instant",
      range: "90-100",
      summary: "Visitors understand your value in under 3 seconds. Zero cognitive load.",
      color: "text-green-700 bg-green-50 border-green-200",
    },
    good: {
      label: "Clear",
      range: "70-89",
      summary: "Quick to understand (3-7 seconds). Minimal scanning required.",
      color: "text-lime-700 bg-lime-50 border-lime-200",
    },
    needsWork: {
      label: "Average/Confusing",
      range: "40-69",
      summary: "Requires 7-30 seconds to understand. Visitors may leave before 'getting it'.",
      color: "text-orange-700 bg-orange-50 border-orange-200",
    },
    critical: {
      label: "Opaque",
      range: "0-39",
      summary: "Visitors leave without understanding what you do. High bounce rate likely.",
      color: "text-red-700 bg-red-50 border-red-200",
    },
  },
  momentum: {
    excellent: {
      label: "Viral",
      range: "90-100",
      summary: "Overwhelming evidence of rapid adoption. Strong market enthusiasm visible.",
      color: "text-green-700 bg-green-50 border-green-200",
    },
    good: {
      label: "Rising",
      range: "70-89",
      summary: "Clear upward trajectory. Strong growth indicators and positive reception.",
      color: "text-lime-700 bg-lime-50 border-lime-200",
    },
    needsWork: {
      label: "Stable/Flat",
      range: "40-69",
      summary: "Minimal visible activity. Established but not exciting, or little growth evidence.",
      color: "text-orange-700 bg-orange-50 border-orange-200",
    },
    critical: {
      label: "Dead",
      range: "0-39",
      summary: "No momentum signals. Appears inactive or failing to prospects.",
      color: "text-red-700 bg-red-50 border-red-200",
    },
  },
  proof: {
    excellent: {
      label: "Comprehensive",
      range: "90-100",
      summary: "Extensive evidence across all types. Trust is strongly established.",
      color: "text-green-700 bg-green-50 border-green-200",
    },
    good: {
      label: "Strong",
      range: "70-89",
      summary: "Good variety of proof. Most trust concerns are addressed.",
      color: "text-lime-700 bg-lime-50 border-lime-200",
    },
    needsWork: {
      label: "Limited",
      range: "40-69",
      summary: "Some proof present but gaps exist. Trust building is incomplete.",
      color: "text-orange-700 bg-orange-50 border-orange-200",
    },
    critical: {
      label: "Weak",
      range: "0-39",
      summary: "Little to no visible proof. High trust deficit with prospects.",
      color: "text-red-700 bg-red-50 border-red-200",
    },
  },
};

export function GradeSummary({ score, pillarType }: GradeSummaryProps) {
  const getGrade = (score: number) => {
    if (score >= 90) return "excellent";
    if (score >= 70) return "good";
    if (score >= 40) return "needsWork";
    return "critical";
  };

  const grade = getGrade(score);
  const summary = gradeSummaries[pillarType][grade as keyof typeof gradeSummaries["aeo"]];

  return (
    <Card className={cn("border-2", summary.color)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">
            {grade === "excellent" || grade === "good" ? (
              <CheckCircle className="h-5 w-5" />
            ) : grade === "needsWork" ? (
              <Info className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{summary.label}</span>
              <Badge variant="outline" className="text-xs">
                {summary.range}
              </Badge>
            </div>
            <p className="text-sm opacity-90">{summary.summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
