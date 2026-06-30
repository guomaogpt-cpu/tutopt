import { UserRole } from "@prisma/client";
import { requireAuth } from "@/features/auth/lib/session";
import { saveListingImageFile } from "@/features/listings/lib/save-upload";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { ForbiddenError, ValidationError } from "@/shared/lib/errors";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError("Only sellers can upload listing images");
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ValidationError("File is required");
    }

    try {
      const saved = await saveListingImageFile(file);
      return jsonData(saved, 201);
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  });
}
