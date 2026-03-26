import { runClarityAudit } from "./clarity-audit";
import {
  createClarityReport,
  getLatestClarityReport,
} from "./clarity-report-crud";
import type { ClarityAuditOptions, ClarityAuditResult } from "./types";

/**
 * Run a standalone clarity audit and optionally save to database
 */
export async function runStandaloneClarityAudit(
  options: ClarityAuditOptions & {
    name?: string;
    tagline?: string;
    description?: string;
  },
  productId?: string,
  saveToDb: boolean = false,
): Promise<ClarityAuditResult & { _id?: string }> {
  const startTime = Date.now();

  // Run the clarity audit
  const result = await runClarityAudit({
    url: options.url,
    name: options.name,
    tagline: options.tagline,
    description: options.description,
  });

  let auditResult: ClarityAuditResult & { _id?: string } = result;

  // Save to database if requested and productId provided
  if (saveToDb && productId) {
    const duration = Date.now() - startTime;
    const report = await createClarityReport(
      productId,
      options.url,
      {
        score: result.score,
        band: result.band,
        executiveSummary: result.executiveSummary,
        metrics: result.metrics,
        fiveSecondTest: result.fiveSecondTest,
        findings: result.findings,
        recommendations: result.recommendations,
        competitiveContext: result.competitiveContext,
      },
      {
        auditDuration: duration,
        modelUsed: "gpt-4o-mini",
      },
    );
    auditResult._id = report._id;
  }

  return auditResult;
}

/**
 * Get existing report or run new audit
 * Returns cached report if found within 30 days, unless force=true
 */
export async function getOrRunClarityAudit(
  options: ClarityAuditOptions & {
    name?: string;
    tagline?: string;
    description?: string;
  },
  productId: string,
  saveToDb: boolean = false,
  force: boolean = false,
): Promise<ClarityAuditResult & { _id?: string; fromCache?: boolean }> {
  // Check for existing recent report if not forcing
  if (!force) {
    const existingReport = await getLatestClarityReport(productId);

    if (existingReport) {
      const now = new Date();
      const reportDate = existingReport.createdAt as Date;
      const diffInDays =
        (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffInDays <= 30) {
        // Return cached report
        return {
          ...existingReport,
          fromCache: true,
        };
      }
    }
  }

  // Run new audit
  const result = await runStandaloneClarityAudit(options, productId, saveToDb);

  return {
    ...result,
    fromCache: false,
  };
}
