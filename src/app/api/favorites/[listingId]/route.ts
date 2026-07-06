import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { NotFoundError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const listingIdSchema = z.string().uuid();

type FavoriteRouteContext = {
  params: Promise<{ listingId: string }>;
};

async function getListingId(context: FavoriteRouteContext): Promise<string> {
  const { listingId } = await context.params;
  const parsed = listingIdSchema.safeParse(listingId);

  if (!parsed.success) {
    throw new NotFoundError("Listing not found");
  }

  return parsed.data;
}

async function ensureListingExists(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true },
  });

  if (!listing) {
    throw new NotFoundError("Listing not found");
  }
}

export async function POST(_request: Request, context: FavoriteRouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const listingId = await getListingId(context);

    await ensureListingExists(listingId);

    await prisma.favorite.upsert({
      where: {
        user_id_listing_id: {
          user_id: user.id,
          listing_id: listingId,
        },
      },
      create: {
        user_id: user.id,
        listing_id: listingId,
      },
      update: {},
    });

    return jsonData({ listingId, favorited: true }, 201);
  });
}

export async function DELETE(_request: Request, context: FavoriteRouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const listingId = await getListingId(context);

    await prisma.favorite.deleteMany({
      where: {
        user_id: user.id,
        listing_id: listingId,
      },
    });

    return jsonData({ listingId, favorited: false });
  });
}
