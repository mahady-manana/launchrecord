"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AuditAction } from "@/types/audit-report-v1";
import { CheckCircle, HelpCircle, Lightbulb, Target } from "lucide-react";
import { ExplainableActionItem } from "./explainable-action-item";
import { ExplainableScore } from "./explainable-score";

interface ExplainableReportCardProps {
  // Basic info
  title: string;
  description?: string;
  
  // What is this metric
  whatTitle?: string;
  whatContent: string;
  
  // Why it matters
  whyTitle?: string;
  whyContent: string;
  
  // How to analyze
  howTitle?: string;
  howContent?: string;
  howExamples?: string[];
  
  // Score display
  score?: number;
  scoreLabel?: string;
  band?: string;
  
  // Actions
  audit?: AuditAction[];
  actionsTitle?: string;
  
  // Styling
  icon?: React.ReactNode;
  className?: string;
  guidanceLink?: string;
}

export function ExplainableReportCard({
  title,
  description,
  whatTitle = "What is this?",
  whatContent,
  whyTitle = "Why does it matter?",
  whyContent,
  howTitle = "How to analyze?",
  howContent,
  howExamples,
  score,
  scoreLabel,
  band,
  audit,
  actionsTitle = "Priority Actions",
  icon,
  className,
  guidanceLink,
}: ExplainableReportCardProps) {
  return (
    <Card className={cn("border-2 bg-gradient-to-br from-white to-slate-50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {icon && <div className="text-orange-600">{icon}</div>}
              <CardTitle className="text-xl">{title}</CardTitle>
              {guidanceLink && (
                <Button variant="ghost" size="sm" asChild className="ml-auto -mr-2">
                  <a href={guidanceLink}>
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Learn more</span>
                  </a>
                </Button>
              )}
            </div>
            {description && (
              <CardDescription className="text-sm mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          {score !== undefined && (
            <ExplainableScore
              score={score}
              label={scoreLabel}
              what={`This score represents your performance in ${title.toLowerCase()}.`}
              how="Score is calculated based on multiple factors specific to this metric."
              why="A higher score indicates better optimization and lower risk."
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* What Section */}
        <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-semibold text-blue-800">{whatTitle}</h4>
          </div>
          <p className="text-sm text-blue-900 leading-relaxed">{whatContent}</p>
        </div>

        {/* Why Section */}
        <div className="space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <h4 className="text-sm font-semibold text-amber-800">{whyTitle}</h4>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed">{whyContent}</p>
        </div>

        {/* How Section */}
        {howContent && (
          <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold text-green-800">{howTitle}</h4>
            </div>
            <p className="text-sm text-green-900 leading-relaxed">{howContent}</p>
            {howExamples && howExamples.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                  Examples:
                </p>
                {howExamples.map((example, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-green-900 bg-white rounded p-2 border border-green-100"
                  >
                    {example}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Band/Level indicator */}
        {band && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Performance Level:</span>
            <Badge variant="outline" className="capitalize">
              {band}
            </Badge>
          </div>
        )}

        {/* Priority Actions */}
        {audit && audit.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-600" />
              <h4 className="text-sm font-semibold text-orange-800">{actionsTitle}</h4>
            </div>
            <div className="space-y-2">
              {audit.map((action, idx) => (
                <ExplainableActionItem
                  key={idx}
                  action={action.action}
                  priority={action.priority}
                  why={`This action is prioritized at level ${action.priority} based on its potential impact.`}
                  how="Implement this action by reviewing your current setup and making targeted improvements."
                  example="For example, if this is about schema markup, add structured data to your pages."
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
