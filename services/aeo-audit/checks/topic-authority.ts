import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const topicAuthorityCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;
  const text = simplifiedContent.replace(/<[^>]*>/g, "").toLowerCase();

  const clusterKeywords = ["related", "see also", "learn more", "more about", "categories"];
  if (clusterKeywords.some((kw) => text.includes(kw))) {
    evidence.push("Has content clustering signals");
    score += 3;
  }

  const linkCount = (simplifiedContent.match(/<a /gi) || []).length;
  if (linkCount > 10) {
    evidence.push(`Has ${linkCount} internal links`);
    score += 5;
  } else if (linkCount > 5) {
    evidence.push(`Has ${linkCount} internal links`);
    score += 3;
  } else {
    recommendations.push("Add more internal links to build topic clusters");
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
