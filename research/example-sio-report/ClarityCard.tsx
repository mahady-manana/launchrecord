"use client";

import { SIOV5Report } from "../sio-v5-report-schema";

interface ClarityCardProps {
  report: SIOV5Report["clarity"];
}

interface SubMetricCardProps {
  name: string;
  score: number;
  current: string;
  comments: string[];
  suggested: string;
  unclearTexts: SIOV5Report["clarity"]["unclearSentences"];
}

function SubMetricCard({
  name,
  score,
  current,
  comments,
  suggested,
  unclearTexts,
}: SubMetricCardProps) {
  const scoreColor =
    score >= 70
      ? "text-green-600"
      : score >= 50
      ? "text-yellow-600"
      : score >= 30
      ? "text-orange-600"
      : "text-red-600";

  const scoreBg =
    score >= 70
      ? "bg-green-50"
      : score >= 50
      ? "bg-yellow-50"
      : score >= 30
      ? "bg-orange-50"
      : "bg-red-50";

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-800">{name}</h3>
        <div
          className={`px-2 py-1 rounded-full text-xs font-bold ${scoreBg} ${scoreColor}`}
        >
          {score}/100
        </div>
      </div>

      <div className="space-y-3">
        {/* Current */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <div className="text-xs text-red-600 font-semibold mb-1">
            Current:
          </div>
          <p className="text-red-700 text-sm line-through">{current}</p>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <div className="space-y-1">
            {comments.map((comment, idx) => (
              <div
                key={idx}
                className="text-orange-600 text-xs italic flex items-start gap-1"
              >
                <span>⚠</span>
                <span>{comment}</span>
              </div>
            ))}
          </div>
        )}

        {/* Unclear Texts */}
        {unclearTexts.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase">
              Unclear Sentences Found ({unclearTexts.length})
            </div>
            {unclearTexts.map((item, idx) => (
              <div key={idx} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
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

        {/* Suggested */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-xs text-green-600 font-semibold mb-1">
            Suggested:
          </div>
          <p className="text-green-700 text-sm font-medium">{suggested}</p>
        </div>
      </div>
    </div>
  );
}

export function ClarityCard({ report }: ClarityCardProps) {
  const scoreColor =
    report.score >= 70
      ? "text-green-600"
      : report.score >= 50
      ? "text-yellow-600"
      : report.score >= 30
      ? "text-orange-600"
      : "text-red-600";

  const scoreBg =
    report.score >= 70
      ? "bg-green-50"
      : report.score >= 50
      ? "bg-yellow-50"
      : report.score >= 30
      ? "bg-orange-50"
      : "bg-red-50";

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center`}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Clarity</h2>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${scoreBg} ${scoreColor}`}
          >
            Score: {report.score}/100
          </div>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed mb-6">{report.statement}</p>

      {/* Overall Clarity Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Overall Messaging
        </h3>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="text-xs text-slate-500 font-semibold mb-2">
            Current:
          </div>
          <p className="text-slate-700 text-sm mb-3">
            {report.summary.current}
          </p>

          {report.summary.comments.length > 0 && (
            <div className="space-y-1 mb-3">
              {report.summary.comments.map((comment, idx) => (
                <div
                  key={idx}
                  className="text-orange-600 text-xs italic flex items-start gap-1"
                >
                  <span>⚠</span>
                  <span>{comment}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs text-green-600 font-semibold mb-2">
            Suggested:
          </div>
          <p className="text-green-700 text-sm font-medium">
            {report.summary.suggested}
          </p>
        </div>
      </div>

      {/* Unclear Sentences Found */}
      {report.unclearSentences.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Unclear Sentences Found ({report.unclearSentences.length})
          </h3>
          <div className="space-y-2">
            {report.unclearSentences.map((item, idx) => (
              <div
                key={idx}
                className="bg-orange-50 rounded-lg p-3 border border-orange-200"
              >
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
        </div>
      )}

      {/* Sub-Metrics Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Clarity Dimensions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <SubMetricCard
            name={report.subMetrics.headlineClarity.name}
            score={report.subMetrics.headlineClarity.score}
            current={report.subMetrics.headlineClarity.current}
            comments={report.subMetrics.headlineClarity.comments}
            suggested={report.subMetrics.headlineClarity.suggested}
            unclearTexts={report.subMetrics.headlineClarity.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.valueProposition.name}
            score={report.subMetrics.valueProposition.score}
            current={report.subMetrics.valueProposition.current}
            comments={report.subMetrics.valueProposition.comments}
            suggested={report.subMetrics.valueProposition.suggested}
            unclearTexts={report.subMetrics.valueProposition.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.featureBenefitMapping.name}
            score={report.subMetrics.featureBenefitMapping.score}
            current={report.subMetrics.featureBenefitMapping.current}
            comments={report.subMetrics.featureBenefitMapping.comments}
            suggested={report.subMetrics.featureBenefitMapping.suggested}
            unclearTexts={report.subMetrics.featureBenefitMapping.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.visualHierarchy.name}
            score={report.subMetrics.visualHierarchy.score}
            current={report.subMetrics.visualHierarchy.current}
            comments={report.subMetrics.visualHierarchy.comments}
            suggested={report.subMetrics.visualHierarchy.suggested}
            unclearTexts={report.subMetrics.visualHierarchy.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.ctaClarity.name}
            score={report.subMetrics.ctaClarity.score}
            current={report.subMetrics.ctaClarity.current}
            comments={report.subMetrics.ctaClarity.comments}
            suggested={report.subMetrics.ctaClarity.suggested}
            unclearTexts={report.subMetrics.ctaClarity.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.proofPlacement.name}
            score={report.subMetrics.proofPlacement.score}
            current={report.subMetrics.proofPlacement.current}
            comments={report.subMetrics.proofPlacement.comments}
            suggested={report.subMetrics.proofPlacement.suggested}
            unclearTexts={report.subMetrics.proofPlacement.unclearTexts}
          />
        </div>
      </div>
    </div>
  );
}
