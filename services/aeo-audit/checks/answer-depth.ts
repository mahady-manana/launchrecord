import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const answerDepthCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;
  const text = simplifiedContent.replace(/<[^>]*>/g, "").trim();
  const wordCount = text.split(/\s+/).length;

  if (wordCount > 1000) {
    evidence.push(`Content has ~${wordCount} words (good depth)`);
    score += 3;
  } else if (wordCount > 500) {
    evidence.push(`Content has ~${wordCount} words`);
    score += 2;
  } else {
    recommendations.push("Add more in-depth content and context");
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
