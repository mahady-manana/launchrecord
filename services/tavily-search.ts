"use server";
import { tavily } from "@tavily/core";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || "";

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilySearchResponse {
  query: string;
  follow_up_questions?: string[];
  answer?: string;
  images?: string[];
  results: TavilySearchResult[];
}

export async function searchExternalMentions(
  domain: string,
  options?: {
    maxResults?: number;
    searchDepth?: "basic" | "advanced";
  },
): Promise<TavilySearchResult[]> {
  if (!TAVILY_API_KEY) {
    console.warn(
      "TAVILY_API_KEY not configured, skipping external mentions search",
    );
    return [];
  }

  const { searchDepth = "advanced" } = options || {};

  try {
    const client = tavily({ apiKey: TAVILY_API_KEY });
    const response = await client.search(
      `${domain} review OR mention OR discussion OR alternative`,
      {
        search_depth: searchDepth,
      },
    );

    return response.results || [];
  } catch (error) {
    console.error("Tavily search failed:", error);
    return [];
  }
}
