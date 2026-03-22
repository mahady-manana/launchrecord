"use client";

import { AuditReportV1 } from "@/types/audit-report-v1";
import { Target } from "lucide-react";
import { EnhancedPillarCard } from "./enhanced-pillar-card";

interface PositioningCardProps {
  report: AuditReportV1;
  productId: string;
  fullAuditLink?: string;
}

export function PositioningCard({
  report,
  productId,
  fullAuditLink,
}: PositioningCardProps) {
  const score = report.positioning_sharpness.score;

  const getGradeInfo = () => {
    if (score >= 90)
      return {
        label: "Dominant",
        range: "90-100",
        whatItMeans:
          "Crystal-clear positioning with defined audience. You own a category in customers' minds.",
        marketReality: "Competitors can copy features but not position",
        priority: [
          "Audit messaging quarterly",
          "Double down on unique differentiators",
          "Reinforce audience specificity",
        ],
        icon: "check" as const,
      };
    if (score >= 70)
      return {
        label: "Strong",
        range: "70-89",
        whatItMeans:
          "Clear differentiation with well-defined target audience. Customers see you as a top contender.",
        marketReality:
          "Positioning clarity drives 3-5x higher conversion rates",
        priority: [
          "Sharpen unique mechanism",
          "Make audience specificity more explicit",
          "Lead with outcomes not features",
        ],
        icon: "check" as const,
      };
    if (score >= 40)
      return {
        label: "Blended",
        range: "40-69",
        whatItMeans:
          "Positioning lacks sharpness and audience specificity. You sound similar to competitors, forcing price competition.",
        marketReality: "Buyers decide in seconds whether you're 'for them'",
        priority: [
          "Define specific audience explicitly (role, industry, size)",
          "Lead with outcomes not features",
          "Articulate what you do differently",
        ],
        icon: "info" as const,
      };
    return {
      label: "Weak",
      range: "0-39",
      whatItMeans:
        "Unclear positioning with no defined audience. Visitors can't tell what makes you different or who you serve.",
      marketReality:
        "This is why conversion rates are low—buyers don't self-identify",
      priority: [
        "Name your exact customer",
        "Complete: 'We help [who] achieve [what] by [how] unlike [alternative]'",
        "Lead with it everywhere",
        "Test on strangers",
      ],
      icon: "alert" as const,
    };
  };

  return (
    <EnhancedPillarCard
      title="Positioning Sharpness"
      description="Stand out or blend in"
      score={score}
      band={report.positioning_sharpness.band}
      explanation="Positioning measures how clearly you distinguish yourself from competitors. Sharp positioning makes it obvious what you offer, who it's for, and why you're different—not just better."
      audit={report.positioning_sharpness.audit}
      icon={<Target className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/positioning`}
      fullAuditLink={fullAuditLink}
      gradeInfo={getGradeInfo()}
    />
  );
}
