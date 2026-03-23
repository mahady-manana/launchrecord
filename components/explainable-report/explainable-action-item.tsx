"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  HelpCircle,
  Info,
  Lightbulb,
  Square,
  Target,
} from "lucide-react";
import { useState } from "react";

interface ExplainableActionItemProps {
  action: string;
  priority: number;

  // Explanation content
  why: string;
  how: string;
  example: string;

  // Optional: custom title for the action
  actionTitle?: string;

  className?: string;
}

export function ExplainableActionItem({
  action,
  priority,
  why,
  how,
  example,
  actionTitle = "Action",
  className,
}: ExplainableActionItemProps) {
  const [open, setOpen] = useState(false);

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "bg-red-100 text-red-700 border-red-200";
    if (priority >= 50)
      return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 80) return "Critical";
    if (priority >= 50) return "High";
    return "Medium";
  };

  const priorityColor = getPriorityColor(priority);
  const priorityLabel = getPriorityLabel(priority);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg border bg-white hover:shadow-md transition-all cursor-pointer",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <Square className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">{action}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={cn("text-xs", priorityColor)}>
              Priority {priority} - {priorityLabel}
            </Badge>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-orange-600"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Learn about this action</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-xs">Click to understand why and how</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-orange-600" />
            <DialogTitle className="text-xl">
              Understanding This Action
            </DialogTitle>
          </div>
          <DialogDescription>
            Learn what to do, why it matters, and how to implement it
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* What Section */}
          <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-800">
                What should you do?
              </h4>
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">{action}</p>
            <div className="mt-2 p-3 bg-white rounded border border-blue-100">
              <p className="text-xs text-blue-700">
                <strong>Priority Level:</strong> {priorityLabel} (Score:{" "}
                {priority}/100)
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Higher priority actions have greater impact on your overall
                score
              </p>
            </div>
          </div>

          {/* Why Section */}
          <div className="space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-800">
                Why is this important?
              </h4>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">{why}</p>
          </div>

          {/* Quick Tips */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">
              Quick Tips
            </h4>
            <ul className="space-y-1 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  Start with high-priority actions first for maximum impact
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Implement changes incrementally and test results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  Re-run the audit after making improvements to track progress
                </span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
