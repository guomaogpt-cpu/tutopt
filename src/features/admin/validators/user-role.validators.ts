import { UserRole } from "@prisma/client";
import { z } from "zod";

export const changeUserRoleSchema = z.object({
  role: z.enum([UserRole.BUYER, UserRole.MODERATOR], {
    errorMap: () => ({ message: "Role must be BUYER or MODERATOR" }),
  }),
});

export type ChangeUserRoleInput = z.infer<typeof changeUserRoleSchema>;

export const ADMIN_ASSIGNABLE_ROLES = [UserRole.BUYER, UserRole.MODERATOR] as const;
