import { requireAuth } from "@/features/auth/lib/session";
import {
  generateListingDescription,
  generateListingDescriptionSchema,
  isOpenAiConfigured,
} from "@/lib/ai/generate-listing-description";
import { assertListingDescriptionAiRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { AppError, ValidationError } from "@/shared/lib/errors";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();

    if (!isOpenAiConfigured()) {
      throw new AppError(
        "AI-генератор пока не подключён.",
        "INTERNAL_ERROR",
        503,
      );
    }

    assertListingDescriptionAiRateLimit(user.id);

    const input = await parseJsonBody(request, generateListingDescriptionSchema);

    const hasEnoughContext =
      Boolean(input.title.trim()) &&
      (Boolean(input.category?.trim()) || Boolean(input.characteristics?.trim()));

    if (!hasEnoughContext) {
      throw new ValidationError(
        "Укажите название и категорию или характеристики, чтобы сгенерировать описание.",
      );
    }

    try {
      const result = await generateListingDescription(input);
      return jsonData(result);
    } catch (error) {
      if (error instanceof AppError || error instanceof ValidationError) {
        throw error;
      }
      throw new AppError(
        "Не удалось сгенерировать описание. Попробуйте позже или напишите вручную.",
        "INTERNAL_ERROR",
        502,
      );
    }
  });
}
