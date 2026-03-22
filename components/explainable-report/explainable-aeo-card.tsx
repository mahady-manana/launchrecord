"use client";

import { ExplainableReportCard } from "@/components/explainable-report";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Globe } from "lucide-react";

interface ExplainableAEOCardProps {
  report: AuditReportV1;
  productId: string;
}

export function ExplainableAEOCard({ report, productId }: ExplainableAEOCardProps) {
  return (
    <ExplainableReportCard
      title="AEO (Answer Engine Optimization)"
      description="Optimize your content to be the answer AI assistants and search engines provide"
      score={report.aeo_index.score}
      scoreLabel="AEO Score"
      band={report.aeo_index.search_visibility_risk}
      
      whatContent="AEO (Answer Engine Optimization) measures how well your content is optimized to be selected by AI-powered search engines like ChatGPT, Google SGE, and Perplexity as the direct answer to user queries. Unlike traditional SEO which aims for high rankings, AEO aims to BE the answer."
      
      whyContent="With the rise of AI search, users increasingly expect direct answers rather than lists of links. Good AEO means your content is selected as that answer, driving qualified traffic and establishing authority. Poor AEO means invisibility in the fastest-growing search channel."
      
      howContent="Analyze your AEO score by reviewing: (1) Schema markup presence and quality, (2) How directly your content answers common questions, (3) Content structure for AI parsing, and (4) Technical SEO foundation. Click on individual audit items for specific improvements."
      
      howExamples={[
        "Add Organization and Product schema markup to your homepage",
        "Create FAQ sections that directly answer customer questions in 40-60 words",
        "Structure content with clear heading hierarchy (H1 → H2 → H3)",
        "Use bullet points and short paragraphs for AI-friendly formatting"
      ]}
      
      audit={report.aeo_index.audit}
      actionsTitle="Priority AEO Actions"
      icon={<Globe className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/aeo`}
    />
  );
}
