/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FetchWebsiteContentResult } from "@/services/fetchWebsiteContent";
import { parseWebsiteContent } from "@/services/parseWebsiteContent";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Cache the Chromium executable path to avoid re-downloading on subsequent requests
const CHROMIUM_PACK_URL =
  "https://github.com/gabenunez/puppeteer-on-vercel/raw/refs/heads/main/example/chromium-dont-use-in-prod.tar";

let cachedExecutablePath: string | null = null;
let downloadPromise: Promise<string> | null = null;

/**
 * Downloads and caches the Chromium executable path.
 * Uses a download promise to prevent concurrent downloads.
 */
async function getChromiumPath(): Promise<string> {
  // Return cached path if available
  if (cachedExecutablePath) return cachedExecutablePath;

  // Prevent concurrent downloads by reusing the same promise
  if (!downloadPromise) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    downloadPromise = chromium
      .executablePath(CHROMIUM_PACK_URL)
      .then((path) => {
        cachedExecutablePath = path;
        console.log("Chromium path resolved:", path);
        return path;
      })
      .catch((error) => {
        console.error("Failed to get Chromium path:", error);
        downloadPromise = null; // Reset on error to allow retry
        throw error;
      });
  }

  return downloadPromise;
}

/**
 * Helper function to fetch robots.txt and check sitemap
 */
async function fetchRobotsAndSitemap(baseUrl: string): Promise<{
  robottxts: string;
  sitemap: "present" | "no_sitemap" | "accessible" | "not_accessible";
}> {
  let robottxts = "";
  let sitemap: "present" | "no_sitemap" | "accessible" | "not_accessible" =
    "no_sitemap";

  try {
    const robotsUrl = `${baseUrl}/robots.txt`;
    const { data: robotsData } = await axios.get<string>(robotsUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SidleBot/1.0)" },
    });

    if (robotsData && robotsData.trim().length > 0) {
      robottxts = robotsData;

      const sitemapMatch = robotsData.match(/sitemap:\s*(\S+)/i);
      if (sitemapMatch && sitemapMatch[1]) {
        const sitemapUrl = sitemapMatch[1].trim();

        try {
          const { status } = await axios.head(sitemapUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; SidleBot/1.0)" },
            timeout: 5000,
          });

          if (status === 200 || status === 201) {
            sitemap = "accessible";
          } else {
            sitemap = "not_accessible";
          }
        } catch {
          sitemap = "not_accessible";
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch robots.txt:", error);
  }

  return { robottxts, sitemap };
}

/**
 * API endpoint to fetch and parse website content.
 * Usage: /api/fetch-website?url=https://example.com
 */
export async function GET(request: NextRequest) {
  // Extract URL parameter from query string
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get("url");
  if (!urlParam) {
    return new NextResponse("Please provide a URL.", { status: 400 });
  }

  // Prepend http:// if missing
  let inputUrl = urlParam.trim();
  if (!/^https?:\/\//i.test(inputUrl)) {
    inputUrl = `http://${inputUrl}`;
  }

  // Validate the URL is a valid HTTP/HTTPS URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(inputUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return new NextResponse("URL must start with http:// or https://", {
        status: 400,
      });
    }
  } catch {
    return new NextResponse("Invalid URL provided.", { status: 400 });
  }

  let browser;
  try {
    // Configure browser based on environment
    let puppeteer: any,
      launchOptions: any = {
        headless: true,
      };

    // Vercel: Use puppeteer-core with downloaded Chromium binary
    const chromium = (await import("@sparticuz/chromium-min")).default;
    puppeteer = await import("puppeteer-core");
    const executablePath = await getChromiumPath();
    launchOptions = {
      ...launchOptions,
      args: chromium.args,
      executablePath,
    };
    console.log("Launching browser with executable path:", executablePath);

    // Launch browser and fetch page content
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto(parsedUrl.toString(), {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Get the full HTML content
    const html = await page.content();

    // Fetch robots.txt and sitemap info
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const { robottxts, sitemap } = await fetchRobotsAndSitemap(baseUrl);

    // Create the FetchWebsiteContentResult object
    const websiteContent: FetchWebsiteContentResult = {
      html,
      robottxts,
      sitemap,
    };

    // Parse the website content using parseWebsiteContent
    const parsedContent = parseWebsiteContent(websiteContent);

    // Return parsed content as JSON
    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("Fetch website error:", error);
    return new NextResponse(
      "An error occurred while fetching website content.",
      { status: 500 },
    );
  } finally {
    // Always clean up browser resources
    if (browser) {
      await browser.close();
    }
  }
}
