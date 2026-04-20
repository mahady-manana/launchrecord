"use client";

interface OverallScoreCardV2Props {
  score: number;
  band: "Dominant" | "Strong" | "Average" | "Weak" | "Ghost";
  statement: string;
}

export function OverallScoreCardV2({
  score,
  band,
  statement,
}: OverallScoreCardV2Props) {
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
      ? "bg-green-500"
      : score >= 50
        ? "bg-yellow-500"
        : score >= 30
          ? "bg-orange-500"
          : "bg-red-500";

  const bandColors: Record<string, string> = {
    Dominant: "bg-green-100 text-green-800",
    Strong: "bg-lime-100 text-lime-800",
    Average: "bg-blue-100 text-blue-800",
    Weak: "bg-orange-100 text-orange-800",
    Ghost: "bg-red-100 text-red-800",
  };

  return (
    <section className="py-8 border-b border-slate-200 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="44"
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="44"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${(score / 100) * 276.46} 276.46`}
                strokeLinecap="round"
                fill="none"
                className="text-blue-600"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-black ${scoreColor}`}>
                  {score}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  Score
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Executive Summary
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {statement}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${bandColors[band]}`}
            >
              {band}
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-semibold">Rating:</span> {band}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
