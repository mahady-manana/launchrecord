/**
 * Bulk Product Analysis Script
 * Run with: npx tsx scripts/analyze-products.ts
 *
 * Analyzes all products in the database using OpenAI
 * and stores the results as Report documents.
 */

import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/product";
import Report from "@/models/report";
import { analyzeProduct } from "@/lib/product-analysis";
import { saveAnalysis } from "@/lib/analysis-service";

interface AnalyzeOptions {
  limit?: number;
  skipAnalyzed?: boolean;
  productIds?: string[];
}

async function analyzeProducts(options: AnalyzeOptions = {}) {
  try {
    await connectToDatabase();
    console.log("✓ Connected to database");

    const { limit, skipAnalyzed = true, productIds } = options;

    // Build query
    const query: any = {};

    // If specific product IDs provided
    if (productIds && productIds.length > 0) {
      query._id = { $in: productIds };
    }

    // Filter out already analyzed products if requested
    if (skipAnalyzed) {
      const analyzedProductIds = await Report.distinct("product");
      query._id = {
        ...query._id,
        $nin: analyzedProductIds,
      };
    }

    // Get products to analyze
    let productsQuery = Product.find(query).populate("topics");
    if (limit) {
      productsQuery = productsQuery.limit(limit);
    }

    const products = await productsQuery;

    if (products.length === 0) {
      console.log("No products to analyze.");
      mongoose.connection.close();
      process.exit(0);
    }

    console.log(`\n📊 Found ${products.length} products to analyze\n`);

    let success = 0;
    let failed = 0;
    let skipped = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const progress = `[${i + 1}/${products.length}]`;

      try {
        console.log(`${progress} Analyzing: ${product.name}...`);

        // Run AI analysis
        const analysis = await analyzeProduct(product);

        // Save to database
        const report = await saveAnalysis({
          product,
          analysis,
        });

        console.log(
          `  ✓ Score: ${analysis.overallScore}/100 (${analysis.status})`,
        );
        success++;
      } catch (error) {
        console.error(
          `  ✗ Failed: ${product.name} - ${(error as Error).message}`,
        );
        failed++;

        // Rate limit handling - wait and retry
        if ((error as any)?.status === 429) {
          console.log("  ⏳ Rate limited, waiting 10 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }

      // Rate limiting: wait between requests
      if (i < products.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("\n=================================");
    console.log("✓ Analysis complete!");
    console.log(`  - Successful: ${success}`);
    console.log(`  - Failed: ${failed}`);
    console.log(`  - Skipped: ${skipped}`);
    console.log(`  - Total Reports: ${await Report.countDocuments()}`);
    console.log("=================================\n");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("✗ Bulk analysis failed:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: AnalyzeOptions = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === "--limit" && args[i + 1]) {
    options.limit = parseInt(args[i + 1], 10);
    i++;
  } else if (arg === "--all") {
    options.skipAnalyzed = false;
  } else if (arg === "--ids" && args[i + 1]) {
    options.productIds = args[i + 1].split(",");
    i++;
  } else if (arg === "--help") {
    console.log(`
Bulk Product Analysis Script

Usage: npx tsx scripts/analyze-products.ts [options]

Options:
  --limit <number>    Limit the number of products to analyze
  --all               Re-analyze all products (including already analyzed)
  --ids <id1,id2,...> Analyze specific product IDs only
  --help              Show this help message

Examples:
  npx tsx scripts/analyze-products.ts
  npx tsx scripts/analyze-products.ts --limit 10
  npx tsx scripts/analyze-products.ts --all
  npx tsx scripts/analyze-products.ts --ids 123abc,456def
`);
    process.exit(0);
  }
}

analyzeProducts(options);
