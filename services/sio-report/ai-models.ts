/**
 * SIO-V5 AI Model Configuration
 *
 * Centralized model definitions for each audit step.
 * Change models here to update across all steps.
 */

import { Effort } from "@openrouter/sdk/models";

export const AI_PROVIDER: "openrouter" | "openai" = "openrouter"; // Switch here

/**
 * OpenAI Model Definitions
 */
export const openAIModels = {
  summary: "gpt-5.4-nano",
  analysis: "gpt-5.4-nano",
  refinement: "gpt-5.4-nano",
};

/**
 * Step 3: Summary & First Impressions
 * Fast models for content extraction and hero analysis
 */
export const summaryModels = {
  models: [
    "deepseek/deepseek-v3.2",
    "x-ai/grok-4.1-fast",
    "moonshotai/kimi-k2.5",
  ],
  reasoning: "high" as Effort,
  provider: {
    requireParameters: true,
    // preferredMinThroughput: 35,
  },
};

/**
 * Step 4: Positioning & Clarity
 * Higher reasoning effort for deep analysis
 */
export const positioningClarityModels = {
  models: [
    "deepseek/deepseek-v3.2",
    "x-ai/grok-4.1-fast",
    "moonshotai/kimi-k2.5",
  ],
  reasoning: "high" as Effort,
  provider: {
    requireParameters: true,
    // preferredMinThroughput: 38,
  },
};

/**
 * Step 5: AEO (Answer Engine Optimization)
 * Balanced models for structured data analysis
 */
export const aeoModels = {
  models: [
    "deepseek/deepseek-v3.2",
    "x-ai/grok-4.1-fast",
    "moonshotai/kimi-k2.5",
  ],
  provider: {
    requireParameters: true,
    preferredMinThroughput: 38,
  },
};

/**
 * Step 7: Refinement & QA
 * Models optimized for quality assurance
 */
export const refinementModels = {
  models: [
    "x-ai/grok-4.1-fast",
    "tencent/hy3-preview:free",
    "openai/gpt-oss-120b:free",
  ],
  reasoning: "high" as Effort,
  provider: {
    requireParameters: true,
  },
};
