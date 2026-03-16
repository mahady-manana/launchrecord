import type { WebsiteContentPayload } from "@/services/getWebsiteContent";

export interface AEOAuditResult {
  url: string;
  score: number;
  maxScore: number;
  checks: AEOCheckResult[];
  timestamp: Date;
}

export interface AEOCheckResult {
  id: string;
  name: string;
  description: string;
  weight: number;
  score: number;
  maxScore: number;
  passed: boolean;
  evidence?: string[];
  recommendations?: string[];
}

export interface CheckItem {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export type CheckFunction = (
  item: CheckItem,
  url: string,
  pageContent: WebsiteContentPayload,
) => Promise<AEOCheckResult>;

export interface StandaloneAEOAuditOptions {
  url: string;
  timeout?: number;
}
