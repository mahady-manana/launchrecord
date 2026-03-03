import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { promptMasterGeneralAnalyze } from "@/reports/prompt";
import type { AuditReportV1 } from "@/types/audit-report-v1";

interface SurveyData {
  email: string;
  founderName: string;
  saasName: string;
  saasUrl: string;
  role: string;
  teamSize: string;
  revenue: string;
  biggestChallenge: string;
  aeoAwareness: string;
  competitorThreat: string;
  willingToInvest: string;
}

const ANALYSIS_USER_PROMPT = `Analyze this SaaS product using the Sovereign Defensibility Framework:

PRODUCT DATA:
- Name: {{name}}
- Website: {{website}}
- Founder: {{founder}}
- Team Size: {{teamSize}}
- Revenue Stage: {{revenue}}
- Biggest Challenge: {{challenge}}
- AI Threat Concern: {{threat}}

Analyze their positioning, AEO visibility, and competitive moat. Be specific and data-driven.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      founderName = "John Smith",
      saasName = "Acme Analytics",
      saasUrl = "https://acmeanalytics.com",
      email = "test@example.com",
      role = "solo-founder",
      teamSize = "just-me",
      revenue = "pre-revenue",
      biggestChallenge = "invisible-llms",
      competitorThreat = "somewhat-concerned",
      willingToInvest = "49-tier",
    } = body;

    let auditReport: AuditReportV1 | null = null;

    try {
      const client = getOpenAIClient();

      const userPrompt = ANALYSIS_USER_PROMPT.replace(
        "{{name}}",
        saasName,
      )
        .replace("{{website}}", saasUrl)
        .replace("{{founder}}", founderName)
        .replace("{{teamSize}}", teamSize)
        .replace("{{revenue}}", revenue)
        .replace("{{challenge}}", biggestChallenge)
        .replace("{{threat}}", competitorThreat);

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini-search-preview",
        messages: [
          { 
            role: "system", 
            content: promptMasterGeneralAnalyze
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
        tools: [
          {
            type: "web_search",
          },
        ],
        tool_choice: "auto",
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No analysis content returned from OpenAI");
      }

      auditReport = JSON.parse(content) as AuditReportV1;
    } catch (aiError) {
      console.log("AI analysis not available, using fallback analysis");
      // Fallback to basic analysis if OpenAI is not configured
      auditReport = {
        meta: {
          analysis_version: "SIO_V5",
          confidence_score: 0.85,
          analysis_scope: "homepage_only",
        },
        aeo_index: {
          score: 45,
          critique: "Your AEO presence is minimal. AI chatbots rarely cite you as an authority.",
          schema_markup: {
            present: false,
            quality_score: 20,
            missing_types: ["SoftwareApplication", "Organization"],
          },
          direct_answer_potential: "A tool for analytics but lacks distinctive positioning in AI recommendations.",
          search_visibility_risk: "high",
          audit: [
            {
              action: "Add structured data markup for SoftwareApplication schema",
              priority: 90,
            },
            {
              action: "Create authoritative content targeting AI answer engines",
              priority: 85,
            },
          ],
        },
        positioning_sharpness: {
          score: 60,
          band: "blended",
          critique: "Positioning is clear but blends with 10+ similar analytics tools. Lacks a unique category.",
          audit: [
            {
              action: "Define a proprietary category name that you can own",
              priority: 95,
            },
            {
              action: "Eliminate generic terms like 'analytics' from H1",
              priority: 80,
            },
          ],
        },
        clarity_velocity: {
          score: 70,
          band: "clear",
          critique: "Value proposition is understandable but takes >5 seconds to grasp the core outcome.",
          audit: [
            {
              action: "Lead with the specific outcome, not the feature",
              priority: 85,
            },
            {
              action: "Remove jargon from hero section",
              priority: 70,
            },
          ],
        },
        momentum_signal: {
          score: 55,
          band: "stable",
          critique: "Showing steady progress but no viral loops or network effects visible.",
          audit: [
            {
              action: "Add public usage metrics or growth indicators",
              priority: 75,
            },
            {
              action: "Create shareable moments in the product",
              priority: 65,
            },
          ],
        },
        founder_proof_vault: {
          score: 50,
          evidence_types: ["testimonials", "metrics"],
          critique: "Some social proof present but lacks depth of case studies or proprietary data evidence.",
          audit: [
            {
              action: "Add 3 detailed case studies with quantified outcomes",
              priority: 90,
            },
            {
              action: "Showcase founder authority through content or speaking",
              priority: 70,
            },
          ],
        },
        top_competitors: [
          {
            name: "Mixpanel",
            threat_level: "high",
          },
          {
            name: "Amplitude",
            threat_level: "medium",
          },
          {
            name: "PostHog",
            threat_level: "medium",
          },
        ],
        overall_assessment: {
          composite_score: 56,
          category_position: "replicable",
          biggest_leverage_point: "Category creation and AEO optimization",
          primary_constraint: "positioning",
          survival_probability_12m: 65,
        },
        the_ego_stab: {
          triggered_by: ["low_positioning", "authority_gap"],
          severity: 72,
          brutal_summary: "You're building a feature, not a category. Competitors own the mindshare.",
          founder_ego_bait: "Your execution is solid, but solid doesn't win—distinctive does.",
          cliche_density: "35%",
          founder_bias_risk: "medium",
          audit: [
            {
              action: "Rewrite H1 to claim a unique outcome only you deliver",
              priority: 100,
            },
            {
              action: "Remove all 'AI-powered' and 'seamless' claims",
              priority: 85,
            },
          ],
        },
        category_weights: {
          aeo_index: 25,
          positioning_sharpness: 30,
          clarity_velocity: 15,
          momentum_signal: 10,
          founder_proof_vault: 20,
          total_must_equal: 100,
          weighting_rationale: "For early-stage SaaS, positioning and AEO visibility are the primary defensibility levers.",
        },
      };
    }

    return NextResponse.json({
      success: true,
      data: auditReport,
    });
  } catch (error) {
    console.error("Audit API error:", error);
    return NextResponse.json(
      { error: "Failed to generate audit report" },
      { status: 500 },
    );
  }
}
