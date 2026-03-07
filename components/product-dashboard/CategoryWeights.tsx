"use client";

import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditReportV1 } from "@/types/audit-report-v1";

interface CategoryWeightsProps {
  report: AuditReportV1;
}

export function CategoryWeights({ report }: CategoryWeightsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-600" />
          <CardTitle>Category Weights</CardTitle>
        </div>
        <CardDescription>
          How each pillar contributes to your overall score
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <PillarWeightRow
            label="AEO Index"
            value={report.category_weights.aeo_index}
          />
          <PillarWeightRow
            label="Positioning Sharpness"
            value={report.category_weights.positioning_sharpness}
          />
          <PillarWeightRow
            label="Clarity Velocity"
            value={report.category_weights.clarity_velocity}
          />
          <PillarWeightRow
            label="Momentum Signal"
            value={report.category_weights.momentum_signal}
          />
          <PillarWeightRow
            label="Founder Proof Vault"
            value={report.category_weights.founder_proof_vault}
          />
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {report.category_weights.weighting_rationale}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PillarWeightRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm w-40">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-medium w-12 text-right">{value}%</span>
    </div>
  );
}
