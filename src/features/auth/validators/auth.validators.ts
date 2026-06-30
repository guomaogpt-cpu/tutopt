import { UserRole } from "@prisma/client";
import { z } from "zod";

const publicRegisterRoleSchema = z.enum([UserRole.BUYER, UserRole.SELLER]);

const phoneSchema = z
  .string()
  .regex(/^\+996\d{9}$/, "Phone must be in E.164 format (+996XXXXXXXXX)");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email").optional(),
    phone: phoneSchema.optional(),
    password: passwordSchema,
    name: z.string().min(2, "Name is too short").max(100, "Name is too long"),
    role: publicRegisterRoleSchema.default(UserRole.BUYER),
    company_name: z.string().min(2).max(200).optional(),
  })
  .refine((data) => Boolean(data.email ?? data.phone), {
    message: "Either email or phone is required",
    path: ["email"],
  })
  .refine((data) => data.role !== UserRole.SELLER || Boolean(data.company_name), {
    message: "company_name is required for sellers",
    path: ["company_name"],
  });

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email").optional(),
    phone: phoneSchema.optional(),
    password: z.string().min(1, "Password is required"),
    remember_me: z.boolean().optional().default(false),
  })
  .refine((data) => Boolean(data.email ?? data.phone), {
    message: "Either email or phone is required",
    path: ["email"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
