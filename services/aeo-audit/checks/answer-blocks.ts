import type { CheckFunction } from "../types";

export const answerBlocksCheck: CheckFunction = async (
  item,
  url,
  pageContent,
) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;
  const h1Count = (simplifiedContent.match(/<h1>/gi) || []).length;
  const h2Count = (simplifiedContent.match(/<h2>/gi) || []).length;
  const h3Count = (simplifiedContent.match(/<h3>/gi) || []).length;
  const pCount = (simplifiedContent.match(/<p>/gi) || []).length;
  const liCount = (simplifiedContent.match(/<li>/gi) || []).length;

  if (h1Count > 0) {
    evidence.push(`Has ${h1Count} H1 heading(s)`);
    score += 3;
  } else {
    recommendations.push("Add a clear H1 heading");
  }

  if (h2Count > 0) {
    evidence.push(`Has ${h2Count} H2 heading(s) for structure`);
    score += 2;
  }

  if (h3Count > 0) {
    evidence.push(`Has ${h3Count} H3 heading(s) for detail`);
    score += 1;
  }

  if (pCount > 5) {
    evidence.push(`Has ${pCount} paragraphs of content`);
    score += 2;
  }

  if (liCount > 0) {
    evidence.push(`Has ${liCount} list items for structured answers`);
    score += 2;
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
