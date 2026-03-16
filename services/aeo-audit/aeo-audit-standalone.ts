import { AEO_CHECKLIST } from "../aeo_checklist";
import {
  getWebsiteContent,
  type WebsiteContentPayload,
} from "../getWebsiteContent";
import * as checks from "./checks";
import type { AEOAuditResult, StandaloneAEOAuditOptions } from "./types";

const checkFunctionMap: Record<string, typeof checks.crawlabilityCheck> = {
  crawlability: checks.crawlabilityCheck,
  schema_jsonld: checks.schemaJsonldCheck,
  answer_blocks: checks.answerBlocksCheck,
  topic_authority: checks.topicAuthorityCheck,
  entities_relations: checks.entitiesRelationsCheck,
  citation_author: checks.citationAuthorCheck,
  clarity_structure: checks.clarityStructureCheck,
  freshness: checks.freshnessCheck,
  external_mentions: checks.externalMentionsCheck,
  featured_snippet: checks.featuredSnippetCheck,
  answer_depth: checks.answerDepthCheck,
  ai_retrieval_vector: checks.aiRetrievalVectorCheck,
  keywords_semantic: checks.keywordsSemanticCheck,
  tech_perf_cwv: checks.techPerfCwvCheck,
  multimodal: checks.multimodalCheck,
  trust_security: checks.trustSecurityCheck,
  uniqueness: checks.uniquenessCheck,
};

/**
 * Standalone AEO Audit - No AI dependencies
 * Uses pre-parsed data from getWebsiteContent (no re-parsing)
 */
export async function runStandaloneAEOAudit(
  options: StandaloneAEOAuditOptions,
): Promise<AEOAuditResult> {
  const { url, timeout = 10000 } = options;
  const checklist = AEO_CHECKLIST;
  const checks: AEOAuditResult["checks"] = [];

  let pageContent: WebsiteContentPayload | null = null;

  try {
    pageContent = await getWebsiteContent(url, false);

    if (!pageContent) {
      throw new Error("Failed to fetch website content");
    }
  } catch (error) {
    return {
      url,
      score: 0,
      maxScore: 100,
      checks: checklist.map((c) => ({
        ...c,
        score: 0,
        maxScore: c.weight,
        passed: false,
        recommendations: [
          "Failed to fetch the website. Please ensure it's accessible.",
        ],
      })),
      timestamp: new Date(),
    };
  }

  for (const item of checklist) {
    const checkFn = checkFunctionMap[item.id];
    if (checkFn) {
      const result = await checkFn(item, url, pageContent);
      checks.push(result);
    } else {
      checks.push({
        id: item.id,
        name: item.name,
        description: item.description,
        weight: item.weight,
        score: 0,
        maxScore: item.weight,
        passed: false,
        recommendations: ["Check not implemented"],
      });
    }
  }

  const totalScore = checks.reduce((sum: number, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum: number, c) => sum + c.maxScore, 0);

  return {
    url,
    score: Math.round((totalScore / maxScore) * 100),
    maxScore: 100,
    checks,
    timestamp: new Date(),
  };
}
