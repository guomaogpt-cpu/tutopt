import { getCurrentUser } from "@/features/auth/lib/session";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { UnauthorizedError } from "@/shared/lib/errors";

export async function GET() {
  return withApiHandler(async () => {
    const user = await getCurrentUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    return jsonData({ user });
  });
}
