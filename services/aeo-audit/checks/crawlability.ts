import type { CheckFunction } from "../types";

export const crawlabilityCheck: CheckFunction = async (
  item,
  url,
  pageContent,
) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { robottxts, sitemap, meta } = pageContent;

  // Check robots.txt - No robots.txt means fully crawlable (good for AEO)
  if (robottxts && robottxts.trim().length > 0) {
    evidence.push("robots.txt exists");
    // Check if it blocks AI bots
    if (robottxts.includes("Disallow: /")) {
      evidence.push("Warning: Blocks all bots from root");
      recommendations.push("Remove 'Disallow: /' to allow AI bot access");
      score += 1; // Minimal score for blocking everything
    } else if (robottxts.includes("GPTBot") || robottxts.includes("CCBot")) {
      evidence.push("Specifically blocks AI bots (GPTBot/CCBot)");
      recommendations.push("Remove AI bot blocks to improve AEO visibility");
      score += 2;
    } else {
      evidence.push("No restrictive rules found for AI bots");
      score += 5; // Good - has robots.txt but allows AI
    }
  } else {
    recommendations.push("No robots.txt");
    score += 5; // Good - no restrictions
  }

  // Check meta robots
  if (meta.robots) {
    if (!meta.robots.includes("noindex") && !meta.robots.includes("nofollow")) {
      evidence.push("Meta robots allows indexing");
      score += 3;
    } else {
      evidence.push(`Meta robots: ${meta.robots}`);
      recommendations.push(
        "Remove noindex/nofollow if content should be discoverable",
      );
      score += 1;
    }
  } else {
    evidence.push("No restrictive meta robots tags");
    score += 3;
  }

  // Check sitemap
  if (sitemap === "accessible" || sitemap === "present") {
    evidence.push("sitemap.xml exists and is accessible");
    score += 2;
  } else if (sitemap === "not_accessible") {
    recommendations.push("Ensure sitemap.xml is accessible (return 200 OK)");
    score += 1;
  } else {
    recommendations.push("Add sitemap.xml to help AI bots discover all pages");
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
