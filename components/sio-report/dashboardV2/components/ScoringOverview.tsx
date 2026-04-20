"use client";

import { Progress } from "@/components/ui/progress";

interface ScoringOverviewProps {
  scoring: {
    overall: number;
    positioning: number;
    clarity: number;
    first_impression: number;
    aeo: number;
  };
  detailed?: boolean;
}

export function ScoringOverview({
  scoring,
  detailed = false,
}: ScoringOverviewProps) {
  const categories = [
    { key: "overall" as const, label: "Overall Score", color: "bg-blue-500" },
    {
      key: "positioning" as const,
      label: "Positioning",
      color: "bg-green-500",
    },
    { key: "clarity" as const, label: "Clarity", color: "bg-yellow-500" },
    {
      key: "first_impression" as const,
      label: "First Impression",
      color: "bg-purple-500",
    },
    { key: "aeo" as const, label: "AEO", color: "bg-red-500" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getBandText = (score: number) => {
    if (score >= 80) return "Dominant";
    if (score >= 65) return "Strong";
    if (score >= 50) return "Average";
    if (score >= 35) return "Weak";
    return "Ghost";
  };

  if (!detailed) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Scoring Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <div key={category.key} className="text-center">
              <div
                className={`text-2xl font-bold ${getScoreColor(scoring[category.key])}`}
              >
                {scoring[category.key]}
              </div>
              <div className="text-sm text-gray-600">{category.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-xl font-semibold mb-6">
          Detailed Scoring Breakdown
        </h3>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{category.label}</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${getScoreColor(scoring[category.key])}`}
                  >
                    {scoring[category.key]}/100
                  </span>
                  <span className="text-sm text-gray-500">
                    ({getBandText(scoring[category.key])})
                  </span>
                </div>
              </div>
              <Progress value={scoring[category.key]} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Ghost</span>
                <span>Weak</span>
                <span>Average</span>
                <span>Strong</span>
                <span>Dominant</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Scoring Methodology</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Overall:</strong> Weighted average of all category scores
          </p>
          <p>
            <strong>Positioning:</strong> How well you own your market category
            and differentiate from competitors
          </p>
          <p>
            <strong>Clarity:</strong> How clear and compelling your messaging
            and value proposition are
          </p>
          <p>
            <strong>First Impression:</strong> The immediate impact of your hero
            section and headline
          </p>
          <p>
            <strong>AEO:</strong> Artificial Engine Optimization - how well your
            site performs for AI search
          </p>
        </div>
      </div>
    </div>
  );
}
