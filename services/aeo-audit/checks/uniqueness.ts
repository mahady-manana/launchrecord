import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const uniquenessCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;
  const text = simplifiedContent.replace(/<[^>]*>/g, "").toLowerCase();

  const originalityIndicators = ["our research", "our study", "we found", "our data", "original", "exclusive"];
  let originalityCount = 0;
  originalityIndicators.forEach((indicator) => {
    if (text.includes(indicator)) originalityCount++;
  });

  if (originalityCount > 0) {
    evidence.push("Contains originality signals");
    score += 3;
  }

  if (/\d+%|\d+\s*(million|billion|thousand)|\$\d+/.test(text)) {
    evidence.push("Contains statistical data");
    score += 2;
  } else {
    recommendations.push("Add original research, data, or unique insights");
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
