import { getOpenRouterClient } from "@/lib/openrouter";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema";
import { sioV5SystemPrompt } from "@/services/sio-v5-system-prompt";
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

    // Call OpenRouter API with SIO-V5 instructions
    const response = await client.chat.send({
      chatGenerationParams: {
        models: ["qwen/qwen3.6-plus-preview:free"],
        messages: [
          {
            role: "system",
            content: sioV5SystemPrompt,
          },
          {
            role: "user",
            content: `Analyze this website content and generate a complete SIO-V5 audit report:\n\n${JSON.stringify(cleanContent, null, 2)}`,
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

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from OpenRouter");
    }

    console.log("====================================");
    console.log(response.usage, content);
    console.log("====================================");
    // Parse and validate the response
    const report = JSON.parse(content);

    return NextResponse.json({
      success: true,
      data: report,
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
