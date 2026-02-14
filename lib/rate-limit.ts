interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

interface StoredCounter {
  count: number;
  resetAt: number;
}

const globalStore = globalThis as typeof globalThis & {
  __launchRecordRateLimitStore?: Map<string, StoredCounter>;
};

const store = globalStore.__launchRecordRateLimitStore ?? new Map<string, StoredCounter>();

globalStore.__launchRecordRateLimitStore = store;

export function rateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(options.key);

  if (!entry || entry.resetAt <= now) {
    const nextEntry: StoredCounter = {
      count: 1,
      resetAt: now + options.windowMs,
    };

    store.set(options.key, nextEntry);

    return {
      allowed: true,
      remaining: Math.max(options.limit - 1, 0),
      retryAfterMs: options.windowMs,
    };
  }

  if (entry.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(entry.resetAt - now, 0),
    };
  }

  entry.count += 1;
  store.set(options.key, entry);

  return {
    allowed: true,
    remaining: Math.max(options.limit - entry.count, 0),
    retryAfterMs: Math.max(entry.resetAt - now, 0),
  };
}
