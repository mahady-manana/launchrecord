import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const trustSecurityCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { meta } = pageContent;

  if (url.startsWith("https://")) {
    evidence.push("Uses HTTPS");
    score += 1;
  }

  if (meta.og.site_name || meta.twitter.site) {
    evidence.push("Has verified site identity");
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
