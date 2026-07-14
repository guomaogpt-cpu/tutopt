export const SESSION_COOKIE_NAME = "tutopt_session";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours
export const SESSION_REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 60 * 60 * 24 * 1000; // 24 hours

export const BCRYPT_ROUNDS = 12;

export const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_CODE_LENGTH = 6;
export const PHONE_VERIFICATION_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes
