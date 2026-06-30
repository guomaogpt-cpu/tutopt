import { NextResponse } from "next/server";
import { clearSession } from "@/features/auth/lib/session";
import { withApiHandler } from "@/shared/lib/api-route";
import { logger } from "@/shared/lib/logger";

export async function POST() {
  return withApiHandler(async () => {
    await clearSession();
    logger.info("User logged out");
    return new NextResponse(null, { status: 204 });
  });
}
