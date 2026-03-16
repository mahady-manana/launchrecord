// AEO Audit Services
export { runStandaloneAEOAudit } from "./aeo-audit-standalone";
export { runAIAEOAudit } from "./aeo-audit-ai";

// Types
export type {
  AEOAuditResult,
  AEOCheckResult,
  CheckItem,
  CheckFunction,
  StandaloneAEOAuditOptions,
} from "./types";

// Individual checks (for reuse)
export * from "./checks";

// Checklist
export { aeo_checklist, AEO_CHECKLIST } from "../aeo_checklist";
