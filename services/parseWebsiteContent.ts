import * as cheerio from "cheerio";
import type { FetchWebsiteContentResult } from "./fetchWebsiteContent";

export interface MetaInfo {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  robots: string;
  author: string;
  language: string;
  charset: string;
  og: {
    exists: boolean;
  };
  twitter: {
    exists: boolean;
  };
}

export interface ParsedHTML {
  html: string;
  meta: MetaInfo;
  simplifiedContent: string;
  ldJson: Array<{ "@type": string }>;
  robottxts: string;
  sitemap: "present" | "no_sitemap" | "accessible" | "not_accessible";
}

export function parseWebsiteContent(
  websiteContent: FetchWebsiteContentResult,
): ParsedHTML {
  const html = websiteContent.html;
  const $ = cheerio.load(html);

  const getMetaContent = (name: string) =>
    $(`meta[name="${name}"]`).attr("content") || "";
  const getMetaProperty = (property: string) =>
    $(`meta[property="${property}"]`).attr("content") || "";
  const getLinkRel = (rel: string) =>
    $(`link[rel="${rel}"]`).attr("href") || "";

  const contentType =
    $('meta[http-equiv="Content-Type"]').attr("content") || "";
  let charset = $("meta[charset]").attr("charset") || "";
  if (!charset && contentType) {
    const match = contentType.match(/charset=([^;]+)/i);
    if (match) charset = match[1].trim();
  }

  // Check if Open Graph meta tags exist
  const ogTitle = getMetaProperty("og:title");
  const ogDescription = getMetaProperty("og:description");
  const ogImage = getMetaProperty("og:image");
  const ogExists = !!(ogTitle || ogDescription || ogImage);

  // Check if Twitter meta tags exist
  const twitterCard = getMetaContent("twitter:card");
  const twitterTitle = getMetaContent("twitter:title");
  const twitterImage = getMetaContent("twitter:image");
  const twitterExists = !!(twitterCard || twitterTitle || twitterImage);

  const meta: MetaInfo = {
    title: $("title").text().trim() || "",
    description: getMetaContent("description"),
    keywords: getMetaContent("keywords"),
    canonical: getLinkRel("canonical"),
    robots: getMetaContent("robots"),
    author: getMetaContent("author"),
    language:
      $("html").attr("lang") ||
      getMetaContent("language") ||
      $('meta[http-equiv="content-language"]').attr("content") ||
      "",
    charset,
    og: {
      exists: ogExists,
    },
    twitter: {
      exists: twitterExists,
    },
  };

  const allowedTags = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "li",
    "a",
    "button",
    "input",
    "video",
    "img",
  ];
  let simplifiedContent = "";
  $("footer, nav, header, sidebar").remove();
  const selector = allowedTags.join(",");
  $("body")
    .find(selector)
    .each((_, el) => {
      const tag = (el.tagName || "").toLowerCase();
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text.length > 0 && allowedTags.includes(tag)) {
        simplifiedContent += `<${tag}>${text}</${tag}>\n`;
      }
    });

  // Extract only @type from JSON-LD schemas
  const ldJson: Array<{ "@type": string }> = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const schema = JSON.parse($(el).html() || "");

      // Handle @graph structure
      if (schema["@graph"] && Array.isArray(schema["@graph"])) {
        schema["@graph"].forEach((node: any) => {
          if (node["@type"]) {
            ldJson.push({ "@type": node["@type"] });
          }
        });
      }
      // Handle single schema object
      else if (schema["@type"]) {
        ldJson.push({ "@type": schema["@type"] });
      }
    } catch {
      // Ignore invalid JSON-LD blocks
    }
  });

  return {
    html,
    meta,
    simplifiedContent,
    ldJson,
    robottxts: websiteContent.robottxts,
    sitemap: websiteContent.sitemap,
  };
}
