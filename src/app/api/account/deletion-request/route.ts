import { requireAuth } from "@/features/auth/lib/session";
import {
  AccountDeletionDuplicateError,
  submitAccountDeletionRequest,
} from "@/features/account/lib/account-deletion-request";
import { accountDeletionRequestSchema } from "@/features/account/validators/account-deletion.validators";
import { assertAccountDeletionRequestRateLimit } from "@/lib/security/rate-limit";
import { jsonData, parseJsonBody, withApiHandler } from "@/shared/lib/api-route";
import { ConflictError } from "@/shared/lib/errors";

export async function POST(request: Request) {
  return withApiHandler(async () => {
    const user = await requireAuth();
    assertAccountDeletionRequestRateLimit(user.id);

    const input = await parseJsonBody(request, accountDeletionRequestSchema);

    try {
      const result = await submitAccountDeletionRequest(user.id, user.role, input);
      return jsonData(
        {
          requestId: result.requestId,
          status: "PENDING" as const,
          message:
            "Запрос на удаление аккаунта принят. Мы обработаем его вручную в течение нескольких рабочих дней.",
        },
        201,
      );
    } catch (error) {
      if (error instanceof AccountDeletionDuplicateError) {
        throw new ConflictError(error.message);
      }
      throw error;
    }
  });
}
