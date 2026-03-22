"use client";

import { ExplainableScore } from "@/components/explainable-report/explainable-score";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AuditReportV1, CategoryPosition } from "@/types/audit-report-v1";
import { BookOpen, HelpCircle, Lightbulb, Target } from "lucide-react";
import { useState } from "react";

interface ExplainableOverallAssessmentProps {
  report: AuditReportV1;
  productName: string;
}

export function ExplainableOverallAssessment({
  report,
  productName,
}: ExplainableOverallAssessmentProps) {
  const [open, setOpen] = useState(false);
  const compositeScore = report.overall_assessment.composite_score;
  const categoryPosition = report.overall_assessment.category_position;

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
    <>
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
              score={compositeScore}
              label="SIO Score"
              size="lg"
              what={`This composite score represents your overall Search Intelligence Optimization level across all 5 pillars: AEO, Positioning, Clarity, Momentum, and Proof.`}
              how="Your SIO score is calculated as a weighted average of all five pillar scores. Each pillar contributes equally (20% weight) to create a holistic view of your digital optimization."
              why="A higher SIO score indicates better overall visibility, conversion potential, and growth readiness. It correlates with lower customer acquisition costs and higher organic growth."
              scoreBreakdown={[
                {
                  label: "AEO Index",
                  value: report.aeo_index.score,
                  explanation: "Answer Engine Optimization quality",
                },
                {
                  label: "Positioning",
                  value: report.positioning_sharpness.score,
                  explanation: "Market differentiation clarity",
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

        <CardContent className="space-y-6">
          {/* What Section */}
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-800">
                What is this assessment?
              </h4>
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              The Overall Assessment synthesizes all five SIO pillars into a
              single composite score and category position. It provides a
              high-level view of your digital optimization and market
              positioning.
            </p>
          </div>

          {/* Why Section */}
          <div className="space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800">
                Why does it matter?
              </h4>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">
              Your composite score predicts growth trajectory and customer
              acquisition efficiency. Higher scores correlate with lower CAC,
              higher conversion rates, and faster organic growth. The category
              position shows how you're likely perceived in the market.
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white border">
              <div className="text-sm text-muted-foreground mb-1">
                Category Position
              </div>
              <Badge className={getCategoryPositionColor(categoryPosition)}>
                {categoryPosition.charAt(0).toUpperCase() +
                  categoryPosition.slice(1)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                How you're perceived in the market
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border">
              <div className="text-sm text-muted-foreground mb-1">
                Primary Constraint
              </div>
              <div className="text-lg font-semibold capitalize">
                {report.overall_assessment.primary_constraint}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your biggest limiting factor
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border">
              <div className="text-sm text-muted-foreground mb-1">
                Biggest Leverage Point
              </div>
              <div className="text-sm font-medium">
                {report.overall_assessment.biggest_leverage_point}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Highest-impact improvement area
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border">
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
              <p className="text-xs text-muted-foreground mt-2">
                Based on current trajectory
              </p>
            </div>
          </div>

          {/* How to Analyze */}
          <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold text-green-800">
                How to analyze your results?
              </h4>
            </div>
            <p className="text-sm text-green-900 leading-relaxed">
              Start with your primary constraint—this is your highest-leverage
              improvement area. Review individual pillar scores to understand
              strengths and weaknesses. Read the priority actions for each
              pillar and implement them in order of priority score.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setOpen(true)}
                className="text-xs bg-white hover:bg-green-100 text-green-700 px-3 py-1.5 rounded border border-green-200 transition-colors"
              >
                Learn more about SIO-V5
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Explanation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Understanding Your SIO-V5 Assessment</DialogTitle>
            <DialogDescription>
              Complete guide to interpreting your overall assessment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="font-semibold">Category Position Explained</h4>
              <p className="text-sm text-slate-700">
                Your category position reflects how you're likely perceived in
                the market based on your digital presence optimization:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      Leader
                    </Badge>
                    <span className="text-sm font-semibold text-green-800">
                      Category Standard
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Perceived as the go-to solution or innovator. Sets the
                    standard others follow.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      Challenger
                    </Badge>
                    <span className="text-sm font-semibold text-blue-800">
                      Strong Alternative
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Well-positioned as a viable alternative with clear
                    differentiators.
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-orange-50 text-orange-700 border-orange-200">
                      Replicable
                    </Badge>
                    <span className="text-sm font-semibold text-orange-800">
                      Commoditized
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Could be easily replaced by competitors. Lacks clear
                    differentiation.
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-red-50 text-red-700 border-red-200">
                      Invisible
                    </Badge>
                    <span className="text-sm font-semibold text-red-800">
                      No Clear Presence
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Essentially invisible in the market. No discernible
                    positioning.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">
                Understanding Primary Constraint
              </h4>
              <p className="text-sm text-slate-700">
                Your primary constraint is the single biggest factor limiting
                your overall performance. It's identified by analyzing which
                pillar has the lowest score relative to its importance for your
                specific situation.
              </p>
              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>Focus here first:</strong> Improving your primary
                  constraint will have the highest impact on your overall score
                  and business outcomes.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Survival Probability</h4>
              <p className="text-sm text-slate-700">
                This metric estimates the likelihood of sustained market
                presence over 12 months based on current optimization levels and
                competitive dynamics. It considers your composite score,
                category position, and momentum trajectory.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
