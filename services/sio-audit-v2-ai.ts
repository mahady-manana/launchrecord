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

/**
 * STEP 1: Summary & Issues Generation
 */
export async function runSummaryAndIssues(cleanContent: any) {
  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.summary,
      messages: [
        { role: "system", content: generalInstructions },
        { role: "system", content: summaryAndIssuesInstruction },
        { role: "user", content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}` },
        { role: "user", content: "Analyze this website and generate ONLY the summary-and-issues payload following the JSON schema provided." },
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
          { role: "system", content: generalInstructions },
          { role: "system", content: summaryAndIssuesInstruction },
          { role: "user", content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}` },
          { role: "user", content: "Analyze this website and generate ONLY the summary-and-issues payload following the JSON schema provided." },
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
 * STEP 2: AEO Visibility Readiness Analysis
 */
export async function runAeoAnalysis(cleanContent: any) {
  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.analysis,
      messages: [
        { role: "system", content: generalInstructions },
        { role: "system", content: aeoAnalysisInstruction },
        { role: "user", content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}` },
        { role: "user", content: "Perform the AEO Visibility Readiness analysis. Generate ONLY the payload following the JSON schema provided. Add new issues to the existing ones if needed." },
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
        models: summaryModels.models, // AEO step uses summaryModels in previous implementation
        messages: [
          { role: "system", content: generalInstructions },
          { role: "system", content: aeoAnalysisInstruction },
          { role: "user", content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}` },
          { role: "user", content: "Perform the AEO Visibility Readiness analysis. Generate ONLY the payload following the JSON schema provided. Add new issues to the existing ones if needed." },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v2_aeo_analysis",
            strict: true,
            schema: aeoAnalysisJsonSchema,
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
 * STEP 3: Scoring & Fix Generation
 */
export async function runScoringAndFixes(promptInput: any) {
  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.analysis,
      messages: [
        { role: "system", content: generalInstructions },
        { role: "system", content: scoringAndFixesInstruction },
        { role: "user", content: `Persisted report issues from DB:\n\n${JSON.stringify(promptInput, null, 2)}` },
        { role: "user", content: "Generate ONLY the scoring-and-fixes payload following the JSON schema provided. Keep the same issues and enrich them." },
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
          { role: "system", content: generalInstructions },
          { role: "system", content: scoringAndFixesInstruction },
          { role: "user", content: `Persisted report issues from DB:\n\n${JSON.stringify(promptInput, null, 2)}` },
          { role: "user", content: "Generate ONLY the scoring-and-fixes payload following the JSON schema provided. Keep the same issues and enrich them." },
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
 * STEP 4: Validation & Improvement
 */
export async function runValidationImprovement(promptInput: any) {
  if (AI_PROVIDER === "openai") {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: openAIModels.refinement,
      messages: [
        { role: "system", content: generalInstructions },
        { role: "system", content: validationAndImprovementInstruction },
        { role: "user", content: `Persisted report state from DB:\n\n${JSON.stringify(promptInput, null, 2)}` },
        { role: "user", content: "Validate and improve this report without breaking consistency. Return ONLY the validation-improvement payload following the JSON schema provided." },
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
          { role: "system", content: generalInstructions },
          { role: "system", content: validationAndImprovementInstruction },
          { role: "user", content: `Persisted report state from DB:\n\n${JSON.stringify(promptInput, null, 2)}` },
          { role: "user", content: "Validate and improve this report without breaking consistency. Return ONLY the validation-improvement payload following the JSON schema provided." },
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
