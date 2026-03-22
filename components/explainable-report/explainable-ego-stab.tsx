"use client";

import { ExplainableActionItem } from "@/components/explainable-report/explainable-action-item";
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
import { AuditReportV1 } from "@/types/audit-report-v1";
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Info,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface ExplainableEgoStabProps {
  report: AuditReportV1;
  compositeScore: number;
}

export function ExplainableEgoStab({
  report,
  compositeScore,
}: ExplainableEgoStabProps) {
  const [open, setOpen] = useState(false);

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
    <>
      <Card
        className={cn(
          "border-2 bg-gradient-to-br",
          styles.borderColor,
          styles.bgGradient,
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={cn("h-6 w-6", styles.iconColor)} />
              <CardTitle className={styles.titleColor}>
                {styles.title}
              </CardTitle>
              <Badge className={cn(styles.badgeColor, "text-white")}>
                {compositeScore}/100
              </Badge>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="text-sm text-muted-foreground hover:text-orange-600 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          <CardDescription className={styles.descColor}>
            {styles.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What Section */}
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-800">
                What is the Ego Stab?
              </h4>
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              The Ego Stab is a brutally honest assessment designed to cut
              through founder bias and highlight uncomfortable truths about your
              positioning. It provides an external, unbiased perspective on how
              your product is likely perceived.
            </p>
          </div>

          {/* Brutal Summary */}
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800">
                Brutally Honest Summary
              </h4>
            </div>
            <p className="text-lg font-medium italic text-slate-800">
              "{report.the_ego_stab.brutal_summary}"
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This may feel harsh, but it's designed to prompt action and cut
              through optimism bias.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/60 border">
              <div className={cn("text-sm mb-1 font-medium", styles.iconColor)}>
                Severity
              </div>
              <div className="text-3xl font-bold">
                {report.the_ego_stab.severity}/100
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                How critical your issues are
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/60 border">
              <div className={cn("text-sm mb-1 font-medium", styles.iconColor)}>
                Cliché Density
              </div>
              <div className="text-2xl font-bold">
                {report.the_ego_stab.cliche_density}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Generic vs. specific language
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/60 border">
              <div className={cn("text-sm mb-1 font-medium", styles.iconColor)}>
                Founder Bias Risk
              </div>
              <div className="text-lg font-semibold capitalize">
                {report.the_ego_stab.founder_bias_risk}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Objectivity level of your view
              </p>
            </div>
          </div>

          {/* Why Section */}
          <div className="space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800">
                Why this matters?
              </h4>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">
              Founders naturally overestimate their clarity and differentiation.
              The Ego Stab counters this bias with direct, unfiltered feedback.
              High severity or cliché density indicates your messaging isn't
              resonating as well as you think.
            </p>
          </div>

          {/* Priority Actions */}
          {report.the_ego_stab.audit.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-orange-600" />
                <h4 className="text-sm font-semibold text-orange-800">
                  Priority Fixes
                </h4>
              </div>
              <div className="space-y-2">
                {report.the_ego_stab.audit.slice(0, 3).map((action, idx) => (
                  <ExplainableActionItem
                    key={idx}
                    action={action.action}
                    priority={action.priority}
                    why={`This action is prioritized at level ${action.priority} based on its potential impact on your positioning.`}
                    how="Implement this by reviewing your current messaging and making targeted improvements to address the specific issue identified."
                    example="For example, if this is about clichés, replace generic buzzwords with specific, concrete language about what you actually do."
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Explanation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Understanding the Ego Stab</DialogTitle>
            <DialogDescription>
              Why brutally honest feedback is valuable for founders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-4">
              <h4 className="font-semibold">The Founder Bias Problem</h4>
              <p className="text-sm text-slate-700">
                Founders naturally develop blind spots about their product.
                After months or years of development, everything seems clear and
                obvious. But to a stranger visiting your site for the first
                time, it may be confusing or generic.
              </p>
              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>The Ego Stab counters this bias</strong> by providing
                  the honest feedback you might not get from team members or
                  early supporters who are too polite.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Understanding the Metrics</h4>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold text-sm">
                      Severity (1-100)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    How critical your positioning issues are. Higher severity
                    means more urgent need for improvement. Scores above 70
                    indicate serious problems.
                  </p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center gap-2 mb-1">
                    <HelpCircle className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-sm">
                      Cliché Density (0-100%)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    How much generic buzzword language vs. specific,
                    differentiated messaging you use. High cliché density
                    (&gt;60%) means you sound like everyone else.
                  </p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-semibold text-sm">
                      Founder Bias Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Assessment of how much your personal attachment may be
                    clouding objective positioning decisions. High risk means
                    you may be overestimating your clarity.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">How to Use This Feedback</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Don't get defensive—this feedback is designed to help, not
                    hurt
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Share it with your team and discuss honestly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Focus on the highest priority actions first</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Test changes with real prospects, not just internally
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Re-audit after making improvements to track progress
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
