import { aeo_checklist } from "../aeo_checklist";
import { getWebsiteContent, type WebsiteContentPayload } from "../getWebsiteContent";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import axios from "axios";

export interface AEOAuditResult {
  url: string;
  score: number;
  maxScore: number;
  checks: AEOCheckResult[];
  timestamp: Date;
}

export interface AEOCheckResult {
  id: string;
  name: string;
  description: string;
  weight: number;
  score: number;
  maxScore: number;
  passed: boolean;
  evidence?: string[];
  recommendations?: string[];
}

export interface AIAEOAuditOptions {
  url: string;
  openaiApiKey?: string;
  searchApiKey?: string;
  timeout?: number;
  includeWebSearch?: boolean;
}

/**
 * AI-Powered AEO Audit with Web Search
 * Uses AI for content analysis and web search for external mentions
 */
export async function runAIAEOAudit(
  options: AIAEOAuditOptions
): Promise<AEOAuditResult> {
  const {
    url,
    openaiApiKey = process.env.OPENAI_API_KEY,
    searchApiKey = process.env.TAVILY_API_KEY || process.env.DASHSCOPE_API_KEY,
    timeout = 10000,
    includeWebSearch = true,
  } = options;

  const checklist = parseChecklist();
  const checks: AEOCheckResult[] = [];

  // Fetch the page content using getWebsiteContent
  let pageContent: WebsiteContentPayload | null = null;
  let html = "";
  let $: cheerio.CheerioAPI;
  let robotsTxt = "";
  let sitemapStatus: string | undefined;

  try {
    pageContent = await getWebsiteContent(url);
    if (!pageContent) {
      throw new Error("Failed to fetch website content");
    }

    // Extract data from getWebsiteContent result
    html = pageContent.html;
    robotsTxt = pageContent.robottxts || "";
    sitemapStatus = pageContent.sitemap;
    $ = cheerio.load(html);
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
        recommendations: ["Failed to fetch the website. Please ensure it's accessible."],
      })),
      timestamp: new Date(),
    };
  }

  // Initialize OpenAI client if API key is available
  const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

  // Use full HTML content for AI analysis
  const extractedContent = html;

  // Run each check
  for (const item of checklist) {
    let result: AEOCheckResult;

    // Use AI for specific checks that benefit from semantic analysis
    if (openai && shouldUseAI(item.id)) {
      result = await runAIEnhancedCheck(
        item,
        url,
        $,
        html,
        extractedContent,
        openai,
        searchApiKey,
        includeWebSearch,
        robotsTxt,
        sitemapStatus
      );
    } else {
      result = await runStandaloneCheck(item, url, $, html, robotsTxt, sitemapStatus);
    }

    checks.push(result);
  }

  // Calculate total score
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxScore, 0);

  return {
    url,
    score: Math.round((totalScore / maxScore) * 100),
    maxScore: 100,
    checks,
    timestamp: new Date(),
  };
}

function parseChecklist() {
  const match = aeo_checklist.match(/\[([\s\S]*?)\]/);
  if (!match) {
    throw new Error("Failed to parse AEO checklist");
  }

  const jsonStr = match[0];
  const checklist = JSON.parse(jsonStr);
  return checklist as Array<{
    id: string;
    name: string;
    description: string;
    weight: number;
  }>;
}

function shouldUseAI(checkId: string): boolean {
  // These checks benefit from AI semantic analysis
  const aiEnhancedChecks = [
    "answer_blocks",
    "topic_authority",
    "entities_relations",
    "citation_author",
    "clarity_structure",
    "featured_snippet",
    "answer_depth",
    "ai_retrieval_vector",
    "keywords_semantic",
    "uniqueness",
  ];
  return aiEnhancedChecks.includes(checkId);
}

async function runAIEnhancedCheck(
  item: { id: string; name: string; description: string; weight: number },
  url: string,
  $: cheerio.CheerioAPI,
  html: string,
  pageContent: string,
  openai: OpenAI,
  searchApiKey?: string,
  includeWebSearch?: boolean,
  robotsTxt?: string,
  sitemapStatus?: string
): Promise<AEOCheckResult> {
  let webSearchContext = "";

  // Perform web search for external mentions if enabled
  if (includeWebSearch && searchApiKey && item.id === "external_mentions") {
    try {
      webSearchContext = await searchWebMentions(url, searchApiKey);
    } catch (error) {
      console.warn("Web search failed:", error);
    }
  }

  const prompt = buildAIPrompt(item, url, pageContent, webSearchContext);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AEO (Answer Engine Optimization) expert. Analyze the provided website content and return a JSON response with the following structure: {\"score\": number (0-weight), \"passed\": boolean, \"evidence\": string[], \"recommendations\": string[]}. Be concise and specific.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const aiResult = JSON.parse(content);

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      weight: item.weight,
      score: Math.min(aiResult.score || 0, item.weight),
      maxScore: item.weight,
      passed: aiResult.passed || false,
      evidence: aiResult.evidence || [],
      recommendations: aiResult.recommendations || [],
    };
  } catch (error) {
    console.warn(`AI analysis failed for ${item.id}, falling back to standalone check`);
    return await runStandaloneCheck(item, url, $, html, robotsTxt, sitemapStatus);
  }
}

async function runStandaloneCheck(
  item: { id: string; name: string; description: string; weight: number },
  url: string,
  $: cheerio.CheerioAPI,
  html: string,
  robotsTxt?: string,
  sitemapStatus?: string
): Promise<AEOCheckResult> {
  const checkFn = standaloneCheckFunctions[item.id];
  if (!checkFn) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      weight: item.weight,
      score: 0,
      maxScore: item.weight,
      passed: false,
      recommendations: ["Check not implemented"],
    };
  }

  return await checkFn(item, url, $, html, robotsTxt, sitemapStatus);
}

async function searchWebMentions(url: string, apiKey: string): Promise<string> {
  // Extract domain from URL
  const domain = new URL(url).hostname;

  // Use Tavily or similar search API
  const searchQuery = `"${domain}" review OR mention OR discussion`;

  try {
    // Tavily API
    const response: any = await axios.post(
      "https://api.tavily.com/search",
      {
        query: searchQuery,
        num_results: 5,
        search_depth: "basic",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (response.data?.results) {
      const results = response.data.results.slice(0, 3);
      return results
        .map((r: any) => `- ${r.title} (${r.url})`)
        .join("\n");
    }
  } catch (error) {
    // Try Dashscope (Alibaba) as fallback
    try {
      const response: any = await axios.get(
        "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          params: {
            model: "qwen-turbo",
            input: {
              messages: [
                {
                  role: "user",
                  content: `Search for mentions of ${domain}`,
                },
              ],
            },
          },
        }
      );

      if (response.data?.output?.text) {
        return response.data.output.text;
      }
    } catch {
      // Both search APIs failed
    }
  }

  return "";
}

function buildAIPrompt(
  item: { id: string; name: string; description: string; weight: number },
  url: string,
  pageContent: string,
  webSearchContext: string
): string {
  const prompts: Record<string, string> = {
    answer_blocks: `Analyze this website content for AEO answer blocks optimization.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Check for:
- Clear headings (H1, H2, H3) that structure content logically
- Direct, concise answers in paragraphs
- Lists and bullet points for scannable content
- Question-answer format sections

Return JSON with score (0-10), passed, evidence array, and recommendations array.`,

    topic_authority: `Analyze this website for topic authority and cluster signals.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Check for:
- Comprehensive coverage of the main topic
- Internal linking structure (if HTML available)
- Semantic relationships between content sections
- Evidence of expertise and depth

Return JSON with score (0-10), passed, evidence array, and recommendations array.`,

    entities_relations: `Analyze this website for entity recognition and relationships.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Identify:
- People, organizations, products, technologies mentioned
- Relationships between entities
- Structured data (schema.org) if present

Return JSON with score (0-5), passed, evidence array (list entities found), and recommendations array.`,

    citation_author: `Analyze this website for author citations and credibility signals.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Check for:
- Clear author attribution
- References to external sources
- Outbound links to authoritative sources
- Credentials and expertise signals

Return JSON with score (0-10), passed, evidence array, and recommendations array.`,

    clarity_structure: `Analyze this website for content clarity and structure.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Evaluate:
- Use of bullets, tables, numbered lists
- Minimal marketing fluff and jargon
- Clear, direct language
- Scannable formatting

Return JSON with score (0-5), passed, evidence array, and recommendations array.`,

    featured_snippet: `Analyze this website for featured snippet optimization.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Check for:
- Short definitions (40-60 words)
- Step-by-step instructions
- FAQ-style Q&A format
- Clear, concise answers to common questions

Return JSON with score (0-5), passed, evidence array, and recommendations array.`,

    answer_depth: `Analyze this website for answer depth and comprehensiveness.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Evaluate:
- Content length and depth
- Context and rationale provided
- Links to related topics
- Coverage of edge cases and nuances

Return JSON with score (0-5), passed, evidence array, and recommendations array.`,

    ai_retrieval_vector: `Analyze this website for AI retrieval optimization.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Check for:
- Short paragraphs for easy chunking
- Structured data (tables, lists, Q&A)
- Clear semantic structure
- Vector-friendly formatting

Return JSON with score (0-5), passed, evidence array, and recommendations array.`,

    keywords_semantic: `Analyze this website for semantic keyword coverage.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

Evaluate:
- LSI keywords and synonyms
- NLP-relevant entities
- Semantic variety in language
- Topic coverage breadth

Return JSON with score (0-3), passed, evidence array, and recommendations array.`,

    uniqueness: `Analyze this website for content uniqueness and originality.

URL: ${url}

Content (first 5000 chars): ${pageContent.slice(0, 5000)}

${webSearchContext ? `Web search results:\n${webSearchContext}\n\n` : ""}

Check for:
- Original research or data
- Unique insights and perspectives
- Proprietary information
- First-party expertise

Return JSON with score (0-5), passed, evidence array, and recommendations array.`,

    external_mentions: `Analyze external mentions for this website.

URL: ${url}

${webSearchContext ? `Web search results:\n${webSearchContext}\n\n` : "No web search data available.\n\n"}

Evaluate the presence and quality of third-party mentions on:
- Reddit discussions
- GitHub repositories
- Blog mentions
- Academic papers

Return JSON with score (0-5), passed, evidence array (list specific mentions), and recommendations array.`,
  };

  return (
    prompts[item.id] ||
    `Analyze ${item.name}: ${item.description}

URL: ${url}

Content: ${pageContent.slice(0, 3000)}

Return JSON with score (0-${item.weight}), passed, evidence array, and recommendations array.`
  );
}

// Standalone check functions (same as aeo-audit-standalone.ts)
const standaloneCheckFunctions: Record<
  string,
  (
    item: { id: string; name: string; description: string; weight: number },
    url: string,
    $: cheerio.CheerioAPI,
    html: string,
    robotsTxt?: string,
    sitemapStatus?: string
  ) => Promise<AEOCheckResult>
> = {
  crawlability: async (item, url, $, html, robotsTxt = "", sitemapStatus) => {
    const evidence: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Check robots.txt (already fetched)
    if (robotsTxt && robotsTxt.trim().length > 0) {
      evidence.push("robots.txt exists");
      score += 3;
      if (!robotsTxt.includes("Disallow: /")) {
        evidence.push("No blanket disallow rules found");
        score += 2;
      } else {
        recommendations.push("Review robots.txt for overly restrictive rules");
      }
    } else {
      recommendations.push("Add a robots.txt file to guide AI bots");
    }

    // Check meta robots
    const metaRobots = $('meta[name="robots"], meta[name="googlebot"]');
    if (metaRobots.length > 0) {
      const content = metaRobots.attr("content") || "";
      if (!content.includes("noindex") && !content.includes("nofollow")) {
        evidence.push("Meta robots allows indexing");
        score += 3;
      } else {
        recommendations.push("Remove noindex/nofollow if content should be discoverable");
      }
    } else {
      evidence.push("No restrictive meta robots tags found");
      score += 2;
    }

    // Check sitemap status (already fetched)
    if (sitemapStatus === "accessible" || sitemapStatus === "present") {
      evidence.push("sitemap.xml exists and is accessible");
      score += 2;
    } else if (sitemapStatus === "not_accessible") {
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
  },

  schema_jsonld: async (item, url, $, html) => {
    const evidence: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Find JSON-LD scripts
    const jsonLdScripts = $('script[type="application/ld+json"]');
    const schemaTypes: string[] = [];

    jsonLdScripts.each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "");
        const type = json["@type"] || json.type;
        if (type) {
          schemaTypes.push(type);
        }
      } catch {
        // Invalid JSON, skip
      }
    });

    if (schemaTypes.length > 0) {
      evidence.push(`Found schemas: ${Array.from(new Set(schemaTypes)).join(", ")}`);
      score += 8;

      // Check for important types
      const importantTypes = ["Website", "Organization", "Article", "FAQPage", "Product"];
      for (const type of importantTypes) {
        if (schemaTypes.includes(type)) {
          score += 1;
          evidence.push(`Has ${type} schema`);
        }
      }
    } else {
      recommendations.push("Add JSON-LD structured data (Website, Organization, Article schemas)");
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
  },

  freshness: async (item, url, $, html) => {
    const evidence: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Check for date signals
    const dateSelectors = [
      'time[datetime]',
      '[class*="date"]',
      '[class*="time"]',
      '[itemprop="datePublished"]',
      '[itemprop="dateModified"]',
    ];

    let hasDate = false;
    for (const selector of dateSelectors) {
      const el = $(selector);
      if (el.length > 0) {
        hasDate = true;
        const dateAttr = el.attr("datetime") || el.attr("content") || el.text();
        evidence.push(`Date signal found: ${dateAttr}`);
        score += 5;
        break;
      }
    }

    if (!hasDate) {
      recommendations.push("Add publication/modification dates to content");
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
  },

  tech_perf_cwv: async (item, url, $, html) => {
    const evidence: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Check for HTTPS
    if (url.startsWith("https://")) {
      evidence.push("Uses HTTPS");
      score += 1;
    } else {
      recommendations.push("Migrate to HTTPS for security and SEO");
    }

    // Check for viewport meta (mobile)
    const viewport = $('meta[name="viewport"]');
    if (viewport.length > 0) {
      evidence.push("Has viewport meta tag (mobile-friendly)");
      score += 1;
    } else {
      recommendations.push("Add viewport meta tag for mobile optimization");
    }

    // Check for preload/prefetch hints
    const preloadLinks = $('link[rel="preload"], link[rel="prefetch"]').length;
    if (preloadLinks > 0) {
      evidence.push(`Has ${preloadLinks} performance hint(s)`);
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
  },

  multimodal: async (item, url, $, html) => {
    const evidence: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Check for images
    const images = $("img").length;
    if (images > 0) {
      evidence.push(`Has ${images} image(s)`);
      score += 1;

      // Check for alt text
      let imagesWithAlt = 0;
      $("img").each((_, el) => {
        if ($(el).attr("alt")) {
          imagesWithAlt++;
        }
      });

      if (imagesWithAlt === images) {
        evidence.push("All images have alt text");
        score += 1;
      } else {
        recommendations.push(`Add alt text to ${images - imagesWithAlt} image(s)`);
      }
    } else {
      recommendations.push("Add images, diagrams, or charts with alt text");
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
  },

  trust_security: async (item, url, $, html) => {
    const evidence: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Check for HTTPS
    if (url.startsWith("https://")) {
      evidence.push("Uses HTTPS");
      score += 1;
    }

    // Check for privacy policy link
    const privacyLink = $('a[href*="privacy"], a[href*="policy"]').length;
    if (privacyLink > 0) {
      evidence.push("Has privacy policy link");
      score += 1;
    } else {
      recommendations.push("Add a privacy policy page and link to it");
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
  },
};
