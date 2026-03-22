"use client";

import { AuditReportV1 } from "@/types/audit-report-v1";
import { Zap } from "lucide-react";
import { EnhancedPillarCard } from "./enhanced-pillar-card";

interface ClarityCardProps {
  report: AuditReportV1;
  productId: string;
  fullAuditLink?: string;
}

export function ClarityCard({
  report,
  productId,
  fullAuditLink,
}: ClarityCardProps) {
  const score = report.clarity_velocity.score;

  const getGradeInfo = () => {
    if (score >= 90)
      return {
        label: "Instant",
        range: "90-100",
        whatItMeans:
          "Visitors understand your value in under 3 seconds. Your bounce rate is exceptional.",
        marketReality: "This clarity directly drives conversion",
        priority: [
          "Document your approach",
          "Apply to every new page",
          "Test new headlines against current winner",
        ],
        icon: "check" as const,
      };
    if (score >= 70)
      return {
        label: "Clear",
        range: "70-89",
        whatItMeans:
          "Most visitors understand quickly (3-7 seconds). You're converting well but leaving gains on the table.",
        marketReality: "Each second of delay costs 10-20% conversion",
        priority: [
          "Simplify headline to lead with outcome",
          "Remove jargon",
          "Front-load value proposition",
        ],
        icon: "check" as const,
      };
    if (score >= 40)
      return {
        label: "Confusing",
        range: "40-69",
        whatItMeans:
          "Visitors need 7-30 seconds to understand you. Most leave before 'getting it'—this is your bounce rate problem.",
        marketReality: "Attention is scarcer than ever",
        priority: [
          "Lead with what customers get, not what you have",
          "Replace features with outcomes",
          "Remove industry terms",
          "Make headline do all the work",
        ],
        icon: "info" as const,
      };
    return {
      label: "Opaque",
      range: "0-39",
      whatItMeans:
        "Visitors leave without understanding what you do. This is a conversion emergency.",
      marketReality: "You have 5 seconds maximum",
      priority: [
        "Rewrite headline: What do you offer? Who is it for? What outcome?",
        "Test on strangers",
        "If they can't repeat in 5 seconds, simplify further",
      ],
      icon: "alert" as const,
    };
  };

  return (
    <EnhancedPillarCard
      title="Clarity Velocity"
      description="Speed of understanding = conversion rate"
      score={score}
      band={report.clarity_velocity.band}
      explanation="Clarity measures how quickly (in seconds) visitors understand your value. High clarity means visitors 'get it' within 3-5 seconds—before they even think about leaving."
      audit={report.clarity_velocity.audit}
      icon={<Zap className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/clarity`}
      fullAuditLink={fullAuditLink}
      gradeInfo={getGradeInfo()}
    />
  );
}
