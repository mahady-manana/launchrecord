"use client";

import { AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

interface CurrentStateProps {
  current: string;
  negativeComments?: string[];
  positiveComments?: string[];
}

export function CurrentState({
  current,
  negativeComments = [],
  positiveComments = [],
}: CurrentStateProps) {
  return (
    <div>
      <div className="flex items-start gap-2 mb-2">
        <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
        <span className="text-sm font-bold text-orange-700 uppercase">
          Current
        </span>
      </div>
      <p className="text-sm text-slate-700 italic pl-6">"{current}"</p>

      {/* Negative Comments (Issues) */}
      {negativeComments.length > 0 && (
        <div className="mt-2 pl-6 space-y-1">
          {negativeComments.map((comment, idx) => (
            <p key={idx} className="text-sm text-orange-800">
              • {comment}
            </p>
          ))}
        </div>
      )}

      {/* Positive Comments (Strengths) */}
      {positiveComments.length > 0 && (
        <div className="mt-2 pl-6 space-y-1">
          {positiveComments.map((comment, idx) => (
            <p key={idx} className="text-sm text-green-800">
              • {comment}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

interface SuggestedStateProps {
  suggestions: string[];
  label?: string;
}

export function SuggestedState({
  suggestions,
  label = "Suggested",
}: SuggestedStateProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
        <span className="text-sm font-bold text-green-700 uppercase">
          {label}
        </span>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, idx) => {
          const key = `suggestion-${idx}`;
          return (
            <div
              key={idx}
              className="flex items-start justify-between gap-2 bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <p className="text-sm text-green-900 font-medium flex-1">
                "{suggestion}"
              </p>
              <button
                onClick={() => handleCopy(suggestion, key)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex-shrink-0"
              >
                {copiedIndex === key ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MetricSectionProps {
  title: string;
  current?: string;
  negativeComments?: string[];
  positiveComments?: string[];
  suggestions?: string[];
  suggestionLabel?: string;
}

export function MetricSection({
  title,
  current,
  negativeComments = [],
  positiveComments = [],
  suggestions = [],
  suggestionLabel = "Suggested",
}: MetricSectionProps) {
  const hasContent = current || suggestions.length > 0;

  if (!hasContent) return null;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-3 py-2">
        <span className="text-sm font-bold text-slate-600 uppercase">
          {title}
        </span>
      </div>
      <div className="p-3 space-y-3">
        {current && (
          <CurrentState
            current={current}
            negativeComments={negativeComments}
            positiveComments={positiveComments}
          />
        )}
        {suggestions.length > 0 && (
          <SuggestedState suggestions={suggestions} label={suggestionLabel} />
        )}
      </div>
    </div>
  );
}

interface StatementCardProps {
  statement: string;
}

export function StatementCard({ statement }: StatementCardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <p className="text-sm text-slate-700">{statement}</p>
    </div>
  );
}
