import { CargoRequestStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "@/features/auth/lib/session";
import { createCargoResponseSchema } from "@/features/cargo/validators/cargo-response.validators";
import { createNewCargoResponseNotifications } from "@/features/notifications/lib/notifications-data";
import { assertCargoResponseCreateRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/prisma";

const requestIdSchema = z.string().uuid();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN && user.role !== UserRole.BUYER) {
      throw new ForbiddenError("Only sellers can respond to cargo requests");
    }

    assertCargoResponseCreateRateLimit(user.id);

    const { id } = await context.params;
    const requestId = requestIdSchema.safeParse(id);
    if (!requestId.success) {
      throw new NotFoundError("Cargo request not found");
    }

    const input = await parseJsonBody(request, createCargoResponseSchema);

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: { id: true, company_name: true },
    });

    if (!sellerProfile) {
      throw new ForbiddenError("Seller profile required");
    }

    const cargoRequest = await prisma.cargoRequest.findUnique({
      where: { id: requestId.data },
      select: {
        id: true,
        status: true,
        item_name: true,
        user_id: true,
      },
    });

    if (!cargoRequest) {
      throw new NotFoundError("Cargo request not found");
    }

    if (cargoRequest.user_id && cargoRequest.user_id === user.id) {
      throw new ForbiddenError("CARGO_OWN_REQUEST");
    }

    if (cargoRequest.status === CargoRequestStatus.CLOSED) {
      throw new ValidationError("CARGO_REQUEST_CLOSED");
    }

    const existing = await prisma.cargoResponse.findUnique({
      where: {
        cargo_request_id_seller_profile_id: {
          cargo_request_id: cargoRequest.id,
          seller_profile_id: sellerProfile.id,
        },
      },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictError("CARGO_ALREADY_RESPONDED");
    }

    try {
      const response = await prisma.cargoResponse.create({
        data: {
          cargo_request_id: cargoRequest.id,
          seller_profile_id: sellerProfile.id,
          price: input.price,
          currency: input.currency,
          estimated_time: input.estimatedTime,
          comment: input.comment,
          contact_name: input.contactName,
          contact_phone: input.contactPhone,
        },
        select: { id: true },
      });

      try {
        await createNewCargoResponseNotifications({
          actorId: user.id,
          requestId: cargoRequest.id,
          requestOwnerId: cargoRequest.user_id,
          itemName: cargoRequest.item_name,
          companyName: sellerProfile.company_name,
        });
      } catch {
        // Response already saved.
      }

      return jsonData({ response }, 201);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        throw new ConflictError("CARGO_ALREADY_RESPONDED");
      }
      throw error;
    }
  });
}
