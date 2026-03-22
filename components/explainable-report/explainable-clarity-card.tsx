"use client";

import { ExplainableReportCard } from "@/components/explainable-report";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Zap } from "lucide-react";

interface ExplainableClarityCardProps {
  report: AuditReportV1;
  productId: string;
}

export function ExplainableClarityCard({ report, productId }: ExplainableClarityCardProps) {
  return (
    <ExplainableReportCard
      title="Clarity Velocity"
      description="How quickly visitors understand your value proposition"
      score={report.clarity_velocity.score}
      scoreLabel="Clarity Score"
      band={report.clarity_velocity.band}
      
      whatContent="Clarity Velocity measures how quickly (in seconds) a visitor understands what you offer, who it's for, and why they should care. High clarity velocity means visitors 'get it' almost instantly—typically within 3-5 seconds of landing on your page."
      
      whyContent="Attention is scarce online. If visitors don't understand your value within seconds, they're gone—often permanently. High clarity reduces bounce rates, increases conversions, and qualifies leads. Low clarity wastes ad spend and kills growth."
      
      howContent="Assess your clarity by testing: (1) Headline clarity—does your H1 immediately communicate value?, (2) Subheadline support—does it reinforce without confusing?, (3) Visual hierarchy—is important information prominent?, (4) Jargon density—are you using customer language or industry speak?"
      
      howExamples={[
        "Replace feature-focused headlines with outcome-focused ones",
        "Use the 5-second test: show your page for 5 seconds, ask what you offer",
        "Eliminate jargon: 'B2B SaaS' → 'Software for businesses'",
        "Lead with the inverted pyramid: most important info first"
      ]}
      
      audit={report.clarity_velocity.audit}
      actionsTitle="Priority Clarity Actions"
      icon={<Zap className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/clarity`}
    />
  );
}
