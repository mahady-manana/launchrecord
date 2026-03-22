"use client";

import { AuditReportV1 } from "@/types/audit-report-v1";
import { Award } from "lucide-react";
import { EnhancedPillarCard } from "./enhanced-pillar-card";

interface ProofCardProps {
  report: AuditReportV1;
  productId: string;
  fullAuditLink?: string;
}

export function ProofCard({
  report,
  productId,
  fullAuditLink,
}: ProofCardProps) {
  const score = report.founder_proof_vault.score;

  const getGradeInfo = () => {
    if (score >= 90)
      return {
        label: "Comprehensive",
        range: "90-100",
        whatItMeans:
          "Extensive proof across all types. Trust is fully established.",
        marketReality: "This is your conversion superpower",
        priority: [
          "New testimonials monthly",
          "Update case studies quarterly",
          "Display proof at every decision point",
        ],
        icon: "check" as const,
      };
    if (score >= 70)
      return {
        label: "Strong",
        range: "70-89",
        whatItMeans: "Good variety of proof. Most trust objections handled.",
        marketReality: "You're close to trust dominance",
        priority: [
          "Add 2-3 detailed case studies with metrics",
          "Display testimonials on pricing page",
          "Quantify cumulative customer results",
        ],
        icon: "check" as const,
      };
    if (score >= 40)
      return {
        label: "Limited",
        range: "40-69",
        whatItMeans: "Some proof present but gaps create skepticism.",
        marketReality: "Every missing testimonial is a lost sale",
        priority: [
          "Collect video testimonials",
          "Create one detailed case study with before/after metrics",
          "Display customer logos prominently",
          "Add specific numbers to all claims",
        ],
        icon: "info" as const,
      };
    return {
      label: "Weak",
      range: "0-39",
      whatItMeans:
        "Little to no visible proof. Prospects are asked to take blind faith.",
      marketReality:
        "Proof isn't optional—it's the difference between browsing and buying",
      priority: [
        "Ask 3 happy customers for testimonials",
        "Create one case study with specific results",
        "Display any metrics (users, revenue, growth)",
        "Put proof on homepage above the fold",
      ],
      icon: "alert" as const,
    };
  };

  return (
    <EnhancedPillarCard
      title="Founder Proof Vault"
      description="Evidence beats claims every time"
      score={score}
      band={
        report.founder_proof_vault.evidence_types.length > 0
          ? report.founder_proof_vault.evidence_types.join(", ")
          : undefined
      }
      explanation="Proof measures the evidence validating your claims: testimonials, case studies, metrics, logos, press, and founder authority. It answers the question every prospect has: 'Why should I believe you?'"
      audit={report.founder_proof_vault.audit}
      icon={<Award className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/proof`}
      fullAuditLink={fullAuditLink}
      gradeInfo={getGradeInfo()}
    />
  );
}
