import { LeadStatus } from "@prisma/client";
import { prisma } from "@/shared/lib/prisma";

/**
 * Soft duplicate guard: same buyer + listing with an active lead (NEW/VIEWED).
 * Closed/rejected leads allow a new request.
 */
export async function findRecentDuplicateLead(params: {
  buyerId: string;
  listingId: string;
}): Promise<{ id: string } | null> {
  const activeLead = await prisma.lead.findFirst({
    where: {
      buyer_id: params.buyerId,
      listing_id: params.listingId,
      status: { in: [LeadStatus.NEW, LeadStatus.VIEWED] },
    },
    select: { id: true },
    orderBy: { created_at: "desc" },
  });

  return activeLead;
}
