import { RateLimitError } from "@/shared/lib/errors";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterMs: number;
};

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      retryAfterMs: 0,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterMs: Math.max(0, existing.resetAt - now),
    };
  }

  existing.count += 1;
  buckets.set(key, existing);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - existing.count),
    retryAfterMs: 0,
  };
}

export function assertRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  message = "Слишком много запросов. Попробуйте позже.",
): void {
  const result = checkRateLimit(key, limit, windowMs);

  if (!result.allowed) {
    throw new RateLimitError(message);
  }
}

export const LISTING_CREATE_RATE_LIMIT = {
  limit: 10,
  windowMs: 60 * 60 * 1000,
  message: "Можно создать не более 10 объявлений в час. Попробуйте позже.",
} as const;

export const LEAD_CREATE_USER_RATE_LIMIT = {
  limit: 20,
  windowMs: 60 * 60 * 1000,
  message: "Можно отправить не более 20 заявок в час. Попробуйте позже.",
} as const;

export const LEAD_CREATE_LISTING_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
  message: "Слишком много заявок по этому объявлению. Попробуйте через несколько минут.",
} as const;

export function assertListingCreateRateLimit(userId: string): void {
  assertRateLimit(
    `listing:create:${userId}`,
    LISTING_CREATE_RATE_LIMIT.limit,
    LISTING_CREATE_RATE_LIMIT.windowMs,
    LISTING_CREATE_RATE_LIMIT.message,
  );
}

export function assertLeadCreateRateLimits(userId: string, listingId: string): void {
  assertRateLimit(
    `lead:create:${userId}`,
    LEAD_CREATE_USER_RATE_LIMIT.limit,
    LEAD_CREATE_USER_RATE_LIMIT.windowMs,
    LEAD_CREATE_USER_RATE_LIMIT.message,
  );

  assertRateLimit(
    `lead:listing:${userId}:${listingId}`,
    LEAD_CREATE_LISTING_RATE_LIMIT.limit,
    LEAD_CREATE_LISTING_RATE_LIMIT.windowMs,
    LEAD_CREATE_LISTING_RATE_LIMIT.message,
  );
}

/** @internal Test helper — clears in-memory buckets. */
export function resetRateLimitStoreForTests(): void {
  buckets.clear();
}
