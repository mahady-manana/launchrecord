/**
 * Product Status Classification System
 * Based on Sovereign Defensibility Scores
 */

export type ProductStatus =
  | "UNTOUCHABLE"
  | "LETHAL"
  | "PLASTIC"
  | "ZOMBIE"
  | "GHOST";

export interface ProductStatusConfig {
  status: ProductStatus;
  minScore: number;
  maxScore: number;
  color: string;
  colorHex: string;
  description: string;
}

export const PRODUCT_STATUS_CONFIG: ProductStatusConfig[] = [
  {
    status: "UNTOUCHABLE",
    minScore: 90,
    maxScore: 100,
    color: "text-[#02804b]",
    colorHex: "#02804b",
    description:
      "They aren't just in a category; they are the category. Copying them feels like a crime.",
  },
  {
    status: "LETHAL",
    minScore: 70,
    maxScore: 89,
    color: "text-[#a4c709]",
    colorHex: "#a4c709",
    description:
      "Sharp, precise positioning. They cut through the noise and leave a mark on the user's brain.",
  },
  {
    status: "PLASTIC",
    minScore: 40,
    maxScore: 69,
    color: "text-[#d8ca08]",
    colorHex: "#d8ca08",
    description:
      "Looks good at first glance, but it's a mold. High polish, low soul. Standard industry filler.",
  },
  {
    status: "ZOMBIE",
    minScore: 20,
    maxScore: 39,
    color: "text-[#e0970d]",
    colorHex: "#e0970d",
    description:
      'Just walking through the motions. Repeating "AI-powered" slogans they heard someone else say.',
  },
  {
    status: "GHOST",
    minScore: 1,
    maxScore: 19,
    color: "text-[#dc2626]",
    colorHex: "#dc2626",
    description:
      "Invisible. Zero presence. If they deleted their site today, no one would notice they were gone.",
  },
];

/**
 * Get the product status configuration for a given score
 */
export function getProductBadge(status: string): ProductStatusConfig {
  if (status === "A") return PRODUCT_STATUS_CONFIG[0]; // UNTOUCHABLE
  if (status === "B") return PRODUCT_STATUS_CONFIG[1]; // LETHAL
  if (status === "C") return PRODUCT_STATUS_CONFIG[2]; // PLASTIC
  if (status === "D") return PRODUCT_STATUS_CONFIG[3]; // ZOMBIE
  return PRODUCT_STATUS_CONFIG[4]; // GHOST (0-19)
}

export function getProductStatus(score: number): ProductStatusConfig {
  if (score >= 85) return PRODUCT_STATUS_CONFIG[0]; // UNTOUCHABLE
  if (score >= 70) return PRODUCT_STATUS_CONFIG[1]; // LETHAL
  if (score >= 55) return PRODUCT_STATUS_CONFIG[2]; // PLASTIC
  if (score >= 45) return PRODUCT_STATUS_CONFIG[3]; // ZOMBIE
  return PRODUCT_STATUS_CONFIG[4]; // GHOST (0-19)
}

/**
 * Get the status label for a given score
 */
export function getStatusLabel(score: number): ProductStatus {
  return getProductStatus(score).status;
}

/**
 * Get the color class for a given score
 */
export function getStatusColor(score: number): string {
  return getProductStatus(score).color;
}

/**
 * Get the hex color for a given score (useful for charts)
 */
export function getStatusColorHex(score: number): string {
  return getProductStatus(score).colorHex;
}

/**
 * Get the description for a given score
 */
export function getStatusDescription(score: number): string {
  return getProductStatus(score).description;
}

/**
 * Check if a score falls within a specific status range
 */
export function isStatus(score: number, status: ProductStatus): boolean {
  return getProductStatus(score).status === status;
}

/**
 * Get all statuses with their score ranges for display purposes
 */
export function getStatusLegend(): Array<{
  status: ProductStatus;
  range: string;
  color: string;
  colorHex: string;
}> {
  return PRODUCT_STATUS_CONFIG.map((config) => ({
    status: config.status,
    range: `${config.minScore}-${config.maxScore}`,
    color: config.color,
    colorHex: config.colorHex,
  }));
}

/**
 * Calculate the overall score from multiple metric scores
 * Returns the average of all provided scores
 */
export function getOverallScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / scores.length);
}

/**
 * Get the overall status classification from multiple metric scores
 * Calculates the average score and returns the corresponding status config
 */
export function getOverallStatus(scores: number[]): ProductStatusConfig {
  const overallScore = getOverallScore(scores);
  return getProductStatus(overallScore);
}

/**
 * Get the overall status label from multiple metric scores
 */
export function getOverallStatusLabel(scores: number[]): ProductStatus {
  return getOverallStatus(scores).status;
}

/**
 * Get the overall color class from multiple metric scores
 */
export function getOverallStatusColor(scores: number[]): string {
  return getOverallStatus(scores).color;
}

/**
 * Get the overall hex color from multiple metric scores
 */
export function getOverallStatusColorHex(scores: number[]): string {
  return getOverallStatus(scores).colorHex;
}

/**
 * Get the overall description from multiple metric scores
 */
export function getOverallStatusDescription(scores: number[]): string {
  return getOverallStatus(scores).description;
}
