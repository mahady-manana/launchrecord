import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const citationAuthorCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { meta, simplifiedContent } = pageContent;

  if (meta.author) {
    evidence.push(`Author: ${meta.author}`);
    score += 4;
  } else {
    recommendations.push("Add clear author attribution to content");
  }

  const linkCount = (simplifiedContent.match(/<a /gi) || []).length;
  if (linkCount > 3) {
    evidence.push(`Has ${linkCount} outbound/citation links`);
    score += 4;
  } else if (linkCount > 0) {
    evidence.push(`Has ${linkCount} link(s)`);
    score += 2;
  } else {
    recommendations.push("Add citations linking to authoritative sources");
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
