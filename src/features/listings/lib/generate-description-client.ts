import type { ListingVertical } from "@prisma/client";

export type GenerateListingDescriptionClientInput = {
  vertical: ListingVertical;
  category?: string | null;
  title: string;
  price?: string | number | null;
  currency?: string | null;
  city?: string | null;
  characteristics?: string | null;
  currentDescription?: string | null;
  unit?: string | null;
  moq?: string | number | null;
  condition?: string | null;
};

export class GenerateDescriptionRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GenerateDescriptionRequestError";
    this.status = status;
  }
}

export async function generateListingDescriptionRequest(
  input: GenerateListingDescriptionClientInput,
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
