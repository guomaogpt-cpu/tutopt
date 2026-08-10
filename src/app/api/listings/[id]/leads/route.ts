import { ListingStatus } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import { findRecentDuplicateLead } from "@/features/leads/lib/lead-duplicate-check";
import {
  buildLeadMessage,
  createLeadSchema,
} from "@/features/leads/validators/lead.validators";
import { createNewLeadNotification } from "@/features/notifications/lib/notifications-data";
import { isListingExpired } from "@/lib/listings/listing-expiration";
import { validateLeadContent } from "@/lib/moderation/content-checks";
import { assertLeadCreateRateLimits } from "@/lib/security/rate-limit";
import { getLeadRestrictionMessage } from "@/lib/security/user-restrictions";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const listingIdSchema = z.string().uuid();

type LeadRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: LeadRouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    const leadRestrictionMessage = getLeadRestrictionMessage(user);
    if (leadRestrictionMessage) {
      throw new ForbiddenError(leadRestrictionMessage);
    }

    const { id } = await context.params;
    const listingId = listingIdSchema.safeParse(id);

    if (!listingId.success) {
      throw new NotFoundError("Listing not found");
    }

    const input = await parseJsonBody(request, createLeadSchema);

    const contentIssues = validateLeadContent({ message: input.message });
    if (contentIssues.length > 0) {
      const fieldErrors: Record<string, string[]> = {};

      for (const issue of contentIssues) {
        fieldErrors[issue.field] = [...(fieldErrors[issue.field] ?? []), issue.message];
      }

      throw new ValidationError(contentIssues[0]?.message ?? "Проверьте текст сообщения", {
        fieldErrors,
      });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId.data },
      select: {
        id: true,
        title: true,
        status: true,
        vertical: true,
        expires_at: true,
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
      throw new ForbiddenError("LEAD_OWN_LISTING");
    }

    if (listing.status !== ListingStatus.PUBLISHED) {
      throw new ForbiddenError("LEAD_UNAVAILABLE_LISTING");
    }

    if (isListingExpired({ expires_at: listing.expires_at })) {
      throw new ForbiddenError("LEAD_UNAVAILABLE_LISTING");
    }

    assertLeadCreateRateLimits(user.id, listing.id);

    const message = buildLeadMessage(input);

    const duplicateLead = input.force_resend
      ? null
      : await findRecentDuplicateLead({
          buyerId: user.id,
          listingId: listing.id,
          message,
        });

    if (duplicateLead) {
      throw new ConflictError("LEAD_ALREADY_SENT");
    }

    const hasContactPhone = Boolean(input.contact_phone?.trim() || user.phone?.trim());
    if (!hasContactPhone) {
      throw new ValidationError("LEAD_PHONE_REQUIRED", {
        fieldErrors: {
          contact_phone: ["LEAD_PHONE_REQUIRED"],
        },
      });
    }

    const lead = await prisma.lead.create({
      data: {
        listing_id: listing.id,
        buyer_id: user.id,
        seller_profile_id: listing.sellerProfile.id,
        quantity: input.quantity,
        message,
      },
      select: { id: true },
    });

    try {
      await createNewLeadNotification({
        recipientId: listing.sellerProfile.user_id,
        actorId: user.id,
        listingTitle: listing.title,
        vertical: listing.vertical,
      });
    } catch {
      // Notification/push must not block lead creation.
    }

    return jsonData({ lead }, 201);
  });
}
