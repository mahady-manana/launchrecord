"use client";

import { Badge } from "@/components/ui/badge";
import { getProductBadge } from "@/lib/product-status";
import { cn, getGrade } from "@/lib/utils";

interface GradeBadgeProps {
  score?: number | null;
  grade?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GradeBadge({
  score,
  grade,
  size = "sm",
  className,
}: GradeBadgeProps) {
  const resolvedGrade = grade || getGrade(score);

  const sizeClasses = {
    sm: "w-5 h-5 text-xs border-2",
    md: "w-10 h-10 text-lg border-2",
    lg: "w-12 h-12 text-xl border-2",
  };

  if (resolvedGrade === "-" || Number.isNaN(resolvedGrade)) {
    return (
      <Badge
        variant="outline"
        className={cn("text-xs rounded-full", className)}
      >
        -
      </Badge>
    );
  }
  const gradeColor = getProductBadge(resolvedGrade);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold text-white",
        sizeClasses[size],
        className,
      )}
      style={{
        borderColor: gradeColor.colorHex,
        backgroundColor: gradeColor.colorHex,
      }}
    >
      {resolvedGrade}
    </div>
  );
}
