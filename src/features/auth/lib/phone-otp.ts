import { createHash, createHmac, randomInt, timingSafeEqual } from "crypto";
import {
  OTP_CODE_LENGTH,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
  PHONE_VERIFICATION_TOKEN_TTL_MS,
} from "@/shared/constants/auth";
import { getEnv, isDemoOtpEnabled, shouldExposeOtpInResponse } from "@/shared/config/env";
import { ConflictError, ValidationError } from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";
import { prisma } from "@/shared/lib/prisma";
import { isValidKgPhone, normalizePhone } from "@/features/auth/lib/phone";

function getOtpSigningSecret(): string {
  const env = getEnv();
  return env.OTP_SECRET || env.DATABASE_URL;
}

export function hashOtpCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function generateOtpCode(): string {
  const max = 10 ** OTP_CODE_LENGTH;
  const value = randomInt(0, max);
  return value.toString().padStart(OTP_CODE_LENGTH, "0");
}

export function assertValidPhone(phoneInput: string): string {
  const phone = normalizePhone(phoneInput);
  if (!isValidKgPhone(phone)) {
    throw new ValidationError("Телефон должен быть в формате +996XXXXXXXXX");
  }
  return phone;
}

export type SendOtpResult = {
  phone: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
  /** Never persisted. Present only in development or DEMO_OTP_ENABLED production. */
  devOtpCode?: string;
  /** True only when production DEMO_OTP_ENABLED is on. */
  demoMode?: boolean;
};

export async function sendPhoneOtp(phoneInput: string): Promise<SendOtpResult> {
  const phone = assertValidPhone(phoneInput);
  const env = getEnv();
  const exposeOtp = shouldExposeOtpInResponse();
  const demoMode = env.NODE_ENV === "production" && isDemoOtpEnabled();

  if (env.NODE_ENV === "production" && !env.SMS_PROVIDER && !isDemoOtpEnabled()) {
    throw new ValidationError("SMS-подтверждение пока не настроено");
  }

  const latest = await prisma.phoneOtp.findFirst({
    where: { phone },
    orderBy: { created_at: "desc" },
  });

  if (latest) {
    const elapsed = Date.now() - latest.created_at.getTime();
    if (elapsed < OTP_RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsed) / 1000);
      throw new ValidationError(`Повторно отправить код можно через ${waitSeconds} сек.`);
    }
  }

  const code = generateOtpCode();
  const codeHash = hashOtpCode(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.phoneOtp.create({
    data: {
      phone,
      code_hash: codeHash,
      expires_at: expiresAt,
    },
  });

  if (env.NODE_ENV !== "production") {
    console.warn(`DEV OTP for ${phone}: ${code}`);
    logger.info("DEV OTP generated", { phone });
  } else if (demoMode) {
    console.warn(`DEMO OTP for ${phone}: ${code}`);
    logger.warn("DEMO OTP mode enabled — disable DEMO_OTP_ENABLED before real launch", {
      phone,
    });
  } else if (env.SMS_PROVIDER) {
    logger.info("OTP generated for production SMS provider", {
      phone,
      provider: env.SMS_PROVIDER,
    });
  }

  return {
    phone,
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
    resendAvailableInSeconds: Math.floor(OTP_RESEND_COOLDOWN_MS / 1000),
    ...(exposeOtp ? { devOtpCode: code } : {}),
    ...(demoMode ? { demoMode: true } : {}),
  };
}

export type VerifyOtpResult = {
  phone: string;
  phoneVerificationToken: string;
};

export async function verifyPhoneOtp(phoneInput: string, codeInput: string): Promise<VerifyOtpResult> {
  const phone = assertValidPhone(phoneInput);
  const code = codeInput.trim();

  if (!/^\d{6}$/.test(code)) {
    throw new ValidationError("Код должен состоять из 6 цифр");
  }

  const otp = await prisma.phoneOtp.findFirst({
    where: {
      phone,
      consumed_at: null,
    },
    orderBy: { created_at: "desc" },
  });

  if (!otp) {
    throw new ValidationError("Запросите код подтверждения");
  }

  if (otp.expires_at.getTime() < Date.now()) {
    throw new ValidationError("Код истёк");
  }

  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    throw new ValidationError("Слишком много попыток. Запросите новый код.");
  }

  const expectedHash = hashOtpCode(code);
  const a = Buffer.from(otp.code_hash);
  const b = Buffer.from(expectedHash);
  const matches = a.length === b.length && timingSafeEqual(a, b);

  if (!matches) {
    await prisma.phoneOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    throw new ValidationError("Код неверный");
  }

  await prisma.phoneOtp.update({
    where: { id: otp.id },
    data: { consumed_at: new Date() },
  });

  return {
    phone,
    phoneVerificationToken: createPhoneVerificationToken(phone),
  };
}

type PhoneVerificationPayload = {
  phone: string;
  exp: number;
};

export function createPhoneVerificationToken(phone: string): string {
  const payload: PhoneVerificationPayload = {
    phone,
    exp: Date.now() + PHONE_VERIFICATION_TOKEN_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", getOtpSigningSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyPhoneVerificationToken(token: string, expectedPhone: string): void {
  if (!token || !token.includes(".")) {
    throw new ValidationError("Подтвердите телефон по коду из SMS");
  }

  const [body, signature] = token.split(".");
  if (!body || !signature) {
    throw new ValidationError("Подтвердите телефон по коду из SMS");
  }

  const expected = createHmac("sha256", getOtpSigningSecret()).update(body).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new ValidationError("Токен подтверждения телефона недействителен");
  }

  let payload: PhoneVerificationPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as PhoneVerificationPayload;
  } catch {
    throw new ValidationError("Токен подтверждения телефона недействителен");
  }

  if (payload.exp < Date.now()) {
    throw new ValidationError("Подтверждение телефона истекло. Запросите код снова.");
  }

  const normalizedExpected = normalizePhone(expectedPhone);
  if (payload.phone !== normalizedExpected) {
    throw new ConflictError("Подтверждённый телефон не совпадает");
  }
}
