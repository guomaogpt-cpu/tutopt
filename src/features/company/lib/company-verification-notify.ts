import { CompanyVerificationStatus, NotificationType } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";
import { translate } from "@/lib/i18n/dictionaries";

export async function notifyCompanyVerificationResult(input: {
  recipientId: string;
  actorId: string;
  status: CompanyVerificationStatus;
  companyName: string;
}): Promise<void> {
  if (
    input.status !== CompanyVerificationStatus.VERIFIED &&
    input.status !== CompanyVerificationStatus.REJECTED
  ) {
    return;
  }

  const verified = input.status === CompanyVerificationStatus.VERIFIED;
  const title = verified
    ? translate("ru", "company.verification.ownerVerifiedNotification")
    : translate("ru", "company.verification.ownerRejectedNotification");
  const message = verified
    ? `${input.companyName}: ${translate("ru", "company.verification.verifiedBadge")}`
    : `${input.companyName}: ${translate("ru", "company.verification.rejected")}`;

  await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type: verified
        ? NotificationType.COMPANY_VERIFIED
        : NotificationType.COMPANY_VERIFICATION_REJECTED,
      title,
      message,
      link: "/account/company",
    },
  });
}
