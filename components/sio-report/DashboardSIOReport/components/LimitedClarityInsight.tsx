"use client";

import { MetricInsight } from "@/components/sio-report";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { getScoreColors, limitArray } from "../utils";

interface LimitedClarityInsightProps {
  title: string;
  id: string;
  isGuest?: boolean;
  metric: {
    statement?: string;
    score: number;
    current: string;
    positiveComments: string[];
    negativeComments: string[];
    recommendation: string[];
    suggested: string[];
    unclearTexts?: Array<{ text: string; issue: string; fix: string }>;
  };
  ctaHref: string;
}

export function LimitedClarityInsight({
  title,
  id,
  isGuest = false,
  metric,
  ctaHref,
}: LimitedClarityInsightProps) {
  const { tier } = useSubscription(isGuest);

  if (tier === "guest") {
    return (
      <div id={id} className="px-0 relative">
        <div className="space-y-4 bg-white rounded-lg py-8">
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-xl font-semibold text-slate-800">{title}</h4>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColors(metric.score)}`}
            >
              Score: {metric.score}/100
            </span>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8">
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 text-slate-400 mx-auto" />
              <p className="text-slate-600 font-medium">
                Sign up to see sentence-level analysis and fixes
              </p>
              <Link href={ctaHref}>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const limitedPositive = limitArray(metric.positiveComments, tier, {
    guest: 2,
    free: 3,
  });
  const limitedNegative = limitArray(metric.negativeComments, tier, {
    guest: 2,
    free: 3,
  });
  const limitedSuggested = limitArray(metric.suggested, tier, {
    guest: 1,
    free: 2,
  });
  const limitedUnclear =
    tier === "paid"
      ? metric.unclearTexts || []
      : (metric.unclearTexts || []).slice(0, tier === "free" ? 2 : 1);

  return (
    <div id={id} className="px-0 relative">
      <MetricInsight
        title={title}
        statement={metric.statement}
        current={metric.current}
        positiveComments={limitedPositive}
        negativeComments={limitedNegative}
        recommendation={metric.recommendation}
        suggested={limitedSuggested}
        score={metric.score}
        ctaHref={ctaHref}
      />

      {limitedUnclear.length > 0 && (
        <div className="mt-4 space-y-2">
          {limitedUnclear.map((item, idx) => (
            <div key={idx} className="border-l-2 border-orange-200 pl-3">
              <div className="text-orange-700 text-sm line-through mb-1">
                "{item.text}"
              </div>
              <div className="text-orange-600 text-xs italic mb-2">
                ⚠ {item.issue}
              </div>
              <div className="text-green-700 text-sm font-medium">
                → {item.fix}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
