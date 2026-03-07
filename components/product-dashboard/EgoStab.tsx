"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuditReportV1 } from "@/types/audit-report-v1";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";

interface EgoStabProps {
  report: AuditReportV1;
  compositeScore: number;
}

export function EgoStab({ report, compositeScore }: EgoStabProps) {
  // Determine card styling based on score
  const getScoreBasedStyles = (score: number) => {
    if (score >= 80) {
      return {
        borderColor: "border-green-200",
        bgGradient: "from-green-50 to-emerald-50",
        titleColor: "text-green-800",
        descColor: "text-green-700",
        iconColor: "text-green-600",
        iconBg: "bg-green-100",
        badgeColor: "bg-green-600",
        icon: CheckCircle,
        title: "Excellent Performance",
        subtitle: "Your positioning is strong - keep it up!",
      };
    } else if (score >= 60) {
      return {
        borderColor: "border-blue-200",
        bgGradient: "from-blue-50 to-cyan-50",
        titleColor: "text-blue-800",
        descColor: "text-blue-700",
        iconColor: "text-blue-600",
        iconBg: "bg-blue-100",
        badgeColor: "bg-blue-600",
        icon: TrendingUp,
        title: "Good Progress",
        subtitle: "You're on the right track - here's how to improve",
      };
    } else if (score >= 40) {
      return {
        borderColor: "border-orange-200",
        bgGradient: "from-orange-50 to-amber-50",
        titleColor: "text-orange-800",
        descColor: "text-orange-700",
        iconColor: "text-orange-600",
        iconBg: "bg-orange-100",
        badgeColor: "bg-orange-600",
        icon: Info,
        title: "Needs Attention",
        subtitle: "There's room for improvement - focus on these areas",
      };
    } else {
      return {
        borderColor: "border-red-200",
        bgGradient: "from-red-50 to-rose-50",
        titleColor: "text-red-800",
        descColor: "text-red-700",
        iconColor: "text-red-600",
        iconBg: "bg-red-100",
        badgeColor: "bg-red-600",
        icon: AlertCircle,
        title: "Critical Issues",
        subtitle: "Urgent attention needed - address these gaps now",
      };
    }
  };

  const styles = getScoreBasedStyles(compositeScore);
  const Icon = styles.icon;

  return (
    <Card className={cn("border-2 bg-gradient-to-br", styles.borderColor, styles.bgGradient)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className={cn("h-6 w-6", styles.iconColor)} />
          <CardTitle className={styles.titleColor}>{styles.title}</CardTitle>
          <Badge className={cn(styles.badgeColor, "text-white")}>
            {compositeScore}/100
          </Badge>
        </div>
        <CardDescription className={styles.descColor}>
          {styles.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-xl font-semibold italic opacity-90">
          "{report.the_ego_stab.brutal_summary}"
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white/60">
            <div className={cn("text-sm mb-1 font-medium", styles.iconColor)}>Severity</div>
            <div className="text-3xl font-bold">
              {report.the_ego_stab.severity}/100
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/60">
            <div className={cn("text-sm mb-1 font-medium", styles.iconColor)}>Cliché Density</div>
            <div className="text-3xl font-bold">
              {report.the_ego_stab.cliche_density}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/60">
            <div className={cn("text-sm mb-1 font-medium", styles.iconColor)}>Founder Bias Risk</div>
            <div className="text-lg font-semibold capitalize">
              {report.the_ego_stab.founder_bias_risk}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/60 border">
          <div className={cn("text-sm mb-2 font-semibold flex items-center gap-2", styles.iconColor)}>
            <Lightbulb className="h-4 w-4" />
            Key Observation
          </div>
          <p className="italic opacity-90">
            "{report.the_ego_stab.founder_ego_bait}"
          </p>
        </div>

        {report.the_ego_stab.audit.length > 0 && (
          <div className="space-y-2">
            <div className={cn("text-sm font-semibold flex items-center gap-2", styles.iconColor)}>
              <Target className="h-4 w-4" />
              Priority Fixes
            </div>
            {report.the_ego_stab.audit.slice(0, 3).map((action, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm p-2 rounded-lg bg-white/40">
                <CheckCircle className={cn("h-4 w-4 mt-0.5 flex-shrink-0", styles.iconColor)} />
                <span>{action.action}</span>
                <Badge variant="secondary" className="ml-auto">
                  P{action.priority}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
