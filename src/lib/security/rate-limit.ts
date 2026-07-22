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

export const REPORT_CREATE_RATE_LIMIT = {
  limit: 10,
  windowMs: 60 * 60 * 1000,
  message: "Можно отправить не более 10 жалоб в час. Попробуйте позже.",
} as const;

export function assertReportCreateRateLimit(userId: string): void {
  assertRateLimit(
    `report:create:${userId}`,
    REPORT_CREATE_RATE_LIMIT.limit,
    REPORT_CREATE_RATE_LIMIT.windowMs,
    REPORT_CREATE_RATE_LIMIT.message,
  );
}

export const OTP_SEND_PHONE_RATE_LIMIT = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
  message: "Слишком много запросов кода на этот номер. Попробуйте позже.",
} as const;

export const OTP_SEND_IP_RATE_LIMIT = {
  limit: 20,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много запросов кода с этого устройства. Попробуйте позже.",
} as const;

export function assertOtpSendRateLimits(phone: string, ip: string): void {
  assertRateLimit(
    `otp:send:phone:${phone}`,
    OTP_SEND_PHONE_RATE_LIMIT.limit,
    OTP_SEND_PHONE_RATE_LIMIT.windowMs,
    OTP_SEND_PHONE_RATE_LIMIT.message,
  );
  assertRateLimit(
    `otp:send:ip:${ip}`,
    OTP_SEND_IP_RATE_LIMIT.limit,
    OTP_SEND_IP_RATE_LIMIT.windowMs,
    OTP_SEND_IP_RATE_LIMIT.message,
  );
}

export const OTP_VERIFY_PHONE_RATE_LIMIT = {
  limit: 20,
  windowMs: 15 * 60 * 1000,
  message: "Слишком много попыток проверки кода. Попробуйте позже.",
} as const;

export const OTP_VERIFY_IP_RATE_LIMIT = {
  limit: 40,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много попыток проверки кода с этого устройства. Попробуйте позже.",
} as const;

export function assertOtpVerifyRateLimits(phone: string, ip: string): void {
  assertRateLimit(
    `otp:verify:phone:${phone}`,
    OTP_VERIFY_PHONE_RATE_LIMIT.limit,
    OTP_VERIFY_PHONE_RATE_LIMIT.windowMs,
    OTP_VERIFY_PHONE_RATE_LIMIT.message,
  );
  assertRateLimit(
    `otp:verify:ip:${ip}`,
    OTP_VERIFY_IP_RATE_LIMIT.limit,
    OTP_VERIFY_IP_RATE_LIMIT.windowMs,
    OTP_VERIFY_IP_RATE_LIMIT.message,
  );
}

export const LOGIN_PHONE_RATE_LIMIT = {
  limit: 10,
  windowMs: 15 * 60 * 1000,
  message: "Слишком много попыток входа. Попробуйте позже.",
} as const;

export const LOGIN_IP_RATE_LIMIT = {
  limit: 30,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много попыток входа с этого устройства. Попробуйте позже.",
} as const;

export function assertLoginRateLimits(phone: string, ip: string): void {
  assertRateLimit(
    `auth:login:phone:${phone}`,
    LOGIN_PHONE_RATE_LIMIT.limit,
    LOGIN_PHONE_RATE_LIMIT.windowMs,
    LOGIN_PHONE_RATE_LIMIT.message,
  );
  assertRateLimit(
    `auth:login:ip:${ip}`,
    LOGIN_IP_RATE_LIMIT.limit,
    LOGIN_IP_RATE_LIMIT.windowMs,
    LOGIN_IP_RATE_LIMIT.message,
  );
}

export const REGISTER_IP_RATE_LIMIT = {
  limit: 5,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много регистраций с этого устройства. Попробуйте позже.",
} as const;

export function assertRegisterRateLimit(ip: string): void {
  assertRateLimit(
    `auth:register:ip:${ip}`,
    REGISTER_IP_RATE_LIMIT.limit,
    REGISTER_IP_RATE_LIMIT.windowMs,
    REGISTER_IP_RATE_LIMIT.message,
  );
}

export const FORGOT_PASSWORD_EMAIL_RATE_LIMIT = {
  limit: 5,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много запросов сброса пароля. Попробуйте позже.",
} as const;

export const FORGOT_PASSWORD_IP_RATE_LIMIT = {
  limit: 10,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много запросов сброса пароля. Попробуйте позже.",
} as const;

export function assertForgotPasswordRateLimits(email: string, ip: string): void {
  assertRateLimit(
    `auth:forgot:email:${email.toLowerCase()}`,
    FORGOT_PASSWORD_EMAIL_RATE_LIMIT.limit,
    FORGOT_PASSWORD_EMAIL_RATE_LIMIT.windowMs,
    FORGOT_PASSWORD_EMAIL_RATE_LIMIT.message,
  );
  assertRateLimit(
    `auth:forgot:ip:${ip}`,
    FORGOT_PASSWORD_IP_RATE_LIMIT.limit,
    FORGOT_PASSWORD_IP_RATE_LIMIT.windowMs,
    FORGOT_PASSWORD_IP_RATE_LIMIT.message,
  );
}

export const RESET_PASSWORD_IP_RATE_LIMIT = {
  limit: 10,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много попыток сброса пароля. Попробуйте позже.",
} as const;

export function assertResetPasswordRateLimit(ip: string): void {
  assertRateLimit(
    `auth:reset:ip:${ip}`,
    RESET_PASSWORD_IP_RATE_LIMIT.limit,
    RESET_PASSWORD_IP_RATE_LIMIT.windowMs,
    RESET_PASSWORD_IP_RATE_LIMIT.message,
  );
}

export const UPLOAD_USER_RATE_LIMIT = {
  limit: 60,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много загрузок изображений. Попробуйте позже.",
} as const;

export function assertUploadRateLimit(userId: string): void {
  assertRateLimit(
    `upload:listing:${userId}`,
    UPLOAD_USER_RATE_LIMIT.limit,
    UPLOAD_USER_RATE_LIMIT.windowMs,
    UPLOAD_USER_RATE_LIMIT.message,
  );
}

export const FAVORITE_TOGGLE_RATE_LIMIT = {
  limit: 60,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много действий с избранным. Попробуйте позже.",
} as const;

export function assertFavoriteToggleRateLimit(userId: string): void {
  assertRateLimit(
    `favorite:toggle:${userId}`,
    FAVORITE_TOGGLE_RATE_LIMIT.limit,
    FAVORITE_TOGGLE_RATE_LIMIT.windowMs,
    FAVORITE_TOGGLE_RATE_LIMIT.message,
  );
}

export const LISTING_UPDATE_RATE_LIMIT = {
  limit: 30,
  windowMs: 60 * 60 * 1000,
  message: "Слишком много обновлений объявлений. Попробуйте позже.",
} as const;

export function assertListingUpdateRateLimit(userId: string): void {
  assertRateLimit(
    `listing:update:${userId}`,
    LISTING_UPDATE_RATE_LIMIT.limit,
    LISTING_UPDATE_RATE_LIMIT.windowMs,
    LISTING_UPDATE_RATE_LIMIT.message,
  );
}

/** @internal Test helper — clears in-memory buckets. */
export function resetRateLimitStoreForTests(): void {
  buckets.clear();
}
