import { getOpenAIClient } from "@/lib/openai";
import { getOpenRouterClient } from "@/lib/openrouter";
import {
  aeoAnalysisInstruction,
  generalInstructions,
  scoringAndFixesInstruction,
  summaryAndIssuesInstruction,
  validationAndImprovementInstruction,
} from "@/services/sio-audit-instructions/v2";
import {
  aeoAnalysisJsonSchema,
  scoringFixesJsonSchema,
  summaryAndIssuesJsonSchema,
  validationImprovementJsonSchema,
} from "@/services/sio-audit-v2";
import {
  AI_PROVIDER,
  aeoModels,
  openAIModels,
  positioningClarityModels,
  refinementModels,
  summaryModels,
} from "./sio-report/ai-models";

/**
 * Common Helper: Parse AI response content as JSON
 */
function parseAiJson(content: string | null | undefined) {
  if (!content) throw new Error("No content returned from AI");
  try {
    // Remove markdown code blocks if present
    const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanContent);
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", content);
    throw new Error("Failed to parse AI response as JSON");
  }
}

function buildSystemMessages(
  stepInstruction: string,
  previousReport?: unknown,
) {
  const messages: Array<{ role: "system"; content: string }> = [
    { role: "system", content: generalInstructions },
  ];

  if (previousReport) {
    messages.push({
      role: "system",
      content: `Previous step report context. Preserve this as the base state and only change what the current step owns:\n\n${JSON.stringify(previousReport, null, 2)}`,
    });
  }

  messages.push({ role: "system", content: stepInstruction });
  return messages;
}

function buildSlimIssuesContext(issues: any[] = []) {
  return issues.map((issue) => ({
    id: issue?.id,
    category: issue?.category,
    metricKey: issue?.metricKey,
    severity: issue?.severity,
    statement: issue?.statement,
    current: issue?.current ?? null,
    impactScore: issue?.impactScore,
  }));
}

function buildFilteredPreviousContext(
  step: "positioning" | "aeo" | "validation",
  previousReport: any,
) {
  if (!previousReport) return undefined;

  const baseContext = {
    statement: previousReport?.statement || "",
    websiteSummary: previousReport?.websiteSummary || null,
    firstImpressions: previousReport?.firstImpressions || null,
  };

  if (step === "positioning") {
    return {
      ...baseContext,
      issues: buildSlimIssuesContext(
        (previousReport?.issues || []).filter(
          (issue: any) => issue?.category === "first_impression",
        ),
      ),
      categoryInsights: {
        first_impression: previousReport?.categoryInsights?.first_impression || null,
      },
      scoring: {
        first_impression: previousReport?.scoring?.first_impression ?? null,
      },
    };
  }

  if (step === "aeo") {
    return {
      ...baseContext,
      issues: buildSlimIssuesContext(
        (previousReport?.issues || []).filter(
          (issue: any) => issue?.category !== "aeo",
        ),
      ),
      categoryInsights: {
        first_impression: previousReport?.categoryInsights?.first_impression || null,
        positioning: previousReport?.categoryInsights?.positioning || null,
        clarity: previousReport?.categoryInsights?.clarity || null,
      },
      scoring: {
        first_impression: previousReport?.scoring?.first_impression ?? null,
        positioning: previousReport?.scoring?.positioning ?? null,
        clarity: previousReport?.scoring?.clarity ?? null,
      },
    };
  }

  return {
    ...baseContext,
    issues: buildSlimIssuesContext(previousReport?.issues || []),
    categoryInsights: previousReport?.categoryInsights || null,
    scoring: previousReport?.scoring || null,
    strengths: Array.isArray(previousReport?.strengths)
      ? previousReport.strengths
      : [],
    reportBand: previousReport?.reportBand || null,
    overallScore: previousReport?.overallScore ?? null,
  };
}

/**
 * STEP 1: Summary & First Impression Analysis
 */
export async function runSummaryAndIssues(cleanContent: any) {
  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.summary,
      messages: [
        ...buildSystemMessages(summaryAndIssuesInstruction),
        {
          role: "user",
          content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
        },
        {
          role: "user",
          content:
            "Generate the step 1 summary-and-first-impressions payload only. Keep the focus on the website message and first impression issues.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sio_v2_summary_and_issues",
          strict: true,
          schema: summaryAndIssuesJsonSchema as any,
        },
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: summaryModels.models,
        messages: [
          ...buildSystemMessages(summaryAndIssuesInstruction),
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Generate the step 1 summary-and-first-impressions payload only. Keep the focus on the website message and first impression issues.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_summary_and_issues",
            strict: true,
            schema: summaryAndIssuesJsonSchema,
          },
        },
        provider: summaryModels.provider,
        stream: false,
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  }
}

/**
 * STEP 2: Positioning & Messaging Analysis
 */
export async function runScoringAndFixes(promptInput: any, previousReport?: any) {
  const filteredPreviousContext = buildFilteredPreviousContext(
    "positioning",
    previousReport,
  );

  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.analysis,
      messages: [
        ...buildSystemMessages(
          scoringAndFixesInstruction,
          filteredPreviousContext,
        ),
        {
          role: "user",
          content: `Persisted report issues from DB:\n\n${JSON.stringify(promptInput, null, 2)}`,
        },
        {
          role: "user",
          content:
            "Generate the step 2 positioning-and-messaging payload only. Focus on positioning and clarity issues, and preserve the earlier first-impression findings.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sio_v2_scoring_and_fixes",
          strict: true,
          schema: scoringFixesJsonSchema as any,
        },
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: positioningClarityModels.models,
        messages: [
          ...buildSystemMessages(
            scoringAndFixesInstruction,
            filteredPreviousContext,
          ),
          {
            role: "user",
            content: `Persisted report issues from DB:\n\n${JSON.stringify(promptInput, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Generate the step 2 positioning-and-messaging payload only. Focus on positioning and clarity issues, and preserve the earlier first-impression findings.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_scoring_and_fixes",
            strict: true,
            schema: scoringFixesJsonSchema,
          },
        },
        provider: positioningClarityModels.provider,
        stream: false,
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  }
}

/**
 * STEP 3: AEO Visibility Readiness Analysis
 */
export async function runAeoAnalysis(cleanContent: any, previousReport?: any) {
  const filteredPreviousContext = buildFilteredPreviousContext(
    "aeo",
    previousReport,
  );

  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.analysis,
      messages: [
        ...buildSystemMessages(aeoAnalysisInstruction, filteredPreviousContext),
        {
          role: "user",
          content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
        },
        {
          role: "user",
          content:
            "Perform the AEO Visibility Readiness analysis only. Generate AEO issues and AEO scoring, and preserve earlier report sections.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sio_v2_aeo_analysis",
          strict: true,
          schema: aeoAnalysisJsonSchema as any,
        },
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: aeoModels.models,
        messages: [
          ...buildSystemMessages(aeoAnalysisInstruction, filteredPreviousContext),
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Perform the AEO Visibility Readiness analysis only. Generate AEO issues and AEO scoring, and preserve earlier report sections.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_aeo_analysis",
            strict: true,
            schema: aeoAnalysisJsonSchema,
          },
        },
        provider: aeoModels.provider,
        stream: false,
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  }
}

/**
 * STEP 4: Validation & Finalization
 */
export async function runValidationImprovement(promptInput: any, previousReport?: any) {
  const filteredPreviousContext = buildFilteredPreviousContext(
    "validation",
    previousReport,
  );

  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.refinement,
      messages: [
        ...buildSystemMessages(
          validationAndImprovementInstruction,
          filteredPreviousContext,
        ),
        {
          role: "user",
          content: `Persisted report state from DB:\n\n${JSON.stringify(promptInput, null, 2)}`,
        },
        {
          role: "user",
          content:
            "Validate and finalize the report. Preserve previous step outputs, set the overall score, and return only the validation-improvement payload.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sio_v2_validation_improvement",
          strict: true,
          schema: validationImprovementJsonSchema as any,
        },
      },
    });

    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: refinementModels.models,
        messages: [
          ...buildSystemMessages(
            validationAndImprovementInstruction,
            filteredPreviousContext,
          ),
          {
            role: "user",
            content: `Persisted report state from DB:\n\n${JSON.stringify(promptInput, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Validate and finalize the report. Preserve previous step outputs, set the overall score, and return only the validation-improvement payload.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_validation_improvement",
            strict: true,
            schema: validationImprovementJsonSchema,
          },
        },
        provider: refinementModels.provider,
        stream: false,
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  }
}
