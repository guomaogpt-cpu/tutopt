import { LeadStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import { leadStatusLabels } from "@/features/leads/lib/lead-status";
import { createLeadStatusUpdatedNotification } from "@/features/notifications/lib/notifications-data";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const leadIdSchema = z.string().uuid();
const updateLeadStatusSchema = z.object({
  status: z.enum([LeadStatus.VIEWED, LeadStatus.CLOSED, LeadStatus.REJECTED]),
});

type LeadStatusRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: LeadStatusRouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Доступно только продавцам");
    }

    const { id } = await context.params;
    const leadId = leadIdSchema.safeParse(id);
    if (!leadId.success) {
      throw new NotFoundError("Lead not found");
    }

    const input = await parseJsonBody(request, updateLeadStatusSchema);

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      throw new ForbiddenError("Профиль продавца не найден");
    }

    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId.data,
        seller_profile_id: sellerProfile.id,
      },
      select: {
        id: true,
        status: true,
        viewed_at: true,
        buyer_id: true,
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!lead) {
      throw new NotFoundError("Lead not found");
    }

    if (lead.status === input.status) {
      return jsonData({ lead: { id: lead.id, status: lead.status } });
    }

    const nextStatus = input.status;
    const updated = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: nextStatus,
        viewed_at:
          nextStatus === LeadStatus.VIEWED ||
          nextStatus === LeadStatus.CLOSED ||
          nextStatus === LeadStatus.REJECTED
            ? (lead.viewed_at ?? new Date())
            : lead.viewed_at,
      },
      select: {
        id: true,
        status: true,
      },
    });

    try {
      await createLeadStatusUpdatedNotification({
        recipientId: lead.buyer_id,
        actorId: user.id,
        listingId: lead.listing.id,
        listingTitle: lead.listing.title,
        statusLabel: leadStatusLabels[nextStatus],
      });
    } catch {
      // Notification must not block status update.
    }

    return jsonData({ lead: updated });
  });
}
