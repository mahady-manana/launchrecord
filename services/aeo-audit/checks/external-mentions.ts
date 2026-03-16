import { searchExternalMentions } from "@/services/tavily-search";
import type { CheckFunction } from "../types";

export const externalMentionsCheck: CheckFunction = async (
  item,
  url,
  pageContent,
) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;

  // Extract domain from URL
  let domain = "";
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    domain = urlObj.hostname;
  } catch {
    domain = url;
  }

  // Search for external mentions using Tavily
  const externalResults = await searchExternalMentions(domain, {
    maxResults: 5,
    searchDepth: "advanced",
  });

  // Filter out own domain mentions
  const externalMentions = externalResults.filter((result) => {
    try {
      const resultUrl = new URL(result.url);
      return resultUrl.hostname !== domain && !resultUrl.hostname.endsWith(`.${domain}`);
    } catch {
      return false;
    }
  });

  if (externalMentions.length > 0) {
    evidence.push(`Found ${externalMentions.length} external mention(s) across the web`);
    score += Math.min(externalMentions.length * 2, 5);
  }

  // Also check for outbound links to platforms on the site
  const platformDomains = [
    "reddit.com",
    "github.com",
    "twitter.com",
    "medium.com",
    "dev.to",
    "news.ycombinator.com",
    "producthunt.com",
  ];
  let platformLinks = 0;
  platformDomains.forEach((domain) => {
    const matches = simplifiedContent.match(new RegExp(domain, "gi"));
    if (matches) platformLinks += matches.length;
  });

  if (platformLinks > 0) {
    evidence.push(
      `References ${platformLinks} external platform(s)`,
    );
    score += 2;
  }

  if (externalMentions.length === 0 && platformLinks === 0) {
    recommendations.push(
      "Build online presence: get mentioned on Reddit, GitHub, Twitter, Product Hunt, or tech blogs",
    );
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
