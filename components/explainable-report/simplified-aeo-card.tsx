"use client";

import { SimplifiedReportCard } from "./simplified-report-card";
import { GradeSummary } from "./grade-summary";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SimplifiedAEOCardProps {
  report: AuditReportV1;
  productId: string;
}

export function SimplifiedAEOCard({ report, productId }: SimplifiedAEOCardProps) {
  return (
    <div className="space-y-4">
      <SimplifiedReportCard
        title="AEO (Answer Engine Optimization)"
        description="Optimize your content to be the answer AI assistants provide"
        score={report.aeo_index.score}
        band={report.aeo_index.search_visibility_risk}
        
        explanation="AEO measures how well your content is optimized to be selected by AI-powered search engines (ChatGPT, Google SGE, Perplexity) as the direct answer to user queries. Unlike traditional SEO which aims for high rankings, AEO aims to BE the answer."
        
        audit={report.aeo_index.audit}
        icon={<Globe className="h-5 w-5" />}
        guidanceLink={`/dashboard/${productId}/guidance/aeo`}
      />
      
      <GradeSummary score={report.aeo_index.score} pillarType="aeo" />
    </div>
  );
}
