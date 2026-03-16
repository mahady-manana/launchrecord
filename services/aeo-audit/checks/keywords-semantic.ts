import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const keywordsSemanticCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { meta, simplifiedContent } = pageContent;
  const text = simplifiedContent.replace(/<[^>]*>/g, "").toLowerCase();

  const semanticIndicators = ["including", "such as", "for example", "like", "especially", "particularly"];
  let semanticCount = 0;
  semanticIndicators.forEach((indicator) => {
    if (text.includes(indicator)) semanticCount++;
  });

  if (semanticCount >= 3) {
    evidence.push("Uses semantic language patterns");
    score += 2;
  }

  if (meta.keywords) {
    evidence.push("Has meta keywords");
    score += 1;
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
    recommendations: semanticCount < 3 ? ["Add more semantic variety and related terms"] : [],
  };
};
