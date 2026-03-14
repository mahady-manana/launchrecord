import axios from "axios";

export interface FetchWebsiteContentResult {
  html: string;
  robottxts: string;
  sitemap: "present" | "no_sitemap" | "accessible" | "not_accessible";
}

export async function fetchWebsiteContent(
  url: string,
): Promise<FetchWebsiteContentResult> {
  const { data: html } = await axios.get<string>(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SidleBot/1.0)" },
  });

  // Parse URL to get base for robots.txt and sitemap
  const urlObj = new URL(url);
  const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

  // Fetch robots.txt
  let robottxts = "";
  let sitemap: "present" | "no_sitemap" | "accessible" | "not_accessible" =
    "no_sitemap";

  try {
    const robotsUrl = `${baseUrl}/robots.txt`;
    const { data: robotsData } = await axios.get<string>(robotsUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SidleBot/1.0)" },
    });

    // Only store robots.txt if it's valid (status 200 and has content)
    if (robotsData && robotsData.trim().length > 0) {
      robottxts = robotsData;

      // Check if sitemap is referenced in robots.txt
      const sitemapMatch = robotsData.match(/sitemap:\s*(\S+)/i);
      if (sitemapMatch && sitemapMatch[1]) {
        const sitemapUrl = sitemapMatch[1].trim();

        // Ping the sitemap to check if it's accessible
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
    // If robots.txt fetch fails, keep empty string
    console.error("Failed to fetch robots.txt:", error);
  }

  return { html, robottxts, sitemap };
}
