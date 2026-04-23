/**
 * SIO-V5 AI Model Configuration
 *
 * Centralized model definitions for each audit step.
 * Change models here to update across all steps.
 */

import { Effort } from "@openrouter/sdk/models";

/**
 * Step 3: Summary & First Impressions
 * Fast models for content extraction and hero analysis
 */
export const summaryModels = {
  models: [
    "qwen/qwen3-next-80b-a3b-thinking",
    "x-ai/grok-4.1-fast",
    "openai/gpt-oss-120b:free",
  ],
  reasoning: "medium" as Effort,
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
    "qwen/qwen3-next-80b-a3b-thinking",
    "x-ai/grok-4.1-fast",
    "openai/gpt-oss-120b:free",
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
    "x-ai/grok-4.1-fast",
    "qwen/qwen3-next-80b-a3b-thinking",
    "openai/gpt-oss-120b:free",
  ],
  reasoning: "medium" as Effort,
  provider: {
    requireParameters: true,
    // preferredMinThroughput: 38,
  },
};

/**
 * Step 7: Refinement & QA
 * Models optimized for quality assurance
 */
export const refinementModels = {
  models: [
    "qwen/qwen3-next-80b-a3b-thinking",
    "openai/gpt-oss-120b:free",
    "x-ai/grok-4.1-fast",
  ],
  reasoning: "medium" as Effort,
  provider: {
    requireParameters: true,
  },
};
