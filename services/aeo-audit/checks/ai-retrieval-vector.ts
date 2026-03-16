import type { CheckFunction } from "../types";

export const aiRetrievalVectorCheck: CheckFunction = async (
  item,
  url,
  pageContent,
) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;

  const tables = (simplifiedContent.match(/<table>/gi) || []).length;
  const lists = (simplifiedContent.match(/<(ul|ol)>/gi) || []).length;
  if (tables + lists > 0) {
    evidence.push("Has structured content (tables/lists)");
    score += 2;
  }

  const paragraphs = (simplifiedContent.match(/<p>/gi) || []).length;
  if (paragraphs > 0) {
    evidence.push(`${paragraphs} paragraph(s) for retrieval`);
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
