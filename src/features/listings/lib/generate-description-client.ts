import type { GenerateListingDescriptionInput } from "@/lib/ai/generate-listing-description";

export class GenerateDescriptionRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GenerateDescriptionRequestError";
    this.status = status;
  }
}

export async function generateListingDescriptionRequest(
  input: GenerateListingDescriptionInput,
): Promise<string> {
  const response = await fetch("/api/listings/generate-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = (await response.json()) as {
    data?: { description?: string };
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new GenerateDescriptionRequestError(
      body.error?.message ?? "Не удалось сгенерировать описание",
      response.status,
    );
  }

  const description = body.data?.description?.trim();
  if (!description) {
    throw new GenerateDescriptionRequestError(
      "Пустой ответ AI-генератора",
      502,
    );
  }

  return description;
}
