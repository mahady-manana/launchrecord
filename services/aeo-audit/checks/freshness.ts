import type { CheckFunction } from "../types";

export const freshnessCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { meta } = pageContent;

  if (meta.article?.published_time || meta.article?.modified_time) {
    evidence.push(`Published: ${meta.article.published_time || "N/A"}`);
    if (meta.article.modified_time) {
      evidence.push(`Modified: ${meta.article.modified_time}`);
    }
    score += 5;
  } else {
    recommendations.push("Add publication/modification dates to content");
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
