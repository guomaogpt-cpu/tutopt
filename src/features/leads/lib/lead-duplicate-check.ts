import { normalizeText } from "@/lib/moderation/content-checks";
import { prisma } from "@/shared/lib/prisma";

const DUPLICATE_LEAD_WINDOW_MS = 10 * 60 * 1000;

export async function findRecentDuplicateLead(params: {
  buyerId: string;
  listingId: string;
  message: string | null;
}): Promise<{ id: string } | null> {
  const normalizedMessage = normalizeText(params.message ?? "");
  if (!normalizedMessage) {
    return null;
  }

  const since = new Date(Date.now() - DUPLICATE_LEAD_WINDOW_MS);

  const recentLeads = await prisma.lead.findMany({
    where: {
      buyer_id: params.buyerId,
      listing_id: params.listingId,
      created_at: { gte: since },
    },
    select: {
      id: true,
      message: true,
    },
    orderBy: { created_at: "desc" },
    take: 10,
  });

  return (
    recentLeads.find((lead) => normalizeText(lead.message ?? "") === normalizedMessage) ?? null
  );
}
