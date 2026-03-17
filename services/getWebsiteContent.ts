import { fetchWebsiteContent } from "./fetchWebsiteContent";
import { parseWebsiteContent, type ParsedHTML } from "./parseWebsiteContent";

const TOKEN_LIMIT = 4000;

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

const trimSimplifiedContent = (text: string, maxChars: number): string => {
  if (maxChars <= 0) return "";
  if (text.length <= maxChars) return text;
  let slice = text.slice(0, maxChars);
  const lastNewline = slice.lastIndexOf("\n");
  if (lastNewline > 0) {
    slice = slice.slice(0, lastNewline + 1);
  }
  return slice.trimEnd();
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

  // If still over limit after removing all but one line, truncate the last line
  if (tokenEstimateTemp > TOKEN_LIMIT && trimmedLines.length === 1) {
    const maxChars = Math.max(0, TOKEN_LIMIT * 4 - 200); // Reserve some tokens for JSON structure
    const truncatedLine = trimSimplifiedContent(trimmedLines[0], maxChars);
    nextPayload = { ...payload, simplifiedContent: truncatedLine };
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
  const page = await fetchWebsiteContent(url);

  const parse = parseWebsiteContent(page);

  const cleaned = pruneEmptyStrings(parse);
  const cleanedPayload =
    cleaned && typeof cleaned === "object"
      ? (cleaned as Record<string, unknown>)
      : {};
  if (!limited) {
    return parse;
  }
  const { payload, jsonPayload, tokenEstimate, trimmed } =
    enforceTokenLimit(cleanedPayload);

  return {
    ...payload,
    jsonPayload,
    tokenEstimate,
    trimmed,
  } as WebsiteContentPayload;
};
