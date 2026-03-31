import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getOpenRouterClient } from "@/lib/openrouter";
import Product from "@/models/product";
import SIOReport from "@/models/sio-report";
import { getWebsiteContent } from "@/services/getWebsiteContent";
import { mapToSIOReport } from "@/services/sio-report/mappers";
import { sanitizeReportForGuest } from "@/services/sio-report/sanitizer";
import { sioV5JsonSchema } from "@/services/sio-v5-json-schema";
import {
  sioV5CriticalPoints,
  sioV5SchemaPrompt,
  sioV5SystemPrompt,
} from "@/services/sio-v5-system-prompt";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sioV5AuditSchema = z.object({
  url: z.string(),
  productId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = sioV5AuditSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { url, productId } = validation.data;

    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    const isGuest = !session?.user;
    const userId = session?.user?.id;

    // For logged-in users, productId is required
    // if (!isGuest && !productId) {
    //   return NextResponse.json(
    //     { error: "Product ID is required for authenticated users" },
    //     { status: 400 },
    //   );
    // }

    if (!isGuest && !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    if (!isGuest && productId) {
      const product = await Product.findOne({ _id: productId, users: userId });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found or access denied" },
          { status: 403 },
        );
      }
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
            role: "system",
            content: sioV5CriticalPoints,
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
    // const verificationResponse = await client.chat.send({
    //   chatGenerationParams: {
    //     models: [
    //       "qwen/qwen3.6-plus-preview:free",
    //       "nvidia/nemotron-3-super-120b-a12b:free",
    //     ],
    //     messages: [
    //       {
    //         role: "system",
    //         content: sioV5VerificationPrompt,
    //       },
    //       {
    //         role: "system",
    //         content: sioV5SchemaPrompt,
    //       },
    //  {
    //   role: "system",
    //   content: sioV5CriticalPoints,
    // },
    //       {
    //         role: "user",
    //         content: `Website content for reference:\n\n${JSON.stringify(cleanContent, null, 2)}`,
    //       },
    //       {
    //         role: "user",
    //         content: `Review and improve this SIO-V5 audit report:\n\n${initialContent}`,
    //       },
    //     ],
    //     responseFormat: {
    //       type: "json_schema",
    //       jsonSchema: {
    //         name: "sio_v5_report",
    //         strict: true,
    //         schema: sioV5JsonSchema,
    //       },
    //     },
    //     provider: {
    //       requireParameters: true,
    //     },
    //     stream: false,
    //   },
    // });

    // const verifiedContent = verificationResponse.choices[0]?.message?.content;

    const verifiedContent = initialContent;
    if (!verifiedContent) {
      throw new Error("No verification content returned from OpenRouter");
    }

    // console.log("====================================");
    // console.log("Verification Usage:", verificationResponse.usage);
    // console.log("Total Usage:", {
    //   promptTokens:
    //     (initialResponse.usage?.promptTokens || 0) +
    //     (verificationResponse.usage?.promptTokens || 0),
    //   completionTokens:
    //     (initialResponse.usage?.completionTokens || 0) +
    //     (verificationResponse.usage?.completionTokens || 0),
    //   totalTokens:
    //     (initialResponse.usage?.totalTokens || 0) +
    //     (verificationResponse.usage?.totalTokens || 0),
    // });
    // console.log("====================================");

    // Parse and map the verified response
    let rawData;
    try {
      rawData = JSON.parse(verifiedContent);
    } catch {
      // If verification failed to return JSON, use the initial report
      rawData = JSON.parse(initialContent);
    }

    // Map to proper format for DB and frontend
    const reportData = mapToSIOReport(rawData);

    // Save to database (for both guest and logged-in users)
    const savedReport = await SIOReport.create({
      ...reportData,
      product: isGuest ? null : productId || null,
      url,
      auditDuration: 0, // Can be calculated from timestamps
      // tokenUsage:
      //   (initialResponse.usage?.totalTokens || 0) +
      //   (verificationResponse.usage?.totalTokens || 0),
      // modelUsed: "qwen/qwen3.6-plus-preview:free",
      // rawAnalysis: initialContent,
      // verifiedAnalysis: verifiedContent,
    });

    // For guest users, sanitize the response (omit sensitive data)
    const responseReport = isGuest
      ? sanitizeReportForGuest(savedReport.toObject())
      : savedReport.toObject();

    return NextResponse.json({
      success: true,
      data: responseReport,
      isGuest,
      metadata: {
        verified: true,
        savedToDb: true,
        reportId: savedReport._id,
        // tokenUsage: {
        //   initial: initialResponse.usage,
        //   verification: verificationResponse.usage,
        //   total: {
        //     promptTokens:
        //       (initialResponse.usage?.promptTokens || 0) +
        //       (verificationResponse.usage?.promptTokens || 0),
        //     completionTokens:
        //       (initialResponse.usage?.completionTokens || 0) +
        //       (verificationResponse.usage?.completionTokens || 0),
        //     totalTokens:
        //       (initialResponse.usage?.totalTokens || 0) +
        //       (verificationResponse.usage?.totalTokens || 0),
        //   },
        // },
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
