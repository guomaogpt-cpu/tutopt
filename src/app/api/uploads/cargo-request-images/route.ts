import { getCurrentUser } from "@/features/auth/lib/session";
import { saveCargoRequestImageFile } from "@/features/cargo/lib/save-cargo-request-upload";
import { isUploadFileLike } from "@/features/listings/lib/upload-file-like";
import { getClientIpFromRequest } from "@/lib/security/client-ip";
import { assertCargoRequestUploadRateLimit } from "@/lib/security/rate-limit";
import { jsonData, withApiHandler } from "@/shared/lib/api-route";
import { ValidationError } from "@/shared/lib/errors";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await getCurrentUser();
    const ip = getClientIpFromRequest(request);

    assertCargoRequestUploadRateLimit(ip, user?.id ?? null);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!isUploadFileLike(file)) {
      throw new ValidationError("File is required");
    }

    try {
      const saved = await saveCargoRequestImageFile(file);
      return jsonData(saved, 201);
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  });
}
