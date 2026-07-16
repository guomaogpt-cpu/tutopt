import type { ListingVertical, ReportReason } from "@prisma/client";

type CreateReportPayload = {
  listingId?: string | null;
  sellerId?: string | null;
  reason: ReportReason;
  message?: string | null;
};

type CreateReportResponse = {
  report: {
    id: string;
    reason: ReportReason;
    status: string;
    created_at: string;
  };
  meta: {
    targetType: "listing" | "seller";
    vertical: ListingVertical | null;
  };
};

type ApiSuccessBody<T> = {
  data: T;
};

type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: {
      formErrors?: string[];
      fieldErrors?: Record<string, string[]>;
    };
  };
};

export class ReportRequestError extends Error {
  readonly formErrors: string[];
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, formErrors: string[] = [], fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = "ReportRequestError";
    this.formErrors = formErrors;
    this.fieldErrors = fieldErrors;
  }
}

export async function createReportRequest(
  payload: CreateReportPayload,
): Promise<CreateReportResponse> {
  const response = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as ApiSuccessBody<CreateReportResponse> | ApiErrorBody;

  if (!response.ok) {
    const errorBody = body as ApiErrorBody;
    const fieldErrors: Record<string, string> = {};
    const details = errorBody.error?.details;

    if (details?.fieldErrors) {
      for (const [key, messages] of Object.entries(details.fieldErrors)) {
        if (messages[0]) {
          fieldErrors[key] = messages[0];
        }
      }
    }

    throw new ReportRequestError(
      errorBody.error?.message ?? "Не удалось отправить жалобу",
      details?.formErrors ?? [],
      fieldErrors,
    );
  }

  return (body as ApiSuccessBody<CreateReportResponse>).data;
}

export async function updateReportStatusRequest(
  reportId: string,
  action: "resolve" | "dismiss",
): Promise<void> {
  const response = await fetch(`/api/admin/reports/${reportId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const body = (await response.json()) as ApiErrorBody;
    throw new Error(body.error?.message ?? "Не удалось обновить жалобу");
  }
}
