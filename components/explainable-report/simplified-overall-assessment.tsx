"use client";

import { ExplainableScore } from "@/components/explainable-report/explainable-score";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/stores/product-store";
import { AuditReportV1, CategoryPosition } from "@/types/audit-report-v1";
import { BookOpen } from "lucide-react";
import { useState } from "react";

interface SimplifiedOverallAssessmentProps {
  report: AuditReportV1;
  productName: string;
}

export function SimplifiedOverallAssessment({
  report,
  productName,
}: SimplifiedOverallAssessmentProps) {
  const [open, setOpen] = useState(false);
  const compositeScore = report.overall_assessment.composite_score;
  const categoryPosition = report.overall_assessment.category_position;
  const product = useProductStore((s) => s.selectedProduct);
  const getCategoryPositionColor = (position: CategoryPosition) => {
    switch (position) {
      case "leader":
        return "text-green-700 bg-green-50 border-green-200";
      case "challenger":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "replicable":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "invisible":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-xl">Overall Assessment</CardTitle>
            </div>
            <CardDescription>
              Complete SIO-V5 analysis of {productName}
            </CardDescription>
          </div>
          <ExplainableScore
            showGrade
            score={compositeScore}
            label="SIO Score"
            size="lg"
            what={`This composite score represents your overall Search Intelligence Optimization level across all 5 pillars: AEO, Positioning, Clarity, Momentum, and Proof.`}
            how="Your SIO score is calculated as a weighted average of all five pillar scores. Each pillar contributes equally (20% weight)."
            why="A higher SIO score indicates better overall visibility, conversion potential, and growth readiness."
            scoreBreakdown={[
              {
                label: "AEO",
                value: report.aeo_index.score,
                explanation: "Answer Engine Optimization",
              },
              {
                label: "Positioning",
                value: report.positioning_sharpness.score,
                explanation: "Market differentiation",
              },
              {
                label: "Clarity",
                value: report.clarity_velocity.score,
                explanation: "Value proposition speed",
              },
              {
                label: "Momentum",
                value: report.momentum_signal.score,
                explanation: "Traction evidence",
              },
              {
                label: "Proof",
                value: report.founder_proof_vault.score,
                explanation: "Trust-building evidence",
              },
            ]}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Direct Explanation */}
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700 leading-relaxed">
            Your overall SIO score synthesizes all five pillars into a single
            metric. The category position shows how you're likely perceived in
            the market. Focus on your primary constraint first—it's your
            highest-leverage improvement area.
          </p>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mt-2 h-auto p-0 text-orange-600 hover:text-orange-700"
          >
            <a href={`/dashboard/${product?._id}/guidance/overview`}>
              Learn more about SIO-V5 →
            </a>
          </Button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-white border">
            <div className="text-xs text-muted-foreground mb-1">
              Category Position
            </div>
            <Badge className={getCategoryPositionColor(categoryPosition)}>
              {categoryPosition.charAt(0).toUpperCase() +
                categoryPosition.slice(1)}
            </Badge>
          </div>

          <div className="p-3 rounded-lg bg-white border">
            <div className="text-xs text-muted-foreground mb-1">
              Primary Constraint
            </div>
            <div className="text-sm font-semibold capitalize">
              {report.overall_assessment.primary_constraint}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white border">
            <div className="text-xs text-muted-foreground mb-1">
              Biggest Leverage
            </div>
            <div className="text-xs font-medium line-clamp-2">
              {report.overall_assessment.biggest_leverage_point}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white border">
            <div className="text-xs text-muted-foreground mb-1">
              Survival (12m)
            </div>
            <div
              className={cn(
                "text-lg font-bold",
                report.overall_assessment.survival_probability_12m >= 70
                  ? "text-green-600"
                  : report.overall_assessment.survival_probability_12m >= 40
                    ? "text-orange-600"
                    : "text-red-600",
              )}
            >
              {report.overall_assessment.survival_probability_12m}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
