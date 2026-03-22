"use client";

import { ExplainableReportCard } from "@/components/explainable-report";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Award } from "lucide-react";

interface ExplainableProofCardProps {
  report: AuditReportV1;
  productId: string;
}

export function ExplainableProofCard({ report, productId }: ExplainableProofCardProps) {
  return (
    <ExplainableReportCard
      title="Founder Proof Vault"
      description="Evidence and authority that validates your claims and builds trust"
      score={report.founder_proof_vault.score}
      scoreLabel="Proof Score"
      band={report.founder_proof_vault.evidence_types.join(", ")}
      
      whatContent="The Founder Proof Vault measures the collection of evidence, credentials, and authority signals that validate your product's claims. It answers the critical question: 'Why should I believe you?' Types include testimonials, case studies, metrics, logos, press, and founder authority."
      
      whyContent="In an era of skepticism, claims alone don't convince. Proof transforms skepticism into trust and interest into action. Strong proof vaults drive higher conversions, shorter sales cycles, premium pricing, and reduced churn. Weak proof creates trust deficits and price resistance."
      
      howContent="Audit your proof vault: (1) Evidence diversity—how many different types do you have?, (2) Evidence quality—how specific and credible is it?, (3) Evidence visibility—is it prominently displayed?, (4) Founder authority—does your background support credibility?"
      
      howExamples={[
        "Collect specific testimonials with outcomes, not just 'great product'",
        "Create detailed case studies using Problem → Solution → Results framework",
        "Quantify impact: aggregate customer results into compelling statistics",
        "Display proof at every decision point: homepage, pricing, checkout"
      ]}
      
      audit={report.founder_proof_vault.audit}
      actionsTitle="Priority Proof Actions"
      icon={<Award className="h-5 w-5" />}
      guidanceLink={`/dashboard/${productId}/guidance/proof`}
    />
  );
}
