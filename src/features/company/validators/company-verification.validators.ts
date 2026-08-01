import { CompanyVerificationStatus } from "@prisma/client";
import { z } from "zod";

export const adminCompanyVerificationSchema = z.object({
  action: z.enum(["verify", "reject", "reset", "pending"]),
  note: z
    .string()
    .trim()
    .max(2000, "Заметка слишком длинная")
    .optional()
    .nullable()
    .transform((value) => (value && value.trim() ? value.trim() : null)),
});

export type AdminCompanyVerificationInput = z.infer<
  typeof adminCompanyVerificationSchema
>;

export function resolveVerificationStatusFromAction(
  action: AdminCompanyVerificationInput["action"],
): CompanyVerificationStatus {
  switch (action) {
    case "verify":
      return CompanyVerificationStatus.VERIFIED;
    case "reject":
      return CompanyVerificationStatus.REJECTED;
    case "pending":
      return CompanyVerificationStatus.PENDING;
    case "reset":
    default:
      return CompanyVerificationStatus.UNVERIFIED;
  }
}
