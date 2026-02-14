const TAG_REGEX = /<[^>]*>/g;

export function sanitizeText(input: string): string {
  return input.replace(TAG_REGEX, "").replace(/\s+/g, " ").trim();
}

export function sanitizeOptionalText(input?: string | null): string | undefined {
  if (!input) {
    return undefined;
  }

  const sanitized = sanitizeText(input);
  return sanitized.length > 0 ? sanitized : undefined;
}

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function slugify(input: string): string {
  return sanitizeText(input)
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/_+/g, "_")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function sanitizeSlugInput(input: string): string {
  return sanitizeText(input)
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/_+/g, "_")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
