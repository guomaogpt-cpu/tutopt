import { requireAuth } from "@/features/auth/lib/session";
import { getUserFavoriteListings } from "@/features/favorites/lib/favorites-data";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";

export async function GET() {
  return withApiHandler(async () => {
    const user = await requireAuth();
    const listings = await getUserFavoriteListings(user.id);

    return jsonData({ listings });
  });
}
