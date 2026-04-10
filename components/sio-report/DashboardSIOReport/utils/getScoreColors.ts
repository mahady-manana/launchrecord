export function getScoreColors(score: number): string {
  return score >= 70
    ? "text-green-600 bg-green-50"
    : score >= 50
      ? "text-yellow-600 bg-yellow-50"
      : score >= 30
        ? "text-orange-600 bg-orange-50"
        : "text-red-600 bg-red-50";
}
