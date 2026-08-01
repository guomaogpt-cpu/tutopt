import { getCurrentUser } from "@/features/auth/lib/session";
import { createCargoRequestSchema } from "@/features/cargo/validators/cargo-request.validators";
import { createNewCargoRequestNotifications } from "@/features/notifications/lib/notifications-data";
import { getClientIpFromRequest } from "@/lib/security/client-ip";
import { assertCargoRequestCreateRateLimits } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { prisma } from "@/shared/lib/prisma";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await getCurrentUser();
    const ip = getClientIpFromRequest(request);

    assertCargoRequestCreateRateLimits(ip, user?.id ?? null);

    const input = await parseJsonBody(request, createCargoRequestSchema);

    const cargoRequest = await prisma.cargoRequest.create({
      data: {
        name: input.name,
        phone: input.phone,
        company: input.company,
        from_location: input.fromLocation,
        to_location: input.toLocation,
        item_name: input.itemName,
        description: input.description,
        item_photo_url: input.itemPhotoUrl,
        quantity: input.quantity,
        weight: input.weight,
        dimensions: input.dimensions,
        urgency: input.urgency,
        comment: input.comment,
        service_type: input.serviceType,
        direction: input.direction,
        user_id: user?.id ?? null,
      },
      select: { id: true },
    });

    try {
      await createNewCargoRequestNotifications({
        actorId: user?.id ?? null,
        itemName: input.itemName,
        fromLocation: input.fromLocation,
        toLocation: input.toLocation,
        serviceType: input.serviceType,
        direction: input.direction,
      });
    } catch {
      // Request is already saved; notification failure must not fail the response.
    }

    return jsonData({ request: cargoRequest }, 201);
  });
}
