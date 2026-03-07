"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CircularScoreProps {
  score: number;
  label?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showLabel?: boolean;
  showScore?: boolean;
  className?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

const sizeConfig = {
  xs: { width: 40, strokeWidth: 4, fontSize: "text-xs" },
  sm: { width: 60, strokeWidth: 5, fontSize: "text-sm" },
  md: { width: 80, strokeWidth: 6, fontSize: "text-base" },
  lg: { width: 120, strokeWidth: 8, fontSize: "text-2xl" },
  xl: { width: 180, strokeWidth: 10, fontSize: "text-4xl" },
  "2xl": { width: 240, strokeWidth: 12, fontSize: "text-6xl" },
};

export function CircularScore({
  score,
  label,
  size = "md",
  showLabel = true,
  showScore = true,
  className,
  icon: Icon,
  description,
}: CircularScoreProps) {
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return { stroke: "#22c55e", bg: "bg-green-50", text: "text-green-600" };
    if (score >= 70) return { stroke: "#84cc16", bg: "bg-lime-50", text: "text-lime-600" };
    if (score >= 40) return { stroke: "#f97316", bg: "bg-orange-50", text: "text-orange-600" };
    return { stroke: "#ef4444", bg: "bg-red-50", text: "text-red-600" };
  };

  const colors = getScoreColor(normalizedScore);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          colors.bg
        )}
        style={{ width: config.width, height: config.width }}
      >
        <svg
          width={config.width}
          height={config.width}
          className="rotate-[-90deg]"
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={config.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showScore && (
            <>
              {Icon && (
                <Icon
                  className={cn(
                    "mb-0.5",
                    size === "xs" ? "h-2.5 w-2.5" : 
                    size === "sm" ? "h-3 w-3" : 
                    size === "md" ? "h-4 w-4" : 
                    size === "lg" ? "h-5 w-5" : "h-6 w-6"
                  )}
                  style={{ color: colors.stroke }}
                />
              )}
              <span
                className={cn("font-bold tabular-nums", config.fontSize, colors.text)}
              >
                {normalizedScore}
              </span>
            </>
          )}
        </div>
      </div>
      {showLabel && label && (
        <span className="text-xs font-medium text-muted-foreground text-center">
          {label}
        </span>
      )}
      {description && (
        <span className="text-xs text-muted-foreground text-center max-w-[120px]">
          {description}
        </span>
      )}
    </div>
  );
}

interface SIOFivePillarsProps {
  aeoScore: number;
  positioningScore: number;
  clarityScore: number;
  momentumScore: number;
  proofScore: number;
  size?: "xs" | "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

export function SIOFivePillars({
  aeoScore,
  positioningScore,
  clarityScore,
  momentumScore,
  proofScore,
  size = "sm",
  showLabels = true,
  className,
}: SIOFivePillarsProps) {
  return (
    <div className={cn("grid grid-cols-5 gap-2", className)}>
      <CircularScore score={aeoScore} label={showLabels ? "AEO" : undefined} size={size} />
      <CircularScore score={positioningScore} label={showLabels ? "Position" : undefined} size={size} />
      <CircularScore score={clarityScore} label={showLabels ? "Clarity" : undefined} size={size} />
      <CircularScore score={momentumScore} label={showLabels ? "Momentum" : undefined} size={size} />
      <CircularScore score={proofScore} label={showLabels ? "Proof" : undefined} size={size} />
    </div>
  );
}

// Icon components
export function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function ZapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}
