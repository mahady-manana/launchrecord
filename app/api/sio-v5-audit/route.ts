import { getOpenRouterClient } from "@/lib/openrouter";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import { mapToSIOReport } from "@/services/sio-report/mappers";
import { sioV5VerificationPrompt } from "@/services/sio-report/verification-prompt";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema";
import {
  sioV5SchemaPrompt,
  sioV5SystemPrompt,
} from "@/services/sio-v5-system-prompt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 },
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // Get OpenRouter client
    const client = getOpenRouterClient();

    // Extract website content
    const websiteContent = await getWebsiteContent(url, true);

    if (!websiteContent) {
      return NextResponse.json(
        { error: "Failed to fetch website content" },
        { status: 500 },
      );
    }

    // Prepare clean content for AI
    const cleanContent = {
      webcontent: websiteContent.simplifiedContent,
      jsonLd: websiteContent.ldJson,
      metadata: websiteContent.meta,
      robotstxt: websiteContent.robottxts,
      sitemap: websiteContent.sitemap,
    };

    // Step 1: Generate initial SIO-V5 audit report
    const initialResponse = await client.chat.send({
      chatGenerationParams: {
        models: [
          "qwen/qwen3.6-plus-preview:free",
          "nvidia/nemotron-3-super-120b-a12b:free",
          "qwen/qwen3-next-80b-a3b-instruct:free",
        ],
        messages: [
          {
            role: "system",
            content: sioV5SystemPrompt,
          },
          {
            role: "system",
            content: sioV5SchemaPrompt,
          },
          {
            role: "user",
            content: `Website content to analyze:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content: `Analyze this website content and generate a complete SIO-V5 audit report following the instructions and JSON schema provided.`,
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v5_report",
            strict: true,
            schema: sioV5JsonSchema,
          },
        },
        provider: {
          requireParameters: true,
        },
        stream: false,
      },
    });

    const initialContent = initialResponse.choices[0]?.message?.content;

    if (!initialContent) {
      throw new Error("No content returned from OpenRouter");
    }

    console.log("====================================");
    console.log("Initial Audit Usage:", initialResponse.usage);
    console.log("====================================");

    // Step 2: Verify and improve the generated report
    const verificationResponse = await client.chat.send({
      chatGenerationParams: {
        models: [
          "qwen/qwen3.6-plus-preview:free",
          "nvidia/nemotron-3-super-120b-a12b:free",
        ],
        messages: [
          {
            role: "system",
            content: sioV5VerificationPrompt,
          },
          {
            role: "system",
            content: sioV5SchemaPrompt,
          },
          {
            role: "user",
            content: `Website content for reference:\n\n${JSON.stringify(cleanContent, null, 2)}`,
          },
          {
            role: "user",
            content: `Review and improve inconsistent elements in this SIO-V5 audit report:\n\n${initialContent}`,
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "sio_v5_report",
            strict: true,
            schema: sioV5JsonSchema,
          },
        },
        provider: {
          requireParameters: true,
        },
        stream: false,
      },
    });

    const verifiedContent = verificationResponse.choices[0]?.message?.content;

    if (!verifiedContent) {
      throw new Error("No verification content returned from OpenRouter");
    }

    console.log("====================================");
    console.log("Verification Usage:", verificationResponse.usage);
    console.log("Total Usage:", {
      promptTokens:
        (initialResponse.usage?.promptTokens || 0) +
        (verificationResponse.usage?.promptTokens || 0),
      completionTokens:
        (initialResponse.usage?.completionTokens || 0) +
        (verificationResponse.usage?.completionTokens || 0),
      totalTokens:
        (initialResponse.usage?.totalTokens || 0) +
        (verificationResponse.usage?.totalTokens || 0),
    });
    console.log("====================================");

    // Parse and map the verified response
    let rawData;
    try {
      rawData = JSON.parse(verifiedContent);
    } catch {
      // If verification failed to return JSON, use the initial report
      rawData = JSON.parse(initialContent);
    }

    // Map to proper format for DB and frontend
    const report = mapToSIOReport(rawData);

    return NextResponse.json({
      success: true,
      data: report,
      metadata: {
        verified: true,
        tokenUsage: {
          initial: initialResponse.usage,
          verification: verificationResponse.usage,
          total: {
            promptTokens:
              (initialResponse.usage?.promptTokens || 0) +
              (verificationResponse.usage?.promptTokens || 0),
            completionTokens:
              (initialResponse.usage?.completionTokens || 0) +
              (verificationResponse.usage?.completionTokens || 0),
            totalTokens:
              (initialResponse.usage?.totalTokens || 0) +
              (verificationResponse.usage?.totalTokens || 0),
          },
        },
      },
    });
  } catch (error: any) {
    console.error("SIO-V5 Audit API error:", error);

    // Handle API capacity errors
    if (
      error.message?.includes("capacity") ||
      error.message?.includes("rate_limit") ||
      error.message?.includes("overloaded")
    ) {
      return NextResponse.json(
        {
          error:
            "System is currently at capacity. Please try again in a few minutes.",
          retry: true,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate SIO-V5 audit report" },
      { status: 500 },
    );
  }
}
