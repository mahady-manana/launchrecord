"use client";

import { MetricInsight } from "@/components/sio-report";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { useProductStore } from "@/stores/product-store";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { getScoreColors } from "../utils";

interface LimitedMetricInsightProps {
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
  };
  ctaHref: string;
}

export function LimitedMetricInsight({
  title,
  id,
  isGuest = false,
  metric,
  ctaHref,
}: LimitedMetricInsightProps) {
  const { tier } = useSubscription(isGuest);
  const product = useProductStore((s) => s.selectedProduct);
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
                Sign up to see detailed analysis and recommendations
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

  return (
    <div id={id} className="px-0 relative">
      <MetricInsight
        title={title}
        statement={metric.statement}
        current={metric.current}
        positiveComments={metric.positiveComments}
        negativeComments={metric.negativeComments}
        recommendation={metric.recommendation}
        suggested={metric.suggested}
        score={metric.score}
        ctaHref={
          product?._id ? "/dashboard/" + product._id + "/subscription" : ctaHref
        }
      />
    </div>
  );
}
