"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export interface CheckItemData {
  id: string;
  name: string;
  description: string;
  weight: number;
  score: number;
  maxScore: number;
  passed: boolean;
  evidence?: string[];
  recommendations?: string[];
}

interface AuditCheckDetailProps {
  check: CheckItemData;
  checklistName?: string;
  checklistDescription?: string;
}

export function AuditCheckDetail({
  check,
  checklistName,
  checklistDescription,
}: AuditCheckDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 70) return "bg-green-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-3">
            {check.passed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <h3 className="font-semibold text-slate-800">
                {checklistName || check.name}
              </h3>
              <p className="text-sm text-slate-500">
                {checklistDescription || check.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p
              className={`text-lg font-bold ${getScoreColor(check.score, check.maxScore)}`}
            >
              {Math.round((check.score / check.maxScore) * 100)}%
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4 ml-12 space-y-4 animate-in slide-in-from-top-2">
          {/* Score Progress */}

          {/* Evidence */}
          {check.evidence && check.evidence.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="font-medium text-green-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Evidence Found
              </p>
              <ul className="space-y-1">
                {check.evidence.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-green-700 flex items-start gap-2"
                  >
                    <span className="text-green-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {check.recommendations && check.recommendations.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <p className="font-medium text-amber-800 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Recommendations
              </p>
              <ul className="space-y-1">
                {check.recommendations.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-amber-700 flex items-start gap-2"
                  >
                    <span className="text-amber-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
