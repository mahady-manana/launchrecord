"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CircularScore } from "@/components/dashboard/sio-circular-score";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { cn } from "@/lib/utils";

interface OverallAssessmentProps {
  report: AuditReportV1;
  productName: string;
}

export function OverallAssessment({ report, productName }: OverallAssessmentProps) {
  const compositeScore = report.overall_assessment.composite_score;
  const categoryPosition = report.overall_assessment.category_position;

  const getCategoryPositionColor = (position: string) => {
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
      <CardContent className="p-8">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Score Display */}
          <div className="flex justify-center lg:justify-end">
            <CircularScore
              score={compositeScore}
              label="SIO Score"
              size="xl"
              showLabel
            />
          </div>

          {/* Assessment Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Assessment</h2>
              <p className="text-muted-foreground">
                Based on the SIO-V5 analysis of {productName}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">
                  Category Position
                </div>
                <Badge
                  className={cn(
                    "text-lg px-4 py-2",
                    getCategoryPositionColor(categoryPosition),
                  )}
                >
                  {categoryPosition.charAt(0).toUpperCase() +
                    categoryPosition.slice(1)}
                </Badge>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">
                  Primary Constraint
                </div>
                <div className="text-lg font-semibold capitalize">
                  {report.overall_assessment.primary_constraint}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">
                  Biggest Leverage Point
                </div>
                <div className="text-sm font-medium">
                  {report.overall_assessment.biggest_leverage_point}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-sm text-muted-foreground mb-1">
                  Survival Probability (12m)
                </div>
                <div
                  className={cn(
                    "text-2xl font-bold",
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
