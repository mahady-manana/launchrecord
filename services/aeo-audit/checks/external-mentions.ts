import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const externalMentionsCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;

  const platformDomains = ["reddit.com", "github.com", "twitter.com", "medium.com", "dev.to"];
  let platformLinks = 0;
  platformDomains.forEach((domain) => {
    const matches = simplifiedContent.match(new RegExp(domain, "gi"));
    if (matches) platformLinks += matches.length;
  });

  if (platformLinks > 0) {
    evidence.push(`Links to ${platformLinks} external platform(s)`);
    score += 3;
  } else {
    recommendations.push("Reference external platforms (Reddit, GitHub, blogs) to build credibility");
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
