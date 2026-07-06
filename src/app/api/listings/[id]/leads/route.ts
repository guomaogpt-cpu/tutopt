import { ListingStatus } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import {
  buildLeadMessage,
  createLeadSchema,
} from "@/features/leads/validators/lead.validators";
import { createNewLeadNotification } from "@/features/notifications/lib/notifications-data";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const listingIdSchema = z.string().uuid();

type LeadRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: LeadRouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const { id } = await context.params;
    const listingId = listingIdSchema.safeParse(id);

    if (!listingId.success) {
      throw new NotFoundError("Listing not found");
    }

    const input = await parseJsonBody(request, createLeadSchema);

    const listing = await prisma.listing.findUnique({
      where: { id: listingId.data },
      select: {
        id: true,
        title: true,
        status: true,
        sellerProfile: {
          select: {
            id: true,
            user_id: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundError("Listing not found");
    }

    if (listing.sellerProfile.user_id === user.id) {
      throw new ForbiddenError("Нельзя отправить заявку на своё объявление");
    }

    if (listing.status !== ListingStatus.PUBLISHED) {
      throw new ForbiddenError("Заявки принимаются только по опубликованным объявлениям");
    }

    const lead = await prisma.lead.create({
      data: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_profile_id: listing.sellerProfile.id,
        quantity: input.quantity,
        message: buildLeadMessage(input),
      },
      select: { id: true },
    });

    await createNewLeadNotification({
      recipientId: listing.sellerProfile.user_id,
      actorId: user.id,
      listingTitle: listing.title,
    });

    return jsonData({ lead }, 201);
  });
}
