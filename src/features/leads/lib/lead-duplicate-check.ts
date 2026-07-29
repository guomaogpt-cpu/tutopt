import { prisma } from "@/shared/lib/prisma";

const DUPLICATE_LEAD_WINDOW_MS = 10 * 60 * 1000;

/**
 * Soft duplicate guard: same buyer + listing within a short window.
 * No unique DB constraint — known gap documented in Phase 61.
 */
export async function findRecentDuplicateLead(params: {
  buyerId: string;
  listingId: string;
  message: string | null;
}): Promise<{ id: string } | null> {
  const since = new Date(Date.now() - DUPLICATE_LEAD_WINDOW_MS);

  const recentLead = await prisma.lead.findFirst({
    where: {
      buyer_id: params.buyerId,
      listing_id: params.listingId,
      created_at: { gte: since },
    },
    select: { id: true },
    orderBy: { created_at: "desc" },
  });

  return recentLead;
}
