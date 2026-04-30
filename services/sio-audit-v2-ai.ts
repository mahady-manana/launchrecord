import { getOpenAIClient } from "@/lib/openai";
import { getOpenRouterClient } from "@/lib/openrouter";
import {
  aeoAnalysisInstruction,
  generalInstructions,
  positioningClarityInstruction,
  summaryFirstImpressionsInstruction,
  validationInstruction,
} from "@/services/sio-audit-instructions/v2";
import {
  aeoAnalysisJsonSchema,
  scoringFixesJsonSchema,
  summaryAndIssuesJsonSchema,
  validationImprovementJsonSchema,
} from "@/services/sio-audit-v2";
import { rulesSystemPrompt } from "./sio-audit-instructions/v2/rules-system-prompt";
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

  // ADD RULES ENFORCEMENT AS 3RD SYSTEM MESSAGE
  messages.push({ role: "system", content: rulesSystemPrompt });

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

function getSeverityRank(severity: unknown) {
  switch (severity) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function buildIssueDigest(issues: any[] = []) {
  const sorted = [...issues].sort((a, b) => {
    const rankDiff =
      getSeverityRank(b?.severity) - getSeverityRank(a?.severity);
    if (rankDiff !== 0) return rankDiff;
    return (
      Math.abs((b?.impactScore as number) || 0) -
      Math.abs((a?.impactScore as number) || 0)
    );
  });

  const counts = sorted.reduce(
    (acc, issue) => {
      acc.total += 1;
      const severity = issue?.severity || "unknown";
      const category = issue?.category || "unknown";
      acc.bySeverity[severity] = (acc.bySeverity[severity] || 0) + 1;
      acc.byCategory[category] = (acc.byCategory[category] || 0) + 1;
      return acc;
    },
    {
      total: 0,
      bySeverity: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    },
  );

  return {
    counts,
    representativeIssues: buildSlimIssuesContext(sorted.slice(0, 5)),
  };
}

function buildLayerPromptInput(
  step: "summary" | "positioning" | "aeo" | "validation",
  promptInput: any,
) {
  const websiteSummary = promptInput?.websiteSummary || null;
  const firstImpressions = promptInput?.firstImpressions || null;
  const categoryInsights = promptInput?.categoryInsights || null;
  const scoring = promptInput?.scoring || null;
  const issueDigest = buildIssueDigest(promptInput?.issues || []);

  if (step === "summary") {
    return {
      websiteSummary,
      firstImpressions,
    };
  }

  if (step === "positioning") {
    return {
      websiteSummary,
      firstImpressions,
      issueDigest: {
        counts: issueDigest.counts,
        representativeIssues: issueDigest.representativeIssues.filter(
          (issue: any) =>
            issue.category === "first_impression" ||
            issue.category === "positioning" ||
            issue.category === "clarity",
        ),
      },
      categoryInsights: {
        first_impression: categoryInsights?.first_impression || null,
      },
      scoring: {
        first_impression: scoring?.first_impression ?? null,
      },
    };
  }

  if (step === "aeo") {
    return {
      websiteSummary,
      firstImpressions,
      issueDigest: {
        counts: issueDigest.counts,
        representativeIssues: issueDigest.representativeIssues.filter(
          (issue: any) =>
            issue.category === "first_impression" ||
            issue.category === "positioning" ||
            issue.category === "clarity",
        ),
      },
      categoryInsights: {
        first_impression: categoryInsights?.first_impression || null,
        positioning: categoryInsights?.positioning || null,
        clarity: categoryInsights?.clarity || null,
      },
      scoring: {
        first_impression: scoring?.first_impression ?? null,
        positioning: scoring?.positioning ?? null,
        clarity: scoring?.clarity ?? null,
      },
    };
  }

  return {
    websiteSummary,
    firstImpressions,
    issueDigest,
    categoryInsights,
    scoring,
    strengths: Array.isArray(promptInput?.strengths)
      ? promptInput.strengths
      : [],
    reportBand: promptInput?.reportBand || null,
    overallScore: promptInput?.overallScore ?? null,
  };
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
        first_impression:
          previousReport?.categoryInsights?.first_impression || null,
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
        first_impression:
          previousReport?.categoryInsights?.first_impression || null,
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
    issueDigest: buildIssueDigest(previousReport?.issues || []),
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
        ...buildSystemMessages(summaryFirstImpressionsInstruction),
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
      reasoning_effort: "high",
    });
    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: summaryModels.models,
        messages: [
          ...buildSystemMessages(summaryFirstImpressionsInstruction),
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
 * STEP 1 (New): Summary & First Impressions
 */
export async function runSummaryFirstImpressions(cleanContent: any) {
  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.summary,
      messages: [
        ...buildSystemMessages(summaryFirstImpressionsInstruction),
        {
          role: "user",
          content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
        },
        {
          role: "user",
          content:
            "Generate the step 1 summary-and-first-impressions payload only. Focus on website summary and first impression analysis.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sio_v2_summary_first_impressions",
          strict: true,
          schema: summaryAndIssuesJsonSchema as any, // Reuse existing schema for now
        },
      },
      reasoning_effort: "high",
    });

    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        // models: summaryModels.models,
        models: ["deepseek/deepseek-v3.2"],
        messages: [
          ...buildSystemMessages(summaryFirstImpressionsInstruction),
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Generate the step 1 summary-and-first-impressions payload only. Focus on website summary and first impression analysis.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_summary_first_impressions",
            strict: true,
            schema: summaryAndIssuesJsonSchema,
          },
        },
        provider: summaryModels.provider,
        stream: false,
        reasoning: {
          effort: "high",
        },
      },
    });
    console.log("openai", response.usage);
    return parseAiJson(response.choices[0]?.message?.content);
  }
}

/**
 * STEP 2 (New): Positioning & Clarity
 */
export async function runPositioningClarity(
  cleanContent: any,
  previousReport?: any,
) {
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
          positioningClarityInstruction,
          filteredPreviousContext,
        ),
        {
          role: "user",
          content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
        },
        {
          role: "user",
          content:
            "Generate the step 2 positioning-and-clarity payload only. Focus on positioning and clarity issues, and preserve the earlier first-impression findings.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sio_v2_positioning_clarity",
          strict: true,
          schema: scoringFixesJsonSchema as any, // Reuse existing schema for now
        },
      },
      reasoning_effort: "high",
    });
    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: positioningClarityModels.models,
        // models: ["deepseek/deepseek-v3.2"],
        messages: [
          ...buildSystemMessages(
            positioningClarityInstruction,
            filteredPreviousContext,
          ),
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Generate the step 2 positioning-and-clarity payload only. Focus on positioning and clarity issues, and preserve the earlier first-impression findings.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_positioning_clarity",
            strict: true,
            schema: scoringFixesJsonSchema,
          },
        },
        provider: positioningClarityModels.provider,
        stream: false,
        reasoning: {
          effort: "high",
        },
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
  const slimPromptInput = buildLayerPromptInput("aeo", cleanContent);

  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.analysis,
      messages: [
        ...buildSystemMessages(aeoAnalysisInstruction, filteredPreviousContext),
        {
          role: "user",
          content: `Website content to analyze:\n\n${JSON.stringify(slimPromptInput, null, 2)}`,
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
          ...buildSystemMessages(
            aeoAnalysisInstruction,
            filteredPreviousContext,
          ),
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(slimPromptInput, null, 2)}`,
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
export async function runValidationImprovement(
  promptInput: any,
  previousReport?: any,
) {
  const filteredPreviousContext = buildFilteredPreviousContext(
    "validation",
    previousReport,
  );
  const slimPromptInput = buildLayerPromptInput("validation", promptInput);

  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.refinement,
      messages: [
        ...buildSystemMessages(validationInstruction, filteredPreviousContext),
        {
          role: "user",
          content: `Persisted report state from DB:\n\n${JSON.stringify(slimPromptInput, null, 2)}`,
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
      reasoning_effort: "high",
    });

    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: refinementModels.models,
        messages: [
          ...buildSystemMessages(
            validationInstruction,
            filteredPreviousContext,
          ),
          {
            role: "user",
            content: `Persisted report state from DB:\n\n${JSON.stringify(slimPromptInput, null, 2)}`,
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

/**
 * STEP 4 (New): Final Validation
 */
export async function runValidation(cleanContent: any, previousReport?: any) {
  const filteredPreviousContext = buildFilteredPreviousContext(
    "validation",
    previousReport,
  );
  const slimPromptInput = buildLayerPromptInput("validation", {
    ...cleanContent,
    ...previousReport,
  });

  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.refinement,
      messages: [
        ...buildSystemMessages(validationInstruction, filteredPreviousContext),
        {
          role: "user",
          content: `Persisted report state from DB:\n\n${JSON.stringify(slimPromptInput, null, 2)}`,
        },
        {
          role: "user",
          content:
            "Perform final validation and refinement. Ensure 12-15 total issues, diagnostic-only statements, and content grounding. Return the final validated payload.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "sio_v2_final_validation",
          strict: true,
          schema: validationImprovementJsonSchema as any, // Reuse existing schema for now
        },
      },
      reasoning_effort: "high",
    });

    return parseAiJson(response.choices[0]?.message?.content);
  } else {
    const client = getOpenRouterClient();
    const response = await client.chat.send({
      chatGenerationParams: {
        models: refinementModels.models,
        messages: [
          ...buildSystemMessages(
            validationInstruction,
            filteredPreviousContext,
          ),
          {
            role: "user",
            content: `Persisted report state from DB:\n\n${JSON.stringify(slimPromptInput, null, 2)}`,
          },
          {
            role: "user",
            content:
              "Perform final validation and refinement. Ensure 12-15 total issues, diagnostic-only statements, and content grounding. Return the final validated payload.",
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_final_validation",
            strict: true,
            schema: validationImprovementJsonSchema,
          },
        },
        provider: refinementModels.provider,
        stream: false,
        reasoning: {
          effort: "high",
        },
      },
    });
    return parseAiJson(response.choices[0]?.message?.content);
  }
}
