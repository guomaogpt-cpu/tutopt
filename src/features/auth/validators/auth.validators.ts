import { UserRole } from "@prisma/client";
import { z } from "zod";

const publicRegisterRoleSchema = z.enum([UserRole.BUYER, UserRole.SELLER]);

const phoneSchema = z
  .string()
  .regex(/^\+996\d{9}$/, "Телефон должен быть в формате +996XXXXXXXXX");

const passwordSchema = z
  .string()
  .min(8, "Пароль должен содержать минимум 8 символов")
  .max(128, "Пароль не должен превышать 128 символов");

export const registerSchema = z
  .object({
    email: z.string().email("Некорректный email").optional(),
    phone: phoneSchema.optional(),
    password: passwordSchema,
    name: z.string().min(2, "Имя слишком короткое").max(100, "Имя слишком длинное"),
    role: publicRegisterRoleSchema.default(UserRole.BUYER),
    company_name: z
      .string()
      .min(2, "Название компании слишком короткое")
      .max(200, "Название компании слишком длинное")
      .optional(),
  })
  .refine((data) => Boolean(data.email ?? data.phone), {
    message: "Укажите email или телефон",
    path: ["email"],
  })
  .refine((data) => data.role !== UserRole.SELLER || Boolean(data.company_name), {
    message: "Для продавца укажите название компании",
    path: ["company_name"],
  });

export const loginSchema = z
  .object({
    email: z.string().email("Некорректный email").optional(),
    phone: phoneSchema.optional(),
    password: z.string().min(1, "Введите пароль"),
    remember_me: z.boolean().optional().default(false),
  })
  .refine((data) => Boolean(data.email ?? data.phone), {
    message: "Укажите email или телефон",
    path: ["email"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Некорректный email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Токен сброса не указан"),
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
