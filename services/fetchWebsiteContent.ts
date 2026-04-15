import axios from "axios";
import normalizeUrl from "normalize-url";

export interface FetchWebsiteContentResult {
  html: string;
  robottxts: string;
  sitemap: "present" | "no_sitemap" | "accessible" | "not_accessible";
}

export async function fetchWebsiteContent(
  urlWebsite: string,
): Promise<FetchWebsiteContentResult> {
  const url = normalizeUrl(urlWebsite, { stripWWW: false, forceHttps: true });
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
    const { data: robotsData, status: robotsStatus } = await axios.get<string>(
      robotsUrl,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SidleBot/1.0)" },
        validateStatus: (status) => status < 500,
      },
    );

    // Validate: must be 200, text-like content, and not HTML
    if (
      robotsData &&
      typeof robotsData === "string" &&
      robotsData.trim().length > 0
    ) {
      const trimmed = robotsData.trim();
      const isHtml =
        trimmed.startsWith("<") ||
        /<\s*(html|!doctype|head|body)/i.test(trimmed);

      if (!isHtml) {
        // Check if sitemap is referenced in robots.txt
        const sitemapMatch = trimmed.match(/sitemap:\s*(\S+)/i);
        if (sitemapMatch && sitemapMatch[1]) {
          const sitemapUrl = sitemapMatch[1].trim();

          // Ping the sitemap to check if it's accessible
          try {
            const { status } = await axios.head(sitemapUrl, {
              headers: {
                "User-Agent": "Mozilla/5.0 (compatible; SidleBot/1.0)",
              },
              timeout: 5000,
              validateStatus: (status) => status < 500,
            });

            sitemap =
              status === 200 || status === 201
                ? "accessible"
                : "not_accessible";
          } catch {
            sitemap = "not_accessible";
          }
        }
        robottxts = trimmed.slice(0, 200);
      }
    }
  } catch (error) {
    // If robots.txt fetch fails, keep empty string
    console.error("Failed to fetch robots.txt:", error);
  }

  return { html, robottxts, sitemap };
}
