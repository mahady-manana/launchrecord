"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AuditAction } from "@/types/audit-report-v1";
import { CheckCircle, ChevronRight } from "lucide-react";
import { ExplainableActionItem } from "./explainable-action-item";
import { ExplainableScore } from "./explainable-score";

interface SimplifiedReportCardProps {
  // Basic info
  title: string;
  description: string;
  
  // Score display
  score: number;
  band?: string;
  
  // Direct explanation (replaces what/why/how)
  explanation: string;
  
  // Actions
  audit?: AuditAction[];
  
  // Styling
  icon?: React.ReactNode;
  className?: string;
  guidanceLink?: string;
}

export function SimplifiedReportCard({
  title,
  description,
  score,
  band,
  explanation,
  audit,
  icon,
  className,
  guidanceLink,
}: SimplifiedReportCardProps) {
  return (
    <Card className={cn("border-2 bg-gradient-to-br from-white to-slate-50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {icon && <div className="text-orange-600">{icon}</div>}
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <CardDescription className="text-sm mt-1">
              {description}
            </CardDescription>
          </div>
          <ExplainableScore
            score={score}
            label={`${title} Score`}
            what={explanation}
            how="Score is calculated based on multiple factors specific to this metric."
            why="A higher score indicates better optimization and lower risk."
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Direct Explanation */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-700 leading-relaxed">{explanation}</p>
          {guidanceLink && (
            <Button variant="ghost" size="sm" asChild className="mt-2 h-auto p-0 text-orange-600 hover:text-orange-700">
              <a href={guidanceLink}>
                Learn more →
              </a>
            </Button>
          )}
        </div>

        {/* Band/Level indicator */}
        {band && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Performance:</span>
            <Badge variant="outline" className="capitalize">
              {band}
            </Badge>
          </div>
        )}

        {/* Priority Actions */}
        {audit && audit.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-700">Priority Actions</div>
            {audit.slice(0, 3).map((action, idx) => (
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
        )}
      </CardContent>
    </Card>
  );
}
