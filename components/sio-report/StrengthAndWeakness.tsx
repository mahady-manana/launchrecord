"use client";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import clsx from "clsx";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { CommentItem } from "./CommentItem";

function renderWithBlurredMocks(
  items: string[],
  tier: "guest" | "free" | "paid",
): { visible: string[]; blurredCount: number } {
  if (tier === "paid") return { visible: items, blurredCount: 0 };
  const limit = tier === "guest" ? 2 : 3;
  return {
    visible: items.slice(0, 2),
    blurredCount: 3,
  };
}

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

interface StrengthAndWeaknessProps {
  commentPositive?: string[];
  commentNegative?: string[];
  postiveTitle?: string;
  negativeTitle?: string;
  isGuest?: boolean;
  ctaHref?: string;
}

export function StrengthAndWeakness({
  commentPositive,
  commentNegative,
  postiveTitle,
  negativeTitle,
  isGuest = false,
  ctaHref,
}: StrengthAndWeaknessProps) {
  const { tier } = useSubscription(isGuest);
  const positiveRender = renderWithBlurredMocks(commentPositive || [], tier);
  const negativeRender = renderWithBlurredMocks(commentNegative || [], tier);
  const hasBlurred =
    positiveRender.blurredCount > 0 || negativeRender.blurredCount > 0;

  return (
    <div className="space-y-4 mb-6">
      {commentPositive && commentPositive.length > 0 && (
        <div className="space-y-2 border border border-green-100">
          <div className="text-sm font-semibold bg-green-100 uppercase px-4 py-1 text-green-800">
            {postiveTitle || "Strengths To Double Down"}
          </div>
          <ul className="space-y-2 p-4">
            {commentPositive.map((comment, idx) => (
              <CommentItem
                key={idx}
                as="li"
                variant="positive"
                text={comment}
              />
            ))}
          </ul>
        </div>
      )}

      {commentNegative && commentNegative.length > 0 && (
        <div className="space-y-2 border border-red-100">
          <div className="text-sm font-semibold text-red-700 uppercase px-4 py-1 bg-red-100">
            {negativeTitle || "Conversion Leaks"}
          </div>
          <ul className="space-y-2 p-4">
            {commentNegative.map((comment, idx) => (
              <CommentItem
                key={idx}
                as="li"
                variant="negative"
                text={comment}
              />
            ))}
          </ul>
        </div>
      )}

      {hasBlurred && ctaHref && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  {tier === "guest"
                    ? "Sign up to unlock full analysis"
                    : "Upgrade to unlock all insights"}
                </p>
              </div>
            </div>
            <Link href={ctaHref}>
              <Button size="sm" className="bg-primary">
                {tier === "guest" ? "Sign Up Free" : "Upgrade Now"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
