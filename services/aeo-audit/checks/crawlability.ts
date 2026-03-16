import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const crawlabilityCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { robottxts, sitemap, meta } = pageContent;

  if (robottxts && robottxts.trim().length > 0) {
    evidence.push("robots.txt exists");
    score += 3;
    if (!robottxts.includes("Disallow: /")) {
      evidence.push("No blanket disallow rules found");
      score += 2;
    } else {
      recommendations.push("Review robots.txt for overly restrictive rules");
    }
  } else {
    recommendations.push("Add a robots.txt file to guide AI bots");
  }

  if (meta.robots) {
    if (!meta.robots.includes("noindex") && !meta.robots.includes("nofollow")) {
      evidence.push("Meta robots allows indexing");
      score += 3;
    } else {
      recommendations.push("Remove noindex/nofollow if content should be discoverable");
    }
  } else {
    evidence.push("No restrictive meta robots tags found");
    score += 2;
  }

  if (sitemap === "accessible" || sitemap === "present") {
    evidence.push("sitemap.xml exists and is accessible");
    score += 2;
  } else if (sitemap === "not_accessible") {
    recommendations.push("Ensure sitemap.xml is accessible");
  } else {
    recommendations.push("Add a sitemap.xml to help AI bots discover content");
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
