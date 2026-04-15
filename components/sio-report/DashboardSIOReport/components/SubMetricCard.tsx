"use client";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { CommentList } from "./CommentList";
import { LockedContent } from "./LockedContent";
import { MetricStatement } from "./MetricStatement";
import { RecommendationsCard } from "./RecommendationsCard";

interface SubMetricCardProps {
  title: string;
  id: string;
  metric: {
    statement: string;
    score: number;
    current: string;
    positiveComments: string[];
    negativeComments: string[];
    recommendation: string[];
    suggested: string[];
    unclearTexts?: Array<{ text: string; issue: string; fix: string }>;
  };
  ctaHref: string;
  showCurrent?: boolean;
  isClaritySubmetric?: boolean;
}

/**
 * Reusable sub-metric card used for both Positioning and Clarity sub-metrics.
 * - Statement: always visible
 * - Comments: limited for guest/free, full for paid
 * - Recommendations & Suggestions: title visible, content locked for guest/free
 */
export function SubMetricCard({
  title,
  id,
  metric,
  ctaHref,
  showCurrent = true,
  isClaritySubmetric,
}: SubMetricCardProps) {
  const { tier, isPaid } = useSubscription(false);

  const scoreColor =
    metric.score >= 70
      ? "text-green-600"
      : metric.score >= 50
        ? "text-yellow-600"
        : metric.score >= 30
          ? "text-orange-600"
          : "text-red-600";

  const scoreBg =
    metric.score >= 70
      ? "bg-green-50"
      : metric.score >= 50
        ? "bg-yellow-50"
        : metric.score >= 30
          ? "bg-orange-50"
          : "bg-red-50";

  // Limit unclearTexts for guest/free
  const visibleUnclear = metric.unclearTexts || [];

  return (
    <div
      id={id}
      className="border border-slate-200 rounded-lg bg-white overflow-hidden"
    >
      {/* Header: Title + Score */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h4 className="text-lg font-bold text-slate-800">{title}</h4>
      </div>

      <div className="p-5 space-y-5">
        {/* Statement (always visible) */}
        {metric.statement && <MetricStatement statement={metric.statement} />}

        {/* Current text */}
        {showCurrent && metric.current && (
          <div className="rounded-lg border-2 border-slate-200 px-4 py-3">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Current
            </span>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              {metric.current}
            </p>
          </div>
        )}

        {/* Positive/Negative comments */}
        <CommentList
          positiveComments={metric.positiveComments}
          negativeComments={metric.negativeComments}
          positiveTitle="What works"
          negativeTitle="What's weak"
        />

        {/* Unclear texts (clarity metrics) - Always visible section */}
        {isClaritySubmetric && visibleUnclear.length ? (
          <div className="bg-red-100 px-4 py-8">
            <span className="text-xs font-bold uppercase tracking-wide text-orange-500">
              Unclear sentences, lines or texts to fix
            </span>
            {isPaid ? (
              <div>
                {visibleUnclear.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {visibleUnclear.map((item, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-orange-200 pl-3 py-1"
                      >
                        <div className="text-orange-700 text-sm line-through mb-0.5">
                          "{item.text}"
                        </div>
                        <div className="text-orange-600 text-xs italic mb-1">
                          ⚠ {item.issue}
                        </div>
                        <div className="text-green-700 text-sm font-medium">
                          → {item.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 text-sm text-slate-400">
                    No unclear text found.
                  </div>
                )}
              </div>
            ) : visibleUnclear.length ? (
              <div className="mt-2 text-sm text-slate-400 space-y-4">
                <div>
                  <p className="text-xl text-red-800 font-bold">
                    {visibleUnclear.length} unclear sentence(s) identified
                  </p>
                </div>
                {ctaHref && (
                  <Link href={ctaHref} className="flex-shrink-0">
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                    >
                      {tier === "guest"
                        ? "Sign up to fix them"
                        : "Upgrade to see what wrong and get exact fixes"}
                    </Button>
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        <RecommendationsCard
          title={"Recommendations "}
          recommendations={metric.recommendation || []}
          ctaHref={ctaHref}
        />

        {/* Suggestions - Always visible section */}
        <LockedContent
          title="Suggested fixes"
          icon={<Sparkles className="h-4 w-4 text-green-600 flex-shrink-0" />}
          textColor="text-green-600"
          ctaHref={ctaHref}
          ctaLabel={tier === "guest" ? "Sign up" : "Upgrade"}
        >
          <div className="">
            {metric.suggested.length > 0 ? (
              <ul className="space-y-2">
                {metric.suggested.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-green-800 font-medium bg-green-50 px-3 py-2 rounded border border-green-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                No copy-paste fixes needed for this metric.
              </p>
            )}
          </div>
        </LockedContent>
      </div>
    </div>
  );
}
