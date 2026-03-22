"use client";

import { AuditReportV1 } from "@/types/audit-report-v1";
import { Globe } from "lucide-react";
import { EnhancedPillarCard } from "./enhanced-pillar-card";

interface AEOCardProps {
  report: AuditReportV1;
  productId: string;
  fullAuditLink?: string;
}

export function AEOCard({ report, productId, fullAuditLink }: AEOCardProps) {
  const score = report.aeo_index.score;

  const getGradeInfo = () => {
    if (score >= 90)
      return {
        label: "Excellent",
        range: "90-100",
        whatItMeans:
          "Your content is optimized to be AI's first choice. You're capturing search traffic competitors can't reach.",
        marketReality: "AI search is the fastest-growing channel",
        priority: [
          "Refresh content quarterly",
          "Monitor emerging AI platforms",
          "Maintain schema markup",
        ],
        icon: "check" as const,
      };
    if (score >= 70)
      return {
        label: "Good",
        range: "70-89",
        whatItMeans:
          "Strong AEO foundation with room to dominate. You're visible but not yet the default answer.",
        marketReality: "AI search will represent 50%+ of queries by 2026",
        priority: [
          "Add schema markup",
          "Create direct-answer sections (40-60 words)",
          "Structure content for AI parsing",
        ],
        icon: "check" as const,
      };
    if (score >= 40)
      return {
        label: "Needs Work",
        range: "40-69",
        whatItMeans:
          "Basic optimization present but significant gaps limit visibility. Competitors optimizing now will own AI search results for years.",
        marketReality:
          "Every week without optimization is permanent market share loss",
        priority: [
          "Implement Organization/Product schema",
          "Rewrite content to answer questions directly",
          "Use clear heading hierarchy (H1→H2→H3)",
        ],
        icon: "info" as const,
      };
    return {
      label: "Critical",
      range: "0-39",
      whatItMeans:
        "Poor AEO optimization means invisibility in AI-powered search.",
      marketReality: "AI search growing 10x faster than traditional search",
      priority: [
        "Add schema markup immediately",
        "Create FAQ sections",
        "Structure every page to answer one clear question",
        "Start with homepage optimization",
      ],
      icon: "alert" as const,
    };
  };

  return (
    <EnhancedPillarCard
      title="AEO (Answer Engine Optimization)"
      description="Be the answer AI assistants provide"
      score={score}
      band={report.aeo_index.search_visibility_risk}
      explanation="AEO measures how well your content is optimized to be selected by AI-powered search engines (ChatGPT, Google SGE, Perplexity) as the direct answer. Unlike SEO which aims for rankings, AEO aims to BE the answer."
      audit={report.aeo_index.audit}
      icon={<Globe className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/aeo`}
      fullAuditLink={fullAuditLink}
      gradeInfo={getGradeInfo()}
    />
  );
}
