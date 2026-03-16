import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const clarityStructureCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { simplifiedContent } = pageContent;

  const listItems = (simplifiedContent.match(/<li>/gi) || []).length;
  if (listItems > 5) {
    evidence.push(`Has ${listItems} list items for clarity`);
    score += 2;
  }

  const tables = (simplifiedContent.match(/<table>/gi) || []).length;
  if (tables > 0) {
    evidence.push(`Has ${tables} table(s) for structured data`);
    score += 2;
  }

  const orderedLists = (simplifiedContent.match(/<ol>/gi) || []).length;
  if (orderedLists > 0) {
    evidence.push(`Has ${orderedLists} numbered list(s)`);
    score += 1;
  }

  const text = simplifiedContent.replace(/<[^>]*>/g, "").toLowerCase();
  const fluffWords = ["revolutionary", "game-changing", "cutting-edge", "best-in-class", "world-class"];
  const fluffCount = fluffWords.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);

  if (fluffCount === 0) {
    evidence.push("Minimal marketing fluff detected");
    score += 1;
  } else {
    recommendations.push("Reduce marketing language for clearer content");
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
