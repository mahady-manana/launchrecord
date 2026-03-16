import type { CheckFunction } from "../types";

export const schemaJsonldCheck: CheckFunction = async (
  item,
  url,
  pageContent,
) => {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let score = 0;
  const { ldJson } = pageContent;
  const schemaTypes: string[] = [];

  // Handle both single objects and @graph structures
  ldJson.forEach((schema: any) => {
    // Check for @graph structure
    if (schema["@graph"] && Array.isArray(schema["@graph"])) {
      schema["@graph"].forEach((node: any) => {
        const type = node["@type"] || node.type;
        if (type) schemaTypes.push(type);
      });
    } else {
      // Single schema object
      const type = schema["@type"] || schema.type;
      if (type) schemaTypes.push(type);
    }
  });

  if (schemaTypes.length > 0) {
    evidence.push(
      `Found schemas: ${Array.from(new Set(schemaTypes)).join(", ")}`,
    );
    score += 8;
    ["Website", "Organization", "Article", "FAQPage", "Product"].forEach(
      (type) => {
        if (schemaTypes.includes(type)) {
          score += 1;
          evidence.push(`Has ${type} schema`);
        }
      },
    );
  } else {
    recommendations.push(
      "Add JSON-LD structured data (Website, Organization, Article schemas)",
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
