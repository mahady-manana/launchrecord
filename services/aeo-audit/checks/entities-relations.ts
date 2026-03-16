import type { AEOCheckResult, CheckFunction } from "../types";
import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export const entitiesRelationsCheck: CheckFunction = async (item, url, pageContent) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { ldJson, simplifiedContent } = pageContent;

  let hasEntities = false;
  ldJson.forEach((schema: any) => {
    const jsonStr = JSON.stringify(schema);
    if (jsonStr.includes("Person") || jsonStr.includes("Organization") || jsonStr.includes("Product")) {
      hasEntities = true;
    }
  });

  if (hasEntities) {
    evidence.push("Schema contains entity references");
    score += 3;
  }

  const text = simplifiedContent.replace(/<[^>]*>/g, "");
  const entityPatterns = [/[A-Z][a-z]+ [A-Z][a-z]+/g, /Inc\.|LLC|Ltd\.|Corp\./g, /CEO|CTO|Founder/g];
  let entityCount = 0;
  entityPatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) entityCount += matches.length;
  });

  if (entityCount > 5) {
    evidence.push(`Found ${entityCount} potential entity mentions`);
    score += 2;
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
    recommendations: hasEntities ? [] : ["Add structured entity data (people, organizations, products)"],
  };
};
