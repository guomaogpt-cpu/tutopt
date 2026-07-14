import { AuthProvider, UserRole, type User } from "@prisma/client";
import { z } from "zod";
import { isValidKgPhone, normalizePhone } from "@/features/auth/lib/phone";

const publicRegisterRoleSchema = z.enum([UserRole.BUYER, UserRole.SELLER]);

const passwordSchema = z
  .string()
  .min(8, "Пароль должен содержать минимум 8 символов")
  .max(128, "Пароль не должен превышать 128 символов");

const phoneRequiredSchema = z
  .string()
  .min(1, "Укажите телефон")
  .transform((value) => normalizePhone(value))
  .refine((value) => isValidKgPhone(value), {
    message: "Телефон должен быть в формате +996XXXXXXXXX",
  });

export const registerSchema = z.object({
  phone: phoneRequiredSchema,
  password: passwordSchema,
  name: z.string().min(2, "Имя слишком короткое").max(100, "Имя слишком длинное"),
  role: publicRegisterRoleSchema.default(UserRole.BUYER),
  phoneVerificationToken: z.string().min(1, "Подтвердите телефон по коду из SMS"),
});

export const loginSchema = z.object({
  phone: phoneRequiredSchema,
  password: z.string().min(1, "Введите пароль"),
  remember_me: z.boolean().optional().default(false),
});

export const otpSendSchema = z.object({
  phone: phoneRequiredSchema,
});

export const otpVerifySchema = z.object({
  phone: phoneRequiredSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Некорректный email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Токен сброса не указан"),
  password: passwordSchema,
});

export const googleAuthRoleSchema = publicRegisterRoleSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpSendInput = z.infer<typeof otpSendSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export type PublicAuthRole = typeof UserRole.BUYER | typeof UserRole.SELLER;

export function isPublicAuthRole(role: string): role is PublicAuthRole {
  return role === UserRole.BUYER || role === UserRole.SELLER;
}

export type UserAuthFields = Pick<User, "password_hash" | "auth_provider" | "google_id">;

export { AuthProvider };
