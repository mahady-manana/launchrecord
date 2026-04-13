"use client";

import { useSubscription } from "@/hooks/use-subscription";
import clsx from "clsx";
import { ArrowRight, Check, Clock2, Copy, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CommentItem } from "./CommentItem";

interface MetricInsightProps {
  title: string;
  current?: string;
  currentTitle?: string;
  positiveComments?: string[];
  negativeComments?: string[];
  recommendation?: string[];
  suggested?: string[];
  compact?: boolean;
  score?: number;
  isGuest?: boolean;
  ctaHref?: string;
  statement?: string;
}

// Helper to blur remaining items
function BlurredMockItem({ isRed }: { isRed?: boolean }) {
  return (
    <li
      className={clsx(
        "flex items-start gap-3 text-sm py-1 blur-sm",
        isRed ? "text-red-800" : "text-green-800",
      )}
    >
      Please upgrade to unlock all insights, starting at $29.
    </li>
  );
}
// Reusable upgrade CTA component for all metrics
export function MetricUpgradeCTA({
  isGuest = false,
  ctaHref,
  message,
}: {
  isGuest?: boolean;
  ctaHref: string;
  message?: string;
}) {
  const { tier } = useSubscription(isGuest);

  const defaultMsg =
    tier === "guest"
      ? "Sign up to unlock full insights"
      : "Upgrade to see detailed analysis recommendations";

  if (tier === "paid") {
    return null;
  }
  return (
    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-orange-800 mb-1">
              {message || defaultMsg}
            </p>
          </div>
        </div>
        <Link href={ctaHref}>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {tier === "guest" ? "Sign up for free" : "Upgrade Now"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function MetricInsight({
  title,
  current,
  positiveComments,
  negativeComments,
  recommendation,
  suggested,
  currentTitle,
  compact = false,
  score,
  isGuest = false,
  ctaHref,
  statement,
}: MetricInsightProps) {
  const { tier, isPaid } = useSubscription(isGuest);
  const currentText = current?.trim() ? current : "Not clearly stated.";
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // no-op: clipboard permission denied
    }
  };

  // Apply limits based on user type

  const limitedPositive = isPaid
    ? positiveComments || []
    : (positiveComments || []).slice(0, 1);
  const limitedNegative = isPaid
    ? negativeComments || []
    : (negativeComments || []).slice(0, 1);
  const limitedRecommendation = isPaid
    ? recommendation || []
    : (recommendation || []).slice(0, 2);
  const limitedSuggested = isPaid
    ? suggested || []
    : (suggested || []).slice(0, 2);

  const blurredPositiveCount = isPaid
    ? 0
    : Math.max(0, (positiveComments?.length || 0) - 1);
  const blurredNegativeCount = isPaid
    ? 0
    : Math.max(0, (negativeComments?.length || 0) - 1);
  const hasBlurred =
    blurredPositiveCount > 0 || blurredNegativeCount > 0 || !isPaid;

  return (
    <div
      className={clsx(
        compact ? "space-y-3" : "space-y-4",
        "bg-white rounded-lg py-8",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-xl font-semibold text-slate-800">{title}</h4>
      </div>
      <div className="space-y-4 border-2 border-slate-200 rounded-lg p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center text-sm gap-4 text-slate-500 font-bold bg-slate-200 px-4 py-1 rounded-full ml-2">
            <Clock2 size={18} />
            <p>{currentTitle || "Current"}</p>
          </div>
          {score ? (
            <Badge variant="outline" className="text-sm text-slate-500">
              {score}
            </Badge>
          ) : null}
        </div>
        <p className="text-slate-500 leading-relaxed text-sm font-semibold">
          {currentText}
        </p>
      </div>

      {/* Structural Recommendations */}
      {recommendation && recommendation.length > 0 && (
        <div className="space-y-2 border-2 border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-amber-700 font-bold bg-amber-200 px-4 py-1 rounded-full ml-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <p>What to Fix</p>
            </div>
          </div>
          <ul className="space-y-1">
            {limitedRecommendation.map((item, idx) => (
              <li
                key={idx}
                className={clsx(
                  "border-b",
                  "font-semibold text-slate-500 text-sm last:border-b-0 px-3 py-2",
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copy Fixes (suggested) */}
      {suggested && suggested.length > 0 && (
        <div className="space-y-2 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-green-700 font-bold bg-green-200 px-4 py-1 rounded-full ml-2">
              <Sparkles size={18}></Sparkles>
              <p>Recommendations</p>
            </div>
          </div>
          <ul className="space-y-1">
            {limitedSuggested.map((item, idx) => (
              <li
                key={idx}
                className={clsx(
                  "relative border-b",
                  "group flex items-start justify-between gap-3 font-semibold text-slate-500 text-sm last:border-b-0",
                )}
              >
                <div className="flex-1 items-start gap-2 px-3 py-2 pr-8">
                  <p className="">
                    <span>{item}</span>
                  </p>
                </div>
                {isPaid && (
                  <button
                    type="button"
                    onClick={() => handleCopy(item, idx)}
                    className="absolute top-2 right-2 inline-flex items-center gap-1 text-xs font-semibold transition hover:text-slate-700"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Positive Comments */}
      {positiveComments && positiveComments.length > 0 && (
        <div className="space-y-2 border-2 border-green-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-green-500">
            Strengths To Keep
          </div>
          <ul className="space-y-2">
            {limitedPositive.map((comment, idx) => (
              <CommentItem key={idx} as="li" variant="neutral" text={comment} />
            ))}
            {/* Blurred items */}
            {Array.from({ length: isPaid ? 0 : 1 }).map((_, idx) => (
              <BlurredMockItem key={`blurred-pos-${idx}`} />
            ))}
          </ul>
        </div>
      )}

      {/* Negative Comments */}
      {negativeComments && negativeComments.length > 0 && (
        <div className="space-y-2 border-2 border-red-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-red-500">
            Conversion Blockers
          </div>
          <ul className="space-y-2">
            {limitedNegative.map((comment, idx) => (
              <CommentItem key={idx} as="li" variant="neutral" text={comment} />
            ))}
            {/* Blurred items */}
            {Array.from({ length: isPaid ? 0 : 3 }).map((_, idx) => (
              <BlurredMockItem isRed key={`blurred-neg-${idx}`} />
            ))}
          </ul>
        </div>
      )}

      {ctaHref && <MetricUpgradeCTA isGuest={isGuest} ctaHref={ctaHref} />}
    </div>
  );
}
