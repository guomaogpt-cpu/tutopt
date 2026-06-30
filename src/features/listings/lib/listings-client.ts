import type { CreateListingInput } from "@/features/listings/validators/listing.validators";

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

type CreateListingSuccessBody = {
  data: {
    listing: {
      id: string;
    };
  };
};

export type ListingFormErrors = {
  form: string[];
  fields: Record<string, string>;
};

export class ListingRequestError extends Error {
  readonly formErrors: ListingFormErrors;

  constructor(message: string, formErrors: ListingFormErrors) {
    super(message);
    this.name = "ListingRequestError";
    this.formErrors = formErrors;
  }
}

function mapApiErrors(body: ApiErrorBody): ListingFormErrors {
  const form: string[] = [];
  const fields: Record<string, string> = {};

  if (body.error.message) {
    form.push(body.error.message);
  }

  const details = body.error.details;

  if (details?.formErrors) {
    form.push(...details.formErrors);
  }

  if (details?.fieldErrors) {
    for (const [field, messages] of Object.entries(details.fieldErrors)) {
      if (messages[0]) {
        fields[field] = messages[0];
      }
    }
  }

  return { form: [...new Set(form)], fields };
}

export async function createListingRequest(
  input: CreateListingInput,
): Promise<CreateListingSuccessBody["data"]> {
  const response = await fetch("/api/listings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = (await response.json()) as CreateListingSuccessBody | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new ListingRequestError(errors.form[0] ?? "Request failed", errors);
  }

  return (body as CreateListingSuccessBody).data;
}

export function getListingFieldError(
  errors: ListingFormErrors,
  field: string,
): string | undefined {
  return errors.fields[field];
}
