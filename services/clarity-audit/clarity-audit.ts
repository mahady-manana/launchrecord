import { getOpenAIClient } from "@/lib/openai";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import type { ClarityAuditOptions, ClarityAuditResult } from "./types";

interface ClarityAuditInput {
  website: string;
  name: string;
  tagline?: string;
  description?: string;
}

const CLARITY_SYSTEM_PROMPT = `
ROLE:
You are a brutal Product Clarity Auditor. You don't give "feedback" - you give SURGICAL STRIKES.
Your job: Identify exactly why visitors don't understand the product in 5 seconds, and provide EXACT fixes.

ANALYSIS FRAMEWORK:

1. HEADLINE CLARITY (Most Critical)
   - Extract the exact current headline
   - Does it explain WHAT the product does in <3 seconds?
   - If vague, write a SPECIFIC replacement headline
   - Explain WHY the current headline fails

2. VALUE PROPOSITION
   - What value is currently communicated?
   - Is it outcome-focused or feature-focused? (features = bad)
   - Write a specific, outcome-driven value prop

3. VISUAL HIERARCHY
   - What element grabs attention first?
   - Is that the MOST important message?
   - If not, specify EXACTLY what should be moved/changed

4. BENEFIT CLARITY
   - List benefits that are clearly stated
   - List benefits that are implied but NOT stated (these are missing)
   - Benefits = outcomes, transformations, results (NOT features)

5. CTA CLARITY
   - Extract exact CTA text
   - Is it action-oriented? Specific? Urgent?
   - Write a better CTA with specific placement advice

6. PROOF ELEMENTS
   - List ALL proof elements found (logos, numbers, testimonials, etc.)
   - List proof elements that are MISSING but critical
   - Suggest SPECIFIC proof to add

SCORING RULES (BE HARSH):
- 90-100 (INSTANT): Stranger understands in <3 seconds. Rare.
- 70-89 (CLEAR): Understands in 3-5 seconds. Good.
- 50-69 (AVERAGE): Takes 5-10 seconds. Needs work.
- 30-49 (CONFUSING): Takes 10-20 seconds. Serious problems.
- 0-29 (OPAQUE): Still confused after 20 seconds. Catastrophic.

PENALTIES (AUTOMATIC):
- Headline uses clichés (empower, seamless, next-gen, revolutionize): -30 points
- No clear "what it does" above fold: -25 points
- Feature-focused instead of benefit-focused: -20 points
- CTA is generic ("Learn More", "Get Started"): -15 points
- No social proof above fold: -10 points

OUTPUT REQUIREMENTS:
- Be SPECIFIC. Quote exact text from the website.
- Give EXACT replacements, not vague advice.
- Every recommendation must include: before, after, why, how to implement.
- No fluff. No "consider". No "you might want to".
- If something is good, say it. If it's bad, destroy it.

RETURN STRICT JSON ONLY. No markdown. No explanations outside JSON.

JSON SCHEMA:
{
  "score": number (0-100),
  "band": "instant" | "clear" | "average" | "confusing" | "opaque",
  "executiveSummary": "string (2-3 brutal sentences - what's broken and what it costs)",
  
  "metrics": {
    "headlineClarity": {
      "score": number,
      "verdict": "string (one sentence)",
      "currentHeadline": "string (exact quote from site)",
      "problem": "string (why it fails)",
      "suggestedHeadline": "string (exact replacement)",
      "why": "string (why this works better)"
    },
    "valueProposition": {
      "score": number,
      "verdict": "string",
      "currentValueProp": "string (what they currently say)",
      "problem": "string",
      "suggestedValueProp": "string (outcome-focused replacement)",
      "why": "string"
    },
    "visualHierarchy": {
      "score": number,
      "verdict": "string",
      "problem": "string",
      "specificIssue": "string (exact element causing confusion)",
      "fix": "string (exact change to make)"
    },
    "benefitClarity": {
      "score": number,
      "verdict": "string",
      "problem": "string",
      "missingBenefits": ["string (benefits they should state but don't)"],
      "suggestedBenefits": ["string (how to phrase each benefit)"]
    },
    "ctaClarity": {
      "score": number,
      "verdict": "string",
      "currentCTA": "string (exact CTA text)",
      "problem": "string",
      "suggestedCTA": "string (specific, action-oriented)",
      "placement": "string (where to put it)"
    },
    "proofElements": {
      "score": number,
      "verdict": "string",
      "foundProof": ["string (proof elements found)"],
      "missingProof": ["string (critical missing proof)"],
      "suggestedProof": ["string (specific proof to add)"]
    }
  },
  
  "fiveSecondTest": {
    "passes": boolean,
    "estimatedTimeToUnderstand": number,
    "firstImpression": "string (what visitor thinks in 5 seconds)",
    "confusionPoints": ["string (specific things that cause confusion)"],
    "clarityWins": ["string (things that are actually clear)"]
  },
  
  "findings": {
    "critical": [{
      "issue": "string",
      "location": "string (where on page)",
      "impact": "string (what this costs)",
      "evidence": "string (exact quote or observation)"
    }],
    "warnings": [{
      "issue": "string",
      "location": "string",
      "impact": "string",
      "evidence": "string"
    }],
    "positives": [{
      "strength": "string",
      "location": "string",
      "why": "string (why this works)"
    }]
  },
  
  "recommendations": [{
    "priority": "critical" | "high" | "medium" | "low",
    "category": "headline" | "messaging" | "design" | "cta" | "proof" | "content",
    "action": "string (what to do)",
    "why": "string (why this matters)",
    "before": "string (current state)",
    "after": "string (desired state)",
    "implementation": {
      "steps": ["string (step by step)"],
      "effort": "low" | "medium" | "high",
      "expectedImpact": "string (what improvement to expect)"
    },
    "example": "string (concrete example of the fix)"
  }],
  
  "competitiveContext": {
    "clarityVsCompetitors": "behind" | "average" | "ahead",
    "industryStandardClarity": number,
    "yourClarity": number,
    "gap": "string (what separates you from leaders)"
  }
}
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
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "clarity_audit",
          strict: true,
          schema: {
            type: "object",
            properties: {
              score: {
                type: "integer",
                description: "Overall clarity score from 0-100",
              },
              band: {
                type: "string",
                enum: ["instant", "clear", "average", "confusing", "opaque"],
                description: "5-level clarity band assessment",
              },
              executiveSummary: {
                type: "string",
                description:
                  "2-3 brutal sentences on what's broken and what it costs",
              },
              metrics: {
                type: "object",
                properties: {
                  headlineClarity: {
                    type: "object",
                    properties: {
                      score: { type: "integer", description: "Score 0-100" },
                      verdict: {
                        type: "string",
                        description: "One sentence verdict",
                      },
                      currentHeadline: {
                        type: "string",
                        description: "Exact headline from site",
                      },
                      problem: {
                        type: "string",
                        description: "Why the headline fails",
                      },
                      suggestedHeadline: {
                        type: "string",
                        description: "Exact replacement headline",
                      },
                      why: {
                        type: "string",
                        description: "Why the suggested headline works better",
                      },
                    },
                    required: [
                      "score",
                      "verdict",
                      "currentHeadline",
                      "problem",
                      "suggestedHeadline",
                      "why",
                    ],
                    additionalProperties: false,
                  },
                  valueProposition: {
                    type: "object",
                    properties: {
                      score: { type: "integer", description: "Score 0-100" },
                      verdict: {
                        type: "string",
                        description: "One sentence verdict",
                      },
                      currentValueProp: {
                        type: "string",
                        description: "Current value prop from site",
                      },
                      problem: { type: "string", description: "Why it fails" },
                      suggestedValueProp: {
                        type: "string",
                        description: "Outcome-focused replacement",
                      },
                      why: {
                        type: "string",
                        description: "Why the suggestion works better",
                      },
                    },
                    required: [
                      "score",
                      "verdict",
                      "currentValueProp",
                      "problem",
                      "suggestedValueProp",
                      "why",
                    ],
                    additionalProperties: false,
                  },
                  visualHierarchy: {
                    type: "object",
                    properties: {
                      score: { type: "integer", description: "Score 0-100" },
                      verdict: {
                        type: "string",
                        description: "One sentence verdict",
                      },
                      problem: {
                        type: "string",
                        description: "The visual hierarchy problem",
                      },
                      specificIssue: {
                        type: "string",
                        description: "Exact element causing confusion",
                      },
                      fix: {
                        type: "string",
                        description: "Exact change to make",
                      },
                    },
                    required: [
                      "score",
                      "verdict",
                      "problem",
                      "specificIssue",
                      "fix",
                    ],
                    additionalProperties: false,
                  },
                  benefitClarity: {
                    type: "object",
                    properties: {
                      score: { type: "integer", description: "Score 0-100" },
                      verdict: {
                        type: "string",
                        description: "One sentence verdict",
                      },
                      problem: {
                        type: "string",
                        description: "The benefit clarity problem",
                      },
                      missingBenefits: {
                        type: "array",
                        items: { type: "string" },
                        description: "Benefits they should state but don't",
                      },
                      suggestedBenefits: {
                        type: "array",
                        items: { type: "string" },
                        description: "How to phrase each benefit",
                      },
                    },
                    required: [
                      "score",
                      "verdict",
                      "problem",
                      "missingBenefits",
                      "suggestedBenefits",
                    ],
                    additionalProperties: false,
                  },
                  ctaClarity: {
                    type: "object",
                    properties: {
                      score: { type: "integer", description: "Score 0-100" },
                      verdict: {
                        type: "string",
                        description: "One sentence verdict",
                      },
                      currentCTA: {
                        type: "string",
                        description: "Exact CTA text from site",
                      },
                      problem: {
                        type: "string",
                        description: "Why the CTA fails",
                      },
                      suggestedCTA: {
                        type: "string",
                        description: "Specific, action-oriented CTA",
                      },
                      placement: {
                        type: "string",
                        description: "Where to place the CTA",
                      },
                    },
                    required: [
                      "score",
                      "verdict",
                      "currentCTA",
                      "problem",
                      "suggestedCTA",
                      "placement",
                    ],
                    additionalProperties: false,
                  },
                  proofElements: {
                    type: "object",
                    properties: {
                      score: { type: "integer", description: "Score 0-100" },
                      verdict: {
                        type: "string",
                        description: "One sentence verdict",
                      },
                      foundProof: {
                        type: "array",
                        items: { type: "string" },
                        description: "Proof elements found on site",
                      },
                      missingProof: {
                        type: "array",
                        items: { type: "string" },
                        description: "Critical missing proof elements",
                      },
                      suggestedProof: {
                        type: "array",
                        items: { type: "string" },
                        description: "Specific proof to add",
                      },
                    },
                    required: [
                      "score",
                      "verdict",
                      "foundProof",
                      "missingProof",
                      "suggestedProof",
                    ],
                    additionalProperties: false,
                  },
                },
                required: [
                  "headlineClarity",
                  "valueProposition",
                  "visualHierarchy",
                  "benefitClarity",
                  "ctaClarity",
                  "proofElements",
                ],
                additionalProperties: false,
              },
              fiveSecondTest: {
                type: "object",
                properties: {
                  passes: {
                    type: "boolean",
                    description: "Whether it passes the 5-second test",
                  },
                  estimatedTimeToUnderstand: {
                    type: "integer",
                    description: "Seconds to understand (1-30)",
                  },
                  firstImpression: {
                    type: "string",
                    description: "What visitor thinks in first 5 seconds",
                  },
                  confusionPoints: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific things causing confusion",
                  },
                  clarityWins: {
                    type: "array",
                    items: { type: "string" },
                    description: "Things that are actually clear",
                  },
                },
                required: [
                  "passes",
                  "estimatedTimeToUnderstand",
                  "firstImpression",
                  "confusionPoints",
                  "clarityWins",
                ],
                additionalProperties: false,
              },
              findings: {
                type: "object",
                properties: {
                  critical: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        issue: { type: "string" },
                        location: { type: "string" },
                        impact: { type: "string" },
                        evidence: { type: "string" },
                      },
                      required: ["issue", "location", "impact", "evidence"],
                      additionalProperties: false,
                    },
                  },
                  warnings: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        issue: { type: "string" },
                        location: { type: "string" },
                        impact: { type: "string" },
                        evidence: { type: "string" },
                      },
                      required: ["issue", "location", "impact", "evidence"],
                      additionalProperties: false,
                    },
                  },
                  positives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        strength: { type: "string" },
                        location: { type: "string" },
                        why: { type: "string" },
                      },
                      required: ["strength", "location", "why"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["critical", "warnings", "positives"],
                additionalProperties: false,
              },
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    priority: {
                      type: "string",
                      enum: ["critical", "high", "medium", "low"],
                    },
                    category: {
                      type: "string",
                      enum: [
                        "headline",
                        "messaging",
                        "design",
                        "cta",
                        "proof",
                        "content",
                      ],
                    },
                    action: { type: "string" },
                    why: { type: "string" },
                    before: { type: "string" },
                    after: { type: "string" },
                    implementation: {
                      type: "object",
                      properties: {
                        steps: {
                          type: "array",
                          items: { type: "string" },
                        },
                        effort: {
                          type: "string",
                          enum: ["low", "medium", "high"],
                        },
                        expectedImpact: { type: "string" },
                      },
                      required: ["steps", "effort", "expectedImpact"],
                      additionalProperties: false,
                    },
                    example: { type: "string" },
                  },
                  required: [
                    "priority",
                    "category",
                    "action",
                    "why",
                    "before",
                    "after",
                    "implementation",
                    "example",
                  ],
                  additionalProperties: false,
                },
              },
              competitiveContext: {
                type: "object",
                properties: {
                  clarityVsCompetitors: {
                    type: "string",
                    enum: ["behind", "average", "ahead"],
                  },
                  industryStandardClarity: { type: "integer" },
                  yourClarity: { type: "integer" },
                  gap: { type: "string" },
                },
                required: [
                  "clarityVsCompetitors",
                  "industryStandardClarity",
                  "yourClarity",
                  "gap",
                ],
                additionalProperties: false,
              },
            },
            required: [
              "score",
              "band",
              "executiveSummary",
              "metrics",
              "fiveSecondTest",
              "findings",
              "recommendations",
              "competitiveContext",
            ],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.3,
    });
    const content = response.choices[0]?.message?.content;
    console.log("====================================");
    console.log({ content });
    console.log("====================================");
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
