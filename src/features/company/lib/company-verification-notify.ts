import { CompanyVerificationStatus, NotificationType } from "@prisma/client";
import { translate } from "@/lib/i18n/dictionaries";
import { dispatchUserPush } from "@/lib/push/dispatch-user-push";
import { prisma } from "@/shared/lib/prisma";

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

  const link = "/account/company";
  const type = verified
    ? NotificationType.COMPANY_VERIFIED
    : NotificationType.COMPANY_VERIFICATION_REJECTED;

  const notification = await prisma.notification.create({
    data: {
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type,
      title,
      message,
      link,
    },
    select: { id: true },
  });

  await dispatchUserPush({
    userId: input.recipientId,
    title,
    body: message,
    url: link,
    notificationId: notification.id,
    type,
  });
}
