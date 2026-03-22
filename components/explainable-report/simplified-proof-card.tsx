"use client";

import { SimplifiedReportCard } from "./simplified-report-card";
import { GradeSummary } from "./grade-summary";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { Award } from "lucide-react";

interface SimplifiedProofCardProps {
  report: AuditReportV1;
  productId: string;
}

export function SimplifiedProofCard({ report, productId }: SimplifiedProofCardProps) {
  return (
    <div className="space-y-4">
      <SimplifiedReportCard
        title="Founder Proof Vault"
        description="Evidence that validates your claims"
        score={report.founder_proof_vault.score}
        band={report.founder_proof_vault.evidence_types.join(", ")}
        
        explanation="The Proof Vault measures evidence, credentials, and authority signals that validate your claims. It answers: 'Why should I believe you?' Types include testimonials, case studies, metrics, logos, press, and founder authority."
        
        audit={report.founder_proof_vault.audit}
        icon={<Award className="h-5 w-5" />}
        guidanceLink={`/dashboard/${productId}/guidance/proof`}
      />
      
      <GradeSummary score={report.founder_proof_vault.score} pillarType="proof" />
    </div>
  );
}
