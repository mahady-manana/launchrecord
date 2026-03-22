"use client";

import { CircularScore } from "@/components/dashboard/sio-circular-score";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HelpCircle, Info } from "lucide-react";
import { useState } from "react";

interface ExplainableScoreProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  
  // Explanation content
  what: string;
  how: string;
  why: string;
  
  // Optional additional details
  scoreBreakdown?: {
    label: string;
    value: number;
    explanation: string;
  }[];
  
  className?: string;
}

export function ExplainableScore({
  score,
  label = "Score",
  size = "md",
  what,
  how,
  why,
  scoreBreakdown,
  className,
}: ExplainableScoreProps) {
  const [open, setOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-lime-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 40) return "D";
    return "F";
  };

  const colorClass = getScoreColor(score);
  const grade = getScoreGrade(score);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative">
          <CircularScore
            score={score}
            label={label}
            size={size}
            showGrade
            showLabel
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-orange-600"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Explain score</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-xs">Click to learn how this score is calculated</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("text-4xl font-bold", colorClass)}>
              {score}/100
            </div>
            <div className="px-3 py-1 rounded-full bg-muted border text-lg font-semibold">
              Grade: {grade}
            </div>
          </div>
          <DialogTitle className="text-xl mt-2">Understanding Your Score</DialogTitle>
          <DialogDescription>
            Learn what this score means, how it's calculated, and why it matters
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* What Section */}
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-800">What is this score?</h4>
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">{what}</p>
          </div>

          {/* How Section */}
          <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold text-green-800">How is it calculated?</h4>
            </div>
            <p className="text-sm text-green-900 leading-relaxed">{how}</p>
            
            {scoreBreakdown && scoreBreakdown.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">
                  Score Breakdown:
                </p>
                {scoreBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-white rounded border border-green-100"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900">{item.label}</p>
                      <p className="text-xs text-green-700">{item.explanation}</p>
                    </div>
                    <div className={cn("text-lg font-bold", getScoreColor(item.value))}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Why Section */}
          <div className="space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800">Why does it matter?</h4>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{why}</p>
          </div>

          {/* Score Interpretation */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Score Interpretation</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <span className="text-sm text-slate-700">90-100: Excellent - Top performer</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-lime-600" />
                <span className="text-sm text-slate-700">70-89: Good - Above average</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-600" />
                <span className="text-sm text-slate-700">40-69: Needs Improvement - Room to grow</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-sm text-slate-700">0-39: Critical - Immediate attention needed</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
