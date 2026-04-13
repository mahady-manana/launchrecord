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
    "x-ai/grok-4.1-fast",
    "google/gemma-4-31b-it:free",
    "qwen/qwen3.5-35b-a3b",
  ],
  reasoning: "medium" as Effort,
  provider: {
    requireParameters: true,
    preferredMinThroughput: 38,
  },
};

/**
 * Step 4: Positioning & Clarity
 * Higher reasoning effort for deep analysis
 */
export const positioningClarityModels = {
  models: [
    "x-ai/grok-4.1-fast",
    "google/gemma-4-31b-it:free",
    "qwen/qwen3.5-35b-a3b",
  ],
  reasoning: "high" as Effort,
  provider: {
    requireParameters: true,
    preferredMinThroughput: 38,
  },
};

/**
 * Step 5: AEO (Answer Engine Optimization)
 * Balanced models for structured data analysis
 */
export const aeoModels = {
  models: [
    "qwen/qwen3.6-plus:free",
    "x-ai/grok-4.1-fast",
    "qwen/qwen3.5-35b-a3b",
  ],
  reasoning: "medium" as Effort,
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
    "qwen/qwen3.5-35b-a3b",
    "x-ai/grok-4.1-fast",
    "google/gemma-4-31b-it:free",
  ],
  reasoning: "medium" as Effort,
  provider: {
    requireParameters: true,
  },
};
