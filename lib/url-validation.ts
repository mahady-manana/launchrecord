/**
 * Validates URLs with support for modern formats including:
 * - Multiple subdomains (app.dashboard.example.com)
 * - Multiple extensions (example.co.uk, example.com.au)
 * - Various TLD formats (.com, .co.uk, .io, .app, etc.)
 * - Paths, query parameters, and fragments
 */

export interface ValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  hostUrl?: string;
  error?: string;
}

/**
 * List of blocked domains/patterns that should not be audited
 * Includes app stores, marketplaces, and non-website platforms
 */
const BLOCKED_DOMAINS = [
  // Apple App Store
  "apps.apple.com",
  "itunes.apple.com",

  // Google Play Store
  "play.google.com",

  // Microsoft Store
  "apps.microsoft.com",
  "microsoftstore.com",

  // Amazon App Store
  "amazon.com/appstore",

  // Other App Marketplaces
  "producthunt.com",
  "github.com",
  "gitlab.com",
  "bitbucket.org",

  // Social Media Platforms (not startup websites)
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "linkedin.com",
  "youtube.com",

  // Development/Code Platforms
  "npmjs.com",
  "npmjs.org",
  "pypi.org",
  "rubygems.org",

  // CDN/Asset Hosts (not websites)
  "cloudfront.net",
  "s3.amazonaws.com",
  "storage.googleapis.com",

  // URL Shorteners
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
];

/**
 * Check if a URL belongs to a blocked domain
 */
function isBlockedDomain(hostname: string, fullPath?: string): boolean {
  const normalizedHostname = hostname.toLowerCase();
  const fullUrl = fullPath
    ? `${normalizedHostname}${fullPath}`.toLowerCase()
    : normalizedHostname;

  // Check exact matches and subdomain matches
  for (const blockedDomain of BLOCKED_DOMAINS) {
    const normalizedBlocked = blockedDomain.toLowerCase();

    // If blocked domain has a path (e.g., amazon.com/appstore)
    if (normalizedBlocked.includes("/")) {
      // Check if the full URL starts with the blocked domain+path
      if (fullUrl.startsWith(normalizedBlocked)) {
        return true;
      }
    } else {
      // Exact match
      if (normalizedHostname === normalizedBlocked) {
        return true;
      }

      // Subdomain match (e.g., apps.apple.com matches *.apple.com)
      if (normalizedHostname.endsWith(`.${normalizedBlocked}`)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Comprehensive URL validation with support for modern URL formats
 */
export function validateUrl(input: string): ValidationResult {
  if (!input || input.trim().length === 0) {
    return { isValid: false, error: "URL is required" };
  }

  // Trim whitespace
  const trimmed = input.trim();

  // Check minimum length
  if (trimmed.length < 3) {
    return { isValid: false, error: "URL is too short" };
  }

  // Check for invalid characters (basic sanitization)
  const hasInvalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(trimmed);
  if (hasInvalidChars) {
    return { isValid: false, error: "URL contains invalid characters" };
  }

  // Add protocol if missing
  let urlWithProtocol = trimmed;
  if (!/^https?:\/\//i.test(urlWithProtocol)) {
    // Check if it looks like a domain (contains a dot or starts with localhost)
    if (/\./.test(urlWithProtocol) || urlWithProtocol.startsWith("localhost")) {
      urlWithProtocol = `https://${urlWithProtocol}`;
    } else {
      return {
        isValid: false,
        error: "Please enter a valid URL (e.g., https://example.com)",
      };
    }
  }

  // Try to parse as URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlWithProtocol);
  } catch {
    return {
      isValid: false,
      error: "Invalid URL format. Please check and try again.",
    };
  }

  // Validate protocol
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return {
      isValid: false,
      error: "Only HTTP and HTTPS protocols are supported",
    };
  }

  // Validate hostname
  const hostname = parsedUrl.hostname;
  if (!hostname || hostname.length === 0) {
    return { isValid: false, error: "Hostname is required" };
  }

  // Check if URL belongs to a blocked domain
  if (isBlockedDomain(hostname, parsedUrl.pathname)) {
    return {
      isValid: false,
      error:
        "App store URLs, social media, and marketplace links cannot be audited. Please provide your startup website URL.",
    };
  }

  // Check for valid hostname format
  // Allows: localhost, subdomains, multiple extensions (example.co.uk)
  const hostnameRegex =
    /^(localhost|([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;
  if (!hostnameRegex.test(hostname)) {
    return {
      isValid: false,
      error: "Invalid hostname. Please enter a valid domain.",
    };
  }

  // Check for consecutive dots
  if (/\.\./.test(hostname)) {
    return {
      isValid: false,
      error: "Hostname cannot contain consecutive dots",
    };
  }

  // Validate hostname length (max 253 characters)
  if (hostname.length > 253) {
    return {
      isValid: false,
      error: "Hostname is too long (max 253 characters)",
    };
  }

  // Check each label in hostname
  const labels = hostname.split(".");
  for (const label of labels) {
    // Each label must be 1-63 characters
    if (label.length === 0 || label.length > 63) {
      return {
        isValid: false,
        error: "Invalid hostname: domain label too long",
      };
    }

    // Labels cannot start or end with hyphen
    if (label.startsWith("-") || label.endsWith("-")) {
      return {
        isValid: false,
        error: "Invalid hostname: labels cannot start or end with hyphen",
      };
    }

    // Labels must be alphanumeric (hyphens allowed in middle)
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label)) {
      return {
        isValid: false,
        error: "Invalid hostname: labels must be alphanumeric",
      };
    }
  }

  // Validate TLD (must be at least 2 characters, alphabetic)
  const tld = labels[labels.length - 1];
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return {
      isValid: false,
      error: "Invalid TLD. Must be at least 2 alphabetic characters.",
    };
  }

  // Construct normalized URL (force HTTPS, remove trailing slash)
  const normalizedUrl = `https://${hostname}${parsedUrl.pathname.replace(/\/$/, "")}`;

  // Construct host URL (domain only)
  const hostUrl = `https://${hostname}`;

  return {
    isValid: true,
    normalizedUrl,
    hostUrl,
  };
}

/**
 * Server-side URL validation with additional security checks
 */
export function validateUrlServer(input: string): ValidationResult {
  const result = validateUrl(input);

  if (!result.isValid) {
    return result;
  }

  // Additional server-side security checks
  const parsedUrl = new URL(result.normalizedUrl!);
  const hostname = parsedUrl.hostname;

  // Block localhost/private IPs in production (optional, uncomment if needed)
  // if (process.env.NODE_ENV === "production") {
  //   const privateIpRegex =
  //     /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|0\.0\.0\.0|::1|localhost)/;
  //   if (privateIpRegex.test(hostname)) {
  //     return {
  //       isValid: false,
  //       error: "Internal addresses are not allowed in production",
  //     };
  //   }
  // }

  // Block known malicious patterns
  const maliciousPatterns = [/\.onion$/, /\.i2p$/, /\.bit$/, /\.crypto$/];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(hostname)) {
      return {
        isValid: false,
        error: "This domain type is not supported",
      };
    }
  }

  return result;
}
