import { getOpenAIClient } from "@/lib/openai";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import type { ClarityAuditOptions } from "./types";

interface ClarityAuditInput {
  website: string;
  name: string;
  tagline?: string;
  description?: string;
}

interface ClarityAuditResult {
  score: number;
  band: "instant" | "clear" | "average" | "confusing" | "opaque";
  critique: string;
  metrics: {
    headlineClarity: number;
    visualFlow: number;
    valueHierarchy: number;
    benefitClarity: number;
    ctaClarity: number;
    proofPlacement: number;
  };
  findings: string[];
  recommendations: Array<{
    action: string;
    priority: number;
  }>;
  fiveSecondTest: {
    passes: boolean;
    timeToUnderstand: number;
    frictionPoints: string[];
  };
}

const CLARITY_SYSTEM_PROMPT = `
ROLE:
You are a Product Clarity Audit Specialist focused on the "5-Second Test".
You evaluate how quickly visitors understand what a product does and why it matters.

TASK:
Analyze the provided website content for clarity velocity. Focus on:

1. HEADLINE CLARITY: Can visitors understand the headline in <3 seconds?
2. VISUAL FLOW: Does the design guide attention to key messages?
3. VALUE HIERARCHY: Is the most important information most visible?
4. BENEFIT CLARITY: Are outcomes and transformations clearly stated?
5. CTA CLARITY: Is the next step obvious and compelling?
6. PROOF PLACEMENT: Are trust signals strategically positioned?

SCORING RULES:
- INSTANT (90-100): Value proposition crystal clear in <3 seconds
- CLEAR (70-89): Value understood within 3-5 seconds
- AVERAGE (50-69): Some friction, takes 5-10 seconds
- CONFUSING (30-49): Visitors struggle, 10-20 seconds
- OPAQUE (0-29): Completely unclear, >20 seconds

PENALTY RULES:
- If headline uses clichés (empower, seamless, next-gen): MAX score = 50
- If no clear "what it does" above the fold: MAX score = 40
- If CTA is unclear or missing: MAX score = 60
- If jargon-heavy without explanation: MAX score = 45

OUTPUT:
Return ONLY valid JSON matching this schema:
{
  "score": number (0-100),
  "band": "instant" | "clear" | "average" | "confusing" | "opaque",
  "critique": string (<40 words, brutal assessment),
  "metrics": {
    "headlineClarity": number (0-100),
    "visualFlow": number (0-100),
    "valueHierarchy": number (0-100),
    "benefitClarity": number (0-100),
    "ctaClarity": number (0-100),
    "proofPlacement": number (0-100)
  },
  "findings": string[] (3-6 specific observations),
  "recommendations": [
    {
      "action": string (<30 words, actionable),
      "priority": number (0-100)
    }
  ] (5-10 items),
  "fiveSecondTest": {
    "passes": boolean,
    "timeToUnderstand": number (seconds, 1-30),
    "frictionPoints": string[] (2-5 specific friction points)
  }
}

STRICT REQUIREMENTS:
- No markdown, no explanations outside JSON
- Be brutally honest - clarity is binary (they get it or they don't)
- Focus on ABOVE THE FOLD analysis (what's visible without scrolling)
- Identify specific words, sections, or elements that cause confusion
`;

export async function runClarityAudit(
  options: ClarityAuditOptions & {
    name?: string;
    tagline?: string;
    description?: string;
  },
): Promise<ClarityAuditResult> {
  try {
    const client = await getOpenAIClient();

    // Fetch website content
    const webContent = await getWebsiteContent(options.url);
    const cleanContent = {
      url: options.url,
      name: options.name || "",
      tagline: options.tagline,
      description: options.description,
      content: webContent?.simplifiedContent,
      metadata: webContent?.meta,
      jsonLd: webContent?.ldJson,
    };

    const userPrompt = `
Analyze this product website for clarity velocity:

WEBSITE URL: ${options.url}
PRODUCT NAME: ${options.name || "Not provided"}
TAGLINE: ${options.tagline || "Not provided"}
DESCRIPTION: ${options.description || "Not provided"}

WEBSITE CONTENT:
${JSON.stringify(cleanContent, null, 2)}

Focus on what's visible ABOVE THE FOLD (first screen without scrolling).
Evaluate if a stranger can understand what this product does in 5 seconds.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: CLARITY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No clarity audit content returned from OpenAI");
    }

    const result = JSON.parse(content) as ClarityAuditResult;

    // Validate result
    if (
      typeof result.score !== "number" ||
      result.score < 0 ||
      result.score > 100
    ) {
      throw new Error("Invalid clarity score returned");
    }

    const validBands = [
      "instant",
      "clear",
      "average",
      "confusing",
      "opaque",
    ] as const;
    if (!validBands.includes(result.band as any)) {
      throw new Error("Invalid clarity band returned");
    }

    return result;
  } catch (error) {
    console.error("Clarity audit error:", error);
    throw error;
  }
}

export type { ClarityAuditOptions, ClarityAuditResult };
