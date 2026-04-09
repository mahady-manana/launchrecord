import { fetchWebsiteContent } from "./fetchWebsiteContent";
import { parseWebsiteContent, type ParsedHTML } from "./parseWebsiteContent";

const TOKEN_LIMIT = 4000;

/**
 * Check if parsed content is insufficient (e.g., client-side rendered sites)
 */
const hasInsufficientContent = (parsed: ParsedHTML): boolean => {
  // Check if simplified content is empty or very short
  const hasContent =
    parsed.simplifiedContent && parsed.simplifiedContent.trim().length > 100;

  return !hasContent;
};

/**
 * Fallback to client-side rendering via /api/fetch-website
 */
const fetchWithClientSideRendering = async (
  url: string,
): Promise<ParsedHTML | null> => {
  try {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const apiUrl = `${baseUrl}/api/fetch-website?url=${encodeURIComponent(url)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(
        `Failed to fetch website content via API: ${response.statusText}`,
      );
      return null;
    }

    const parsedContent = await response.json();
    return parsedContent as ParsedHTML;
  } catch (error) {
    console.error("Error fetching via client-side API:", error);
    return null;
  }
};

const pruneEmptyStrings = (value: unknown): unknown => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? value : null;
  }
  if (Array.isArray(value)) {
    const pruned = value
      .map(pruneEmptyStrings)
      .filter((item) => item !== null && item !== undefined);
    return pruned.length > 0 ? pruned : null;
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      const prunedVal = pruneEmptyStrings(val);
      if (prunedVal !== null && prunedVal !== undefined) {
        result[key] = prunedVal;
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  }
  return value;
};

const estimateTokens = (text?: string): number => {
  if (!text) return 0;

  return Math.max(1, Math.ceil(text.length / 4));
};

const enforceTokenLimit = (
  payload: Record<string, unknown>,
): {
  payload: Record<string, unknown>;
  jsonPayload: string;
  tokenEstimate: number;
  trimmed: boolean;
} => {
  let jsonPayload = JSON.stringify(payload, null, 2);
  let tokenEstimate = estimateTokens(jsonPayload);

  if (tokenEstimate <= TOKEN_LIMIT) {
    return { payload, jsonPayload, tokenEstimate, trimmed: false };
  }

  const simplified =
    typeof payload.simplifiedContent === "string"
      ? payload.simplifiedContent
      : "";
  if (!simplified) {
    return { payload, jsonPayload, tokenEstimate, trimmed: false };
  }

  // Split into lines and remove line by line until within limit
  const lines = simplified.split("\n");
  let trimmedLines = [...lines];
  let nextPayload = payload;
  let jsonPayloadTemp = jsonPayload;
  let tokenEstimateTemp = tokenEstimate;
  // Remove lines one by one from the end until within limit
  while (
    tokenEstimateTemp > TOKEN_LIMIT &&
    trimmedLines.length > 1 // Keep at least one line
  ) {
    trimmedLines.pop(); // Remove last line
    const trimmedContent = trimmedLines.join("\n");
    nextPayload = { ...payload, simplifiedContent: trimmedContent };
    jsonPayloadTemp = JSON.stringify(nextPayload, null, 2);
    tokenEstimateTemp = estimateTokens(jsonPayloadTemp);
  }

  return {
    payload: nextPayload,
    jsonPayload: jsonPayloadTemp,
    tokenEstimate: tokenEstimateTemp,
    trimmed: tokenEstimateTemp < tokenEstimate,
  };
};

export interface WebsiteContentPayload extends ParsedHTML {
  jsonPayload?: string;
  tokenEstimate?: number;
  trimmed?: boolean;
}

export const getWebsiteContent = async (
  url: string,
  limited = true,
): Promise<WebsiteContentPayload | null> => {
  if (!url) {
    return null;
  }

  // First, try server-side parsing
  const page = await fetchWebsiteContent(url);
  let parse = parseWebsiteContent(page);

  // Check if content is insufficient (likely a client-side rendered site)
  if (hasInsufficientContent(parse)) {
    console.log(
      `Insufficient content detected for ${url}, falling back to client-side rendering`,
    );

    const fallbackContent = await fetchWithClientSideRendering(url);

    if (fallbackContent) {
      console.log("Successfully fetched content via client-side rendering");
      parse = fallbackContent;
    } else {
      console.warn(
        "Client-side rendering fallback failed, returning original parsed content",
      );
    }
  }

  const cleaned = pruneEmptyStrings(parse);
  const cleanedPayload =
    cleaned && typeof cleaned === "object"
      ? (cleaned as Record<string, unknown>)
      : {};

  if (!limited) {
    return parse;
  }

  const { payload, jsonPayload, tokenEstimate, trimmed } = enforceTokenLimit({
    ...cleanedPayload,
    html: "",
  });

  return {
    ...payload,
    jsonPayload,
    tokenEstimate,
    trimmed,
    html: cleanedPayload.html,
  } as WebsiteContentPayload;
};
