import { getOpenAIClient } from "@/lib/openai";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import type {
  CategoryOwnershipResult,
  CompetitiveDifferentiationResult,
  MessagingConsistencyResult,
  PositioningAuditOptions,
  PositioningAuditResult,
  ProblemSolutionFitResult,
  TargetAudienceClarityResult,
  UniqueValuePropositionResult,
} from "./types";

/**
 * Standalone Startup Positioning Audit Service
 *
 * Analyzes a startup's website to evaluate:
 * - Category ownership and positioning
 * - Unique value proposition clarity
 * - Competitive differentiation
 * - Target audience definition
 * - Problem-solution fit
 * - Messaging consistency
 */
export async function runPositioningAudit(
  options: PositioningAuditOptions,
): Promise<PositioningAuditResult> {
  const { url, timeout = 15000 } = options;
  const openai = getOpenAIClient();

  // Fetch website content
  const pageContent = await getWebsiteContent(url, true);

  if (!pageContent) {
    throw new Error("Failed to fetch website content");
  }

  // Extract key content sections
  const contentContext = buildContentContext(pageContent);

  // Run all positioning analyses
  const [
    categoryOwnership,
    uniqueValueProposition,
    competitiveDifferentiation,
    targetAudienceClarity,
    problemSolutionFit,
    messagingConsistency,
  ] = await Promise.all([
    analyzeCategoryOwnership(openai, contentContext, url),
    analyzeUniqueValueProposition(openai, contentContext, url),
    analyzeCompetitiveDifferentiation(openai, contentContext, url),
    analyzeTargetAudienceClarity(openai, contentContext, url),
    analyzeProblemSolutionFit(openai, contentContext, url),
    analyzeMessagingConsistency(openai, contentContext, url),
  ]);

  // Calculate overall score
  const totalScore =
    categoryOwnership.score +
    uniqueValueProposition.score +
    competitiveDifferentiation.score +
    targetAudienceClarity.score +
    problemSolutionFit.score +
    messagingConsistency.score;

  const maxScore =
    categoryOwnership.maxScore +
    uniqueValueProposition.maxScore +
    competitiveDifferentiation.maxScore +
    targetAudienceClarity.maxScore +
    problemSolutionFit.maxScore +
    messagingConsistency.maxScore;

  const overallScore = Math.round((totalScore / maxScore) * 100);

  return {
    url,
    overallScore,
    categoryOwnership,
    uniqueValueProposition,
    competitiveDifferentiation,
    targetAudienceClarity,
    problemSolutionFit,
    messagingConsistency,
    timestamp: new Date(),
  };
}

function buildContentContext(pageContent: any): string {
  const sections: string[] = [];

  if (pageContent.title) {
    sections.push(`Title: ${pageContent.title}`);
  }

  if (pageContent.description) {
    sections.push(`Meta Description: ${pageContent.description}`);
  }

  if (pageContent.h1) {
    sections.push(`H1: ${pageContent.h1}`);
  }

  if (
    pageContent.h2 &&
    Array.isArray(pageContent.h2) &&
    pageContent.h2.length > 0
  ) {
    sections.push(`H2s: ${pageContent.h2.join(" | ")}`);
  }

  if (pageContent.simplifiedContent) {
    sections.push(`Content: ${pageContent.simplifiedContent}`);
  }

  return sections.join("\n\n");
}

async function analyzeCategoryOwnership(
  openai: any,
  contentContext: string,
  url: string,
): Promise<CategoryOwnershipResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert startup positioning analyst. Analyze the startup's website content to evaluate their category ownership and positioning.

Evaluate:
1. What category/market are they trying to own?
2. What keywords and terms are associated with this category?
3. How clearly do they define their category?
4. What keywords are they missing that would strengthen category ownership?
5. Who are the likely category leaders they're competing against?

Rate category ownership on a 5-level scale:
- Dominant (90-100): They own the category completely
- Strong (70-89): Clear category leadership
- Blended (50-69): Understandable but not distinct
- Weak (30-49): Unclear category positioning
- Ghost (0-29): Invisible or non-existent category presence

Be specific and actionable in your analysis.`,
      },
      {
        role: "user",
        content: `Analyze this startup's category ownership based on their website content:\n\n${contentContext}\n\nURL: ${url}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "category_ownership",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "Score from 0-100",
            },
            categoryOwnershipLevel: {
              type: "string",
              enum: ["Dominant", "Strong", "Blended", "Weak", "Ghost"],
              description: "5-level category ownership assessment",
            },
            categoryDefinition: {
              type: "string",
              description:
                "Clear statement of what category this startup is trying to own",
            },
            ownedKeywords: {
              type: "array",
              items: { type: "string" },
              description:
                "Keywords this startup successfully owns in their category",
            },
            missingKeywords: {
              type: "array",
              items: { type: "string" },
              description: "Important keywords they should own but don't",
            },
            categoryLeaders: {
              type: "array",
              items: { type: "string" },
              description: "Main competitors or leaders in this category",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description:
                "Actionable recommendations to strengthen category ownership",
            },
          },
          required: [
            "score",
            "categoryOwnershipLevel",
            "categoryDefinition",
            "ownedKeywords",
            "missingKeywords",
            "categoryLeaders",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.3,
  });

  const result = JSON.parse(
    response.choices[0].message.content as string,
  ) as CategoryOwnershipResult;

  return {
    ...result,
    maxScore: 100,
  };
}

async function analyzeUniqueValueProposition(
  openai: any,
  contentContext: string,
  url: string,
): Promise<UniqueValuePropositionResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert startup positioning analyst. Analyze the startup's unique value proposition (UVP).

Evaluate:
1. What is their stated or implied UVP?
2. How clearly is it communicated?
3. How unique is it compared to typical solutions in the market?
4. What evidence supports their UVP claims?

Rate UVP on 5-level scales:
- UVP Clarity: Exceptional, Clear, Moderate, Unclear, Absent
- Uniqueness Level: Highly Unique, Distinctive, Moderate, Generic, Common

Be critical and specific. A strong UVP is clear, specific, and meaningfully different from alternatives.`,
      },
      {
        role: "user",
        content: `Analyze this startup's unique value proposition:\n\n${contentContext}\n\nURL: ${url}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "unique_value_proposition",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "Score from 0-100",
            },
            identifiedUVP: {
              type: "string",
              description:
                "Clear statement of the startup's unique value proposition",
            },
            uvpClarity: {
              type: "string",
              enum: ["Exceptional", "Clear", "Moderate", "Unclear", "Absent"],
              description: "5-level UVP clarity assessment",
            },
            uniquenessLevel: {
              type: "string",
              enum: [
                "Highly Unique",
                "Distinctive",
                "Moderate",
                "Generic",
                "Common",
              ],
              description: "5-level uniqueness assessment",
            },
            supportingEvidence: {
              type: "array",
              items: { type: "string" },
              description:
                "Specific evidence from the website supporting the UVP",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description: "Actionable recommendations to strengthen the UVP",
            },
          },
          required: [
            "score",
            "identifiedUVP",
            "uvpClarity",
            "uniquenessLevel",
            "supportingEvidence",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.3,
  });

  const result = JSON.parse(
    response.choices[0].message.content as string,
  ) as UniqueValuePropositionResult;

  return {
    ...result,
    maxScore: 100,
  };
}

async function analyzeCompetitiveDifferentiation(
  openai: any,
  contentContext: string,
  url: string,
): Promise<CompetitiveDifferentiationResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert startup positioning analyst. Analyze how this startup differentiates from competitors.

Evaluate:
1. Who are their apparent competitors (mentioned or implied)?
2. What differentiation factors do they emphasize?
3. Where are their weak points or gaps in differentiation?
4. How defensible is their positioning?

Rate differentiation strength on a 5-level scale:
- Dominant (90-100): Unassailable differentiation
- Strong (70-89): Clear competitive advantages
- Moderate (50-69): Some differentiation present
- Weak (30-49): Minimal differentiation
- Absent (0-29): No meaningful differentiation

Be honest and critical. Weak differentiation is a common startup problem.`,
      },
      {
        role: "user",
        content: `Analyze this startup's competitive differentiation:\n\n${contentContext}\n\nURL: ${url}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "competitive_differentiation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "Score from 0-100",
            },
            differentiationStrength: {
              type: "string",
              enum: ["Dominant", "Strong", "Moderate", "Weak", "Absent"],
              description: "5-level differentiation strength assessment",
            },
            identifiedCompetitors: {
              type: "array",
              items: { type: "string" },
              description: "Competitors mentioned or implied",
            },
            differentiationFactors: {
              type: "array",
              items: { type: "string" },
              description:
                "Key factors that differentiate them from competitors",
            },
            weakPoints: {
              type: "array",
              items: { type: "string" },
              description: "Areas where differentiation is weak or missing",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description:
                "Actionable recommendations to strengthen differentiation",
            },
          },
          required: [
            "score",
            "differentiationStrength",
            "identifiedCompetitors",
            "differentiationFactors",
            "weakPoints",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.3,
  });

  const result = JSON.parse(
    response.choices[0].message.content as string,
  ) as CompetitiveDifferentiationResult;

  return {
    ...result,
    maxScore: 100,
  };
}

async function analyzeTargetAudienceClarity(
  openai: any,
  contentContext: string,
  url: string,
): Promise<TargetAudienceClarityResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert startup positioning analyst. Analyze how clearly this startup defines their target audience.

Evaluate:
1. Who is their target audience (explicitly or implicitly)?
2. How specific is their audience definition?
3. Do they show depth of understanding (personas, use cases, pain points)?
4. Are they trying to serve everyone or a specific niche?

Rate on 5-level scales:
- Audience Specificity: Laser-Focused, Specific, Moderate, Vague, Undefined
- Persona Depth: Comprehensive, Detailed, Basic, Minimal, Missing

Specific, well-defined audiences indicate stronger positioning.`,
      },
      {
        role: "user",
        content: `Analyze this startup's target audience clarity:\n\n${contentContext}\n\nURL: ${url}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "target_audience_clarity",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "Score from 0-100",
            },
            identifiedAudiences: {
              type: "array",
              items: { type: "string" },
              description: "Target audiences identified from the content",
            },
            audienceSpecificity: {
              type: "string",
              enum: [
                "Laser-Focused",
                "Specific",
                "Moderate",
                "Vague",
                "Undefined",
              ],
              description: "5-level audience specificity assessment",
            },
            personaDepth: {
              type: "string",
              enum: [
                "Comprehensive",
                "Detailed",
                "Basic",
                "Minimal",
                "Missing",
              ],
              description: "5-level persona depth assessment",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description:
                "Actionable recommendations to clarify target audience",
            },
          },
          required: [
            "score",
            "identifiedAudiences",
            "audienceSpecificity",
            "personaDepth",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.3,
  });

  const result = JSON.parse(
    response.choices[0].message.content as string,
  ) as TargetAudienceClarityResult;

  return {
    ...result,
    maxScore: 100,
  };
}

async function analyzeProblemSolutionFit(
  openai: any,
  contentContext: string,
  url: string,
): Promise<ProblemSolutionFitResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert startup positioning analyst. Analyze the problem-solution fit of this startup.

Evaluate:
1. What specific problems do they solve?
2. How clearly do they articulate their solution?
3. How strong is the fit between problem and solution?
4. Do they demonstrate deep understanding of the problem?

Rate fit quality on a 5-level scale:
- Exceptional (90-100): Perfect problem-solution alignment
- Strong (70-89): Clear problem with well-defined solution
- Moderate (50-69): Problem and solution somewhat aligned
- Weak (30-49): Unclear problem or solution
- Poor (0-29): No clear problem-solution fit

Strong problem-solution fit is fundamental to good positioning.`,
      },
      {
        role: "user",
        content: `Analyze this startup's problem-solution fit:\n\n${contentContext}\n\nURL: ${url}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "problem_solution_fit",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "Score from 0-100",
            },
            identifiedProblems: {
              type: "array",
              items: { type: "string" },
              description: "Problems this startup is solving",
            },
            solutionClarity: {
              type: "string",
              description:
                "Description of how clearly the solution is articulated",
            },
            fitQuality: {
              type: "string",
              enum: ["Exceptional", "Strong", "Moderate", "Weak", "Poor"],
              description: "5-level problem-solution fit assessment",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description:
                "Actionable recommendations to improve problem-solution fit",
            },
          },
          required: [
            "score",
            "identifiedProblems",
            "solutionClarity",
            "fitQuality",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.3,
  });

  const result = JSON.parse(
    response.choices[0].message.content as string,
  ) as ProblemSolutionFitResult;

  return {
    ...result,
    maxScore: 100,
  };
}

async function analyzeMessagingConsistency(
  openai: any,
  contentContext: string,
  url: string,
): Promise<MessagingConsistencyResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert startup positioning analyst. Analyze the messaging consistency of this startup.

Evaluate:
1. Is the tone and voice consistent throughout the content?
2. Is the value proposition stated consistently?
3. Do different sections/pages align in their messaging?
4. Are there contradictions or mixed messages?

Rate on 5-level scales:
- Tone Consistency: Exceptional, Consistent, Moderate, Inconsistent, Chaotic
- Value Prop Consistency: Exceptional, Consistent, Moderate, Inconsistent, Contradictory

Consistent messaging builds trust and clarity.`,
      },
      {
        role: "user",
        content: `Analyze this startup's messaging consistency:\n\n${contentContext}\n\nURL: ${url}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "messaging_consistency",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "integer",
              description: "Score from 0-100",
            },
            toneConsistency: {
              type: "string",
              enum: [
                "Exceptional",
                "Consistent",
                "Moderate",
                "Inconsistent",
                "Chaotic",
              ],
              description: "5-level tone consistency assessment",
            },
            valuePropConsistency: {
              type: "string",
              enum: [
                "Exceptional",
                "Consistent",
                "Moderate",
                "Inconsistent",
                "Contradictory",
              ],
              description: "5-level value prop consistency assessment",
            },
            channelAlignment: {
              type: "array",
              items: { type: "string" },
              description: "Assessment of how different content sections align",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description:
                "Actionable recommendations to improve messaging consistency",
            },
          },
          required: [
            "score",
            "toneConsistency",
            "valuePropConsistency",
            "channelAlignment",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
    temperature: 0.3,
  });

  const result = JSON.parse(
    response.choices[0].message.content as string,
  ) as MessagingConsistencyResult;

  return {
    ...result,
    maxScore: 100,
  };
}
