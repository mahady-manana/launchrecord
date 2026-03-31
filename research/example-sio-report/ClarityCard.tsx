"use client";

import { SIOV5Report } from "../sio-v5-report-schema";

interface ClarityCardProps {
  report: SIOV5Report["clarity"];
}

interface SubMetricCardProps {
  name: string;
  score: number;
  current: string;
  positiveComments: string[];
  negativeComments: string[];
  suggested: string[];
  unclearTexts: SIOV5Report["clarity"]["unclearSentences"];
}

function SubMetricCard({
  name,
  score,
  current,
  positiveComments,
  negativeComments,
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
        {positiveComments && positiveComments.length > 0 && (
          <div className="space-y-1">
            {positiveComments.map((comment, idx) => (
              <div
                key={idx}
                className="text-green-600 text-xs italic flex items-start gap-1"
              >
                <span>✓</span>
                <span>{comment}</span>
              </div>
            ))}
          </div>
        )}

        {negativeComments && negativeComments.length > 0 && (
          <div className="space-y-1">
            {negativeComments.map((comment, idx) => (
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
        )}

        {/* Suggested */}
        {suggested && suggested.length > 0 && (
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-xs text-green-600 font-semibold mb-1">
              Suggested:
            </div>
            <ul className="space-y-1">
              {suggested.map((item, idx) => (
                <li
                  key={idx}
                  className="text-green-700 text-sm font-medium flex items-start gap-1"
                >
                  <span className="text-green-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
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

      {/* Overall Comments Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Positive Comments */}
        {report.overallCommentPositive &&
          report.overallCommentPositive.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-green-800 mb-2">
                    What's Working Well
                  </div>
                  <ul className="space-y-1">
                    {report.overallCommentPositive.map((comment, idx) => (
                      <li
                        key={idx}
                        className="text-green-700 text-sm flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        <span>{comment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

        {/* Negative Comments */}
        {report.overallCommentNegative &&
          report.overallCommentNegative.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-red-800 mb-2">
                    Areas to Improve
                  </div>
                  <ul className="space-y-1">
                    {report.overallCommentNegative.map((comment, idx) => (
                      <li
                        key={idx}
                        className="text-red-700 text-sm flex items-start gap-2"
                      >
                        <span className="text-red-500 mt-1">•</span>
                        <span>{comment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
      </div>

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

          {/* Positive Comments */}
          {report.summary.positiveComments &&
            report.summary.positiveComments.length > 0 && (
              <div className="space-y-1 mb-3">
                {report.summary.positiveComments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="text-green-600 text-xs italic flex items-start gap-1"
                  >
                    <span>✓</span>
                    <span>{comment}</span>
                  </div>
                ))}
              </div>
            )}

          {/* Negative Comments */}
          {report.summary.negativeComments &&
            report.summary.negativeComments.length > 0 && (
              <div className="space-y-1 mb-3">
                {report.summary.negativeComments.map((comment, idx) => (
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

          {/* Suggested */}
          {report.summary.suggested && report.summary.suggested.length > 0 && (
            <div>
              <div className="text-xs text-green-600 font-semibold mb-2">
                Suggested:
              </div>
              <ul className="space-y-1">
                {report.summary.suggested.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-green-700 text-sm font-medium flex items-start gap-1"
                  >
                    <span className="text-green-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
            positiveComments={
              report.subMetrics.headlineClarity.positiveComments
            }
            negativeComments={
              report.subMetrics.headlineClarity.negativeComments
            }
            suggested={report.subMetrics.headlineClarity.suggested}
            unclearTexts={report.subMetrics.headlineClarity.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.valueProposition.name}
            score={report.subMetrics.valueProposition.score}
            current={report.subMetrics.valueProposition.current}
            positiveComments={
              report.subMetrics.valueProposition.positiveComments
            }
            negativeComments={
              report.subMetrics.valueProposition.negativeComments
            }
            suggested={report.subMetrics.valueProposition.suggested}
            unclearTexts={report.subMetrics.valueProposition.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.featureBenefitMapping.name}
            score={report.subMetrics.featureBenefitMapping.score}
            current={report.subMetrics.featureBenefitMapping.current}
            positiveComments={
              report.subMetrics.featureBenefitMapping.positiveComments
            }
            negativeComments={
              report.subMetrics.featureBenefitMapping.negativeComments
            }
            suggested={report.subMetrics.featureBenefitMapping.suggested}
            unclearTexts={report.subMetrics.featureBenefitMapping.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.visualHierarchy.name}
            score={report.subMetrics.visualHierarchy.score}
            current={report.subMetrics.visualHierarchy.current}
            positiveComments={
              report.subMetrics.visualHierarchy.positiveComments
            }
            negativeComments={
              report.subMetrics.visualHierarchy.negativeComments
            }
            suggested={report.subMetrics.visualHierarchy.suggested}
            unclearTexts={report.subMetrics.visualHierarchy.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.ctaClarity.name}
            score={report.subMetrics.ctaClarity.score}
            current={report.subMetrics.ctaClarity.current}
            positiveComments={report.subMetrics.ctaClarity.positiveComments}
            negativeComments={report.subMetrics.ctaClarity.negativeComments}
            suggested={report.subMetrics.ctaClarity.suggested}
            unclearTexts={report.subMetrics.ctaClarity.unclearTexts}
          />
          <SubMetricCard
            name={report.subMetrics.proofPlacement.name}
            score={report.subMetrics.proofPlacement.score}
            current={report.subMetrics.proofPlacement.current}
            positiveComments={report.subMetrics.proofPlacement.positiveComments}
            negativeComments={report.subMetrics.proofPlacement.negativeComments}
            suggested={report.subMetrics.proofPlacement.suggested}
            unclearTexts={report.subMetrics.proofPlacement.unclearTexts}
          />
        </div>
      </div>
    </div>
  );
}
