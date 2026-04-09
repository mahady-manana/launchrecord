"use client";

import clsx from "clsx";
import { Check, Clock2, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { CommentItem } from "./CommentItem";

interface MetricInsightProps {
  title: string;
  current?: string;
  currentTitle?: string;
  positiveComments?: string[];
  negativeComments?: string[];
  suggested?: string[];
  compact?: boolean;
  score?: number;
  isGuest?: boolean;
  statement?: string;
}

export function MetricInsight({
  title,
  current,
  positiveComments,
  negativeComments,
  suggested,
  currentTitle,
  compact = false,
  score,
  isGuest,
  statement,
}: MetricInsightProps) {
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

      {!isGuest && suggested && suggested.length > 0 && (
        <div className="space-y-2 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-sm text-green-700 font-bold bg-green-200 px-4 py-1 rounded-full ml-2">
              <Sparkles size={18}></Sparkles>
              <p>Recommendations</p>
            </div>
          </div>
          <ul className="space-y-1">
            {suggested.map((item, idx) => (
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
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isGuest && positiveComments && positiveComments.length > 0 && (
        <div className="space-y-2 border-2 border-green-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-green-500">
            Strengths To Keep
          </div>
          <ul className="space-y-2">
            {positiveComments.map((comment, idx) => (
              <CommentItem key={idx} as="li" variant="neutral" text={comment} />
            ))}
          </ul>
        </div>
      )}

      {!isGuest && negativeComments && negativeComments.length > 0 && (
        <div className="space-y-2 border-2 border-red-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-red-500">
            Conversion Blockers
          </div>
          <ul className="space-y-2">
            {negativeComments.map((comment, idx) => (
              <CommentItem key={idx} as="li" variant="neutral" text={comment} />
            ))}
          </ul>
        </div>
      )}

      {isGuest ? (
        <div className="text-slate-500">
          <p>Please sign up to read more details.</p>
        </div>
      ) : null}
    </div>
  );
}
