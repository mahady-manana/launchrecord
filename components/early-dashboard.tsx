"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProductStatus } from "@/lib/product-status";
import type { AuditReportV1 } from "@/types/audit-report-v1";
import {
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle,
  Globe,
  Info,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { UnlockDashboardCard } from "./unlock-dashboard-card";

interface EarlyDashboardProps {
  report: AuditReportV1;
  founderName?: string;
  saasName?: string;
  showNavigation?: boolean;
  userEmail?: string;
}

export function EarlyDashboard({
  report,
  founderName = "Founder",
  saasName = "Your SaaS",
  showNavigation = true,
  userEmail,
}: EarlyDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      case "medium":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getCategoryPositionColor = (position: string) => {
    switch (position) {
      case "leader":
        return "text-green-600 bg-green-50";
      case "challenger":
        return "text-blue-600 bg-blue-50";
      case "replicable":
        return "text-orange-600 bg-orange-50";
      case "invisible":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Whitelist Status Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-green-800">
                    🎉 You're on the Whitelist!
                  </h3>
                  <Badge className="bg-green-600 text-white">
                    Early Access
                  </Badge>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Welcome, <strong>{founderName}</strong>! You have early access
                  to LaunchRecord. Keep up for weekly updates, new features, and
                  priority support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 animate-in slide-in-from-top-4 duration-700">
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Audit Report Complete
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">
            SIO-V5 War Briefing
          </h1>
          <p className="text-lg text-muted-foreground">
            Analysis for <strong>{saasName}</strong> • Version:{" "}
            {report.meta.analysis_version} • Confidence:{" "}
            {(report.meta.confidence_score * 100).toFixed(0)}%
          </p>
        </div>

        {/* Overall Assessment - Hero Card */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg animate-in zoom-in-95 duration-700">
          <CardContent className="space-y-6">
            <div className="text-center mb-6">
              {showNavigation ? (
                <div className="bg-yellow-200 mb-4 text-yellow-800 p-4 rounded-lg">
                  <Info className="mx-auto" />
                  <p className="font-bold text-xl">Important note</p>
                  <p>Full SIO V5 Audit is not available in Whitelist</p>
                  <p>Access Early Dashboard For Updates</p>
                </div>
              ) : null}

              <h2 className="text-2xl font-bold text-foreground">
                Overall Assessment
              </h2>
            </div>
            <div className="flex justify-center items-center gap-8">
              <div
                className={`text-7xl font-bold ${getScoreColor(report.overall_assessment.composite_score)} animate-in zoom-in duration-500`}
              >
                {report.overall_assessment.composite_score}
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <div className="text-left space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Category Position
                  </div>
                  <div
                    className={`text-xl font-semibold px-4 py-2 rounded-lg ${
                      getProductStatus(
                        report.overall_assessment.composite_score || 0,
                      ).color
                    }`}
                  >
                    {
                      getProductStatus(
                        report.overall_assessment.composite_score || 0,
                      ).status
                    }
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Primary Constraint
                  </div>
                  <div className="text-lg font-semibold text-foreground capitalize">
                    {report.overall_assessment.primary_constraint}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Biggest Leverage Point
                </div>
                <div className="text-lg font-semibold text-foreground mt-1">
                  {report.overall_assessment.biggest_leverage_point}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Survival Probability (12m)
                </div>
                <div
                  className={`text-2xl font-bold ${getScoreColor(report.overall_assessment.survival_probability_12m)} mt-1`}
                >
                  {report.overall_assessment.survival_probability_12m}%
                </div>
              </div>
            </div>
            {showNavigation ? (
              <div className="text-center bg-green-200 bg-green-50 p-4 rounded-lg mt-6">
                <UnlockDashboardCard
                  userEmail={userEmail}
                  onAuthComplete={() => window.location.reload()}
                />
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Critical Insights */}
        <Card className="border-2 border-orange-200 bg-orange-50 shadow-lg animate-in slide-in-from-bottom-8 duration-700 delay-100">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-orange-700">
                Critical Insights
              </h3>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-semibold text-orange-800">
                "{report.the_ego_stab.brutal_summary}"
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-orange-600">Severity</div>
                  <div className="text-2xl font-bold text-orange-700">
                    {report.the_ego_stab.severity}/100
                  </div>
                </div>
                <div>
                  <div className="text-sm text-orange-600">Cliché Density</div>
                  <div className="text-2xl font-bold text-orange-700">
                    {report.the_ego_stab.cliche_density}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-orange-600">Bias Risk</div>
                  <div className="text-lg font-semibold text-orange-700 capitalize">
                    {report.the_ego_stab.founder_bias_risk}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-orange-200">
                <div className="text-sm text-orange-600 mb-2">
                  Key Observation
                </div>
                <p className="text-orange-800 italic">
                  "{report.the_ego_stab.founder_ego_bait}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* AEO Index */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-200">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">AEO Index</h3>
                </div>
                <Badge
                  className={getRiskColor(
                    report.aeo_index.search_visibility_risk,
                  )}
                >
                  {report.aeo_index.search_visibility_risk} risk
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`text-4xl font-bold ${getScoreColor(report.aeo_index.score)}`}
                >
                  {report.aeo_index.score}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">
                    Direct Answer Potential
                  </div>
                  <div className="text-sm text-foreground">
                    {report.aeo_index.direct_answer_potential}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {report.aeo_index.critique}
              </p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">
                  Priority Actions
                </div>
                {report.aeo_index.audit.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                    <span>{action.action}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {action.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Positioning Sharpness */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-300">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">
                    Positioning Sharpness
                  </h3>
                </div>
                <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                  {report.positioning_sharpness.band}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`text-4xl font-bold ${getScoreColor(report.positioning_sharpness.score)}`}
                >
                  {report.positioning_sharpness.score}
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  Band position on the sovereign scale
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {report.positioning_sharpness.critique}
              </p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">
                  Priority Actions
                </div>
                {report.positioning_sharpness.audit
                  .slice(0, 2)
                  .map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                      <span>{action.action}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {action.priority}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Clarity Velocity */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-400">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Clarity Velocity</h3>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {report.clarity_velocity.band}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`text-4xl font-bold ${getScoreColor(report.clarity_velocity.score)}`}
                >
                  {report.clarity_velocity.score}
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  How quickly users understand your value
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {report.clarity_velocity.critique}
              </p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">
                  Priority Actions
                </div>
                {report.clarity_velocity.audit
                  .slice(0, 2)
                  .map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                      <span>{action.action}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {action.priority}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Momentum Signal */}
          <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-500">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-lg">Momentum Signal</h3>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  {report.momentum_signal.band}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`text-4xl font-bold ${getScoreColor(report.momentum_signal.score)}`}
                >
                  {report.momentum_signal.score}
                </div>
                <div className="flex-1 text-sm text-muted-foreground">
                  Market traction and growth indicators
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {report.momentum_signal.critique}
              </p>
              <div className="space-y-2 pt-2 border-t">
                <div className="text-xs font-semibold text-muted-foreground">
                  Priority Actions
                </div>
                {report.momentum_signal.audit.slice(0, 2).map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                    <span>{action.action}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {action.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Founder Proof Vault */}
        <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-600">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Founder Proof Vault</h3>
              </div>
              <div
                className={`text-3xl font-bold ${getScoreColor(report.founder_proof_vault.score)}`}
              >
                {report.founder_proof_vault.score}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {report.founder_proof_vault.critique}
            </p>
            <div className="flex flex-wrap gap-2">
              {report.founder_proof_vault.evidence_types.map((type, idx) => (
                <Badge key={idx} variant="secondary" className="capitalize">
                  {type.replace("_", " ")}
                </Badge>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t">
              <div className="text-xs font-semibold text-muted-foreground">
                Priority Actions
              </div>
              {report.founder_proof_vault.audit
                .slice(0, 3)
                .map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600 mt-1.5 flex-shrink-0" />
                    <span>{action.action}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {action.priority}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Competitors */}
        <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-700">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-lg">Top Competitors</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {report.top_competitors.map((competitor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span className="font-medium">{competitor.name}</span>
                  <Badge
                    className={
                      competitor.threat_level === "high"
                        ? "bg-red-50 text-red-700"
                        : competitor.threat_level === "medium"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-green-50 text-green-700"
                    }
                  >
                    {competitor.threat_level}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Weights */}
        <Card className="animate-in slide-in-from-bottom-8 duration-700 delay-800">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold text-lg">Category Weights</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">AEO Index</span>
                <Progress
                  value={report.category_weights.aeo_index}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {report.category_weights.aeo_index}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Positioning</span>
                <Progress
                  value={report.category_weights.positioning_sharpness}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {report.category_weights.positioning_sharpness}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Clarity</span>
                <Progress
                  value={report.category_weights.clarity_velocity}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {report.category_weights.clarity_velocity}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Momentum</span>
                <Progress
                  value={report.category_weights.momentum_signal}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {report.category_weights.momentum_signal}%
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm w-40">Proof</span>
                <Progress
                  value={report.category_weights.founder_proof_vault}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {report.category_weights.founder_proof_vault}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              {report.category_weights.weighting_rationale}
            </p>
          </CardContent>
        </Card>

        {/* Whitelist Status */}
        {showNavigation && (
          <div className="text-center space-y-4 py-8 animate-in slide-in-from-bottom-8 duration-700 delay-900">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-green-800">
                      You're on the Whitelist!
                    </h3>
                  </div>
                  <p className="text-sm text-green-700">
                    As an early access member, you'll receive weekly updates,
                    new features, and priority support. Keep up for more
                    insights and tools to strengthen your positioning.
                  </p>
                </div>

                <UnlockDashboardCard
                  userEmail={userEmail}
                  onAuthComplete={() => window.location.reload()}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
