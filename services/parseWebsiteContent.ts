import * as cheerio from "cheerio";
import type { FetchWebsiteContentResult } from "./fetchWebsiteContent";

export interface OpenGraphMeta {
  title: string;
  description: string;
  type: string;
  image: string;
  url: string;
  site_name: string;
}

export interface TwitterMeta {
  card: string;
  title: string;
  description: string;
  image: string;
  site: string;
  creator: string;
}

export interface ArticleMeta {
  published_time: string;
  modified_time: string;
  section: string;
  tag: string;
}

export interface MetaInfo {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  robots: string;
  author: string;
  language: string;
  charset: string;
  og: OpenGraphMeta;
  twitter: TwitterMeta;
  article: ArticleMeta;
}

export interface ParsedHTML {
  meta: MetaInfo;
  simplifiedContent: string;
  ldJson: unknown[];
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
      title: getMetaProperty("og:title"),
      description: getMetaProperty("og:description"),
      type: getMetaProperty("og:type"),
      image: getMetaProperty("og:image"),
      url: getMetaProperty("og:url"),
      site_name: getMetaProperty("og:site_name"),
    },
    twitter: {
      card: getMetaContent("twitter:card"),
      title: getMetaContent("twitter:title"),
      description: getMetaContent("twitter:description"),
      image: getMetaContent("twitter:image"),
      site: getMetaContent("twitter:site"),
      creator: getMetaContent("twitter:creator"),
    },
    article: {
      published_time: getMetaProperty("article:published_time"),
      modified_time: getMetaProperty("article:modified_time"),
      section: getMetaProperty("article:section"),
      tag: getMetaProperty("article:tag"),
    },
  };

  const allowedTags = ["h1", "h2", "h3", "p", "li"];
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

  const ldJson: unknown[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      ldJson.push(JSON.parse($(el).html() || ""));
    } catch {
      // Ignore invalid JSON-LD blocks.
    }
  });

  return {
    meta,
    simplifiedContent,
    ldJson,
    robottxts: websiteContent.robottxts,
    sitemap: websiteContent.sitemap,
  };
}
