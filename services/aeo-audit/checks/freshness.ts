import type { CheckFunction } from "../types";

export const freshnessCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { meta, simplifiedContent } = pageContent;

  // Check for date patterns in content
  const datePattern =
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi;
  const datesFound = simplifiedContent.match(datePattern);

  if (datesFound && datesFound.length > 0) {
    const uniqueDates = Array.from(new Set(datesFound));
    evidence.push(
      `Found ${uniqueDates.length} date reference(s): ${uniqueDates.slice(0, 3).join(", ")}`,
    );
    score += 5;
  } else {
    recommendations.push(
      "Add publication/modification dates to content for freshness signals",
    );
  }

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    weight: item.weight,
    score: Math.min(score, item.weight),
    maxScore: item.weight,
    passed: score >= item.weight * 0.7,
    evidence,
    recommendations,
  };
};
