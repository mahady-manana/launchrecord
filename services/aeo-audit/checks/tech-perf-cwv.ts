import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const techPerfCwvCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { meta } = pageContent;

  if (url.startsWith("https://")) {
    evidence.push("Uses HTTPS");
    score += 1;
  } else {
    recommendations.push("Migrate to HTTPS for security and SEO");
  }

  if (meta.language || meta.charset) {
    evidence.push("Has proper document metadata");
    score += 1;
  }

  if (meta.og.url || meta.twitter.site) {
    evidence.push("Has social media optimization");
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
    recommendations,
  };
};
