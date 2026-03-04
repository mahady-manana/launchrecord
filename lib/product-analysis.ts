import { getOpenAIClient } from "@/lib/openai";
import type { IProduct } from "@/models/product";
import { promptMasterGeneralAnalyze } from "@/reports/prompt";
import type { AuditReportV1 } from "@/types/audit-report-v1";

export interface AnalysisMetrics {
  aeoVisibility: {
    score: number;
    label: string;
    description: string;
    mentionShare: number;
    competitors: string[];
  };
  positioningShift: {
    score: number;
    label: string;
    description: string;
    genericityScore: number;
    similarCompetitors: number;
  };
  productClarity: {
    score: number;
    label: string;
    description: string;
    timeToAha: number;
  };
  founderMomentum: {
    score: number;
    label: string;
    description: string;
    velocity: "positive" | "negative" | "stagnant";
  };
  founderProofVault: {
    score: number;
    label: string;
    description: string;
    verifiedRevenueStreams: number;
    moatEvidence: number;
    proprietaryDataSets: number;
  };
}

export interface AnalysisResult {
  overallScore: number;
  status: "UNTOUCHABLE" | "LETHAL" | "PLASTIC" | "ZOMBIE" | "GHOST";
  metrics: AnalysisMetrics;
  analysis: {
    verdict: string;
    directCommand: string;
    requiredMissions: string[];
    threats: string[];
    opportunities: string[];
  };
}

const ANALYSIS_USER_PROMPT = `Analyze this product using the Sovereign Defensibility Framework:

PRODUCT DATA:
- Name: {{name}}
- Tagline: {{tagline}}
- Description: {{description}}
- Website: {{website}}
- Topics: {{topics}}


Be specific. Use data-driven reasoning. No fluff.`;

function buildProductContext(product: Partial<IProduct>): string {
  const context: string[] = [];

  context.push(`Name: ${product.name || "Unknown"}`);
  context.push(`Tagline: ${product.tagline || "Not provided"}`);
  context.push(`Description: ${product.description || "Not provided"}`);
  context.push(`Website: ${product.website || "Not provided"}`);
  context.push(`Topics: ${product.topics}`);

  return context.join("\n");
}

export async function analyzeProduct(
  product: Partial<IProduct>,
): Promise<AuditReportV1> {
  const client = getOpenAIClient();

  const userPrompt = ANALYSIS_USER_PROMPT.replace(
    "{{name}}",
    product.name || "",
  )
    .replace("{{tagline}}", product.tagline || "")
    .replace("{{description}}", product.description || "")
    .replace("{{website}}", product.website || "")
    .replace("{{topics}}", buildProductContext(product));

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini-search-preview",
    messages: [
      { role: "system", content: promptMasterGeneralAnalyze },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No analysis content returned from OpenAI");
  }

  const result = JSON.parse(content) as AuditReportV1;

  // Validate the report structure
  if (!result.meta || !result.aeo_index || !result.overall_assessment) {
    throw new Error("Invalid audit report structure");
  }

  return result;
}

export async function analyzeProductBatch(
  products: Partial<IProduct>[],
  options?: {
    concurrency?: number;
    onProgress?: (index: number, total: number, result: AuditReportV1) => void;
  },
): Promise<AuditReportV1[]> {
  const concurrency = options?.concurrency || 3;
  const results: AuditReportV1[] = [];

  for (let i = 0; i < products.length; i += concurrency) {
    const batch = products.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((product) => analyzeProduct(product)),
    );

    results.push(...batchResults);

    if (options?.onProgress) {
      batchResults.forEach((result, idx) => {
        options.onProgress!(i + idx, products.length, result);
      });
    }

    // Rate limiting: wait between batches
    if (i + concurrency < products.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}
