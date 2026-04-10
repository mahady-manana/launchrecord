"use client";

import { Lock } from "lucide-react";
import { CommentItem } from "./CommentItem";

interface StrengthAndWeaknessProps {
  commentPositive?: string[];
  commentNegative?: string[];
  postiveTitle?: string;
  negativeTitle?: string;
  isGuest?: boolean;
}

interface LockedMetricProps {
  title: string;
}

function LockedMetric({ title }: LockedMetricProps) {
  return (
    <div className="py-4 border-b border-slate-200 last:border-b-0">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-slate-800">{title}</h4>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Locked
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
        <Lock className="h-4 w-4 text-slate-400" />
        <p>Sign up to unlock the exact copy to use</p>
      </div>
    </div>
  );
}

export function StrengthAndWeakness({
  commentPositive,
  commentNegative,
  postiveTitle,
  negativeTitle,
  isGuest,
}: StrengthAndWeaknessProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Positive Comments */}
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

      {/* Negative Comments */}
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
    </div>
  );
}
