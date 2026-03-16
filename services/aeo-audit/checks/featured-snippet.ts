import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const featuredSnippetCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;
  const text = simplifiedContent.replace(/<[^>]*>/g, "");

  const questionPatterns = [/\b(what|how|why|when|where|who)\b/i, /\?/];
  if (questionPatterns.some((pattern) => pattern.test(text))) {
    evidence.push("Contains question-style content");
    score += 3;
  }

  const definitionPatterns = [/\b(is|are|means|refers to)\b.*\./i, /\b(a|an|the) \w+ is\b/i];
  if (definitionPatterns.some((pattern) => pattern.test(text))) {
    evidence.push("Contains definition-style content");
    score += 2;
  } else {
    recommendations.push("Add clear definitions and concise answers suitable for featured snippets");
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
