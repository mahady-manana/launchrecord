"use client";

import { AuditReportV1 } from "@/types/audit-report-v1";
import { TrendingUp } from "lucide-react";
import { EnhancedPillarCard } from "./enhanced-pillar-card";

interface MomentumCardProps {
  report: AuditReportV1;
  productId: string;
  fullAuditLink?: string;
}

export function MomentumCard({
  report,
  productId,
  fullAuditLink,
}: MomentumCardProps) {
  const score = report.momentum_signal.score;

  const getGradeInfo = () => {
    if (score >= 90)
      return {
        label: "Viral",
        range: "90-100",
        whatItMeans:
          "Overwhelming evidence of rapid adoption. The market is pulling you forward.",
        marketReality: "Momentum this strong compounds",
        priority: [
          "Amplify with regular updates",
          "Customer spotlights",
          "Milestone announcements",
          "Document growth story for press",
        ],
        icon: "check" as const,
      };
    if (score >= 70)
      return {
        label: "Rising",
        range: "70-89",
        whatItMeans:
          "Clear growth trajectory visible. Smart buyers notice and trust momentum.",
        marketReality: "Visible growth attracts 3x more inbound interest",
        priority: [
          "Add specific user counts",
          "Showcase customer logos prominently",
          "Publish case studies with metrics",
          "Announce updates monthly",
        ],
        icon: "check" as const,
      };
    if (score >= 40)
      return {
        label: "Flat",
        range: "40-69",
        whatItMeans:
          "Minimal visible activity. Prospects wonder if you're growing or stagnant.",
        marketReality: "Invisible growth doesn't attract—buyers follow crowds",
        priority: [
          "Display any traction (user count, growth rate)",
          "Show customer logos",
          "Announce product updates publicly",
          "Create monthly momentum signals",
        ],
        icon: "info" as const,
      };
    return {
      label: "Dead",
      range: "0-39",
      whatItMeans:
        "No visible momentum signals. This triggers prospect hesitation.",
      marketReality: "Even small wins displayed prominently break the cycle",
      priority: [
        "Add any customer logos",
        "Share any growth metric (even '100+ users')",
        "Publish one detailed case study",
        "Announce next milestone publicly",
      ],
      icon: "alert" as const,
    };
  };

  return (
    <EnhancedPillarCard
      title="Momentum Signal"
      description="Growth that's visible = growth that compounds"
      score={score}
      band={report.momentum_signal.band}
      explanation="Momentum measures visible evidence of growth and validation. Strong signals—user counts, customer logos, press—build trust and create a virtuous cycle: more users attract more users."
      audit={report.momentum_signal.audit}
      icon={<TrendingUp className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/momentum`}
      fullAuditLink={fullAuditLink}
      gradeInfo={getGradeInfo()}
    />
  );
}
