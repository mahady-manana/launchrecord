export const LAUNCH_CATEGORIES = [
  "AI",
  "Developer Tools",
  "SaaS",
  "Productivity",
  "Design",
  "Marketing",
  "Ecommerce",
  "Finance",
  "Education",
  "Open Source",
] as const;

export type LaunchCategory = (typeof LAUNCH_CATEGORIES)[number];

export const BUSINESS_MODELS = [
  "B2B",
  "B2C",
  "B2B2C",
  "Marketplace",
  "D2C",
  "Other",
] as const;

export type BusinessModel = (typeof BUSINESS_MODELS)[number];

export const PRICING_MODELS = ["free", "freemium", "paid"] as const;

export type PricingModel = (typeof PRICING_MODELS)[number];

export type LaunchPlacement = "none" | "hero" | "left" | "right";

export interface Launch {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  tagline: string;
  description: string;
  website: string;
  category: LaunchCategory | LaunchCategory[];
  valueProposition?: string;
  problem?: string;
  audience?: string;
  businessModel: BusinessModel;
  pricingModel: PricingModel;
  submittedBy: string;
  placement: LaunchPlacement;
  createdAt: string;
  updatedAt: string;
}

export interface LaunchFilters {
  query: string;
  category: "all" | LaunchCategory;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateLaunchPayload {
  name: string;
  logoUrl?: string;
  tagline: string;
  description: string;
  website: string;
  category: LaunchCategory | LaunchCategory[];
  businessModel: BusinessModel;
  pricingModel: PricingModel;
}

export interface UpdateLaunchPayload {
  id: string;
  name?: string;
  logoUrl?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  website?: string;
  category?: LaunchCategory | LaunchCategory[];
  valueProposition?: string;
  problem?: string;
  audience?: string;
  businessModel?: BusinessModel;
  pricingModel?: PricingModel;
}
