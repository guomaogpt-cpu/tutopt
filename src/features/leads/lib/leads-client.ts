import type { CreateLeadInput } from "@/features/leads/validators/lead.validators";

type CreateLeadResponse = {
  lead: {
    id: string;
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

export type LeadFormErrors = {
  form: string[];
  fields: Record<string, string>;
};

export class LeadRequestError extends Error {
  readonly formErrors: LeadFormErrors;

  constructor(message: string, formErrors: LeadFormErrors) {
    super(message);
    this.name = "LeadRequestError";
    this.formErrors = formErrors;
  }
}

function mapApiErrors(body: ApiErrorBody): LeadFormErrors {
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

export async function createLeadRequest(
  listingId: string,
  input: CreateLeadInput,
): Promise<CreateLeadResponse> {
  const response = await fetch(`/api/listings/${listingId}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = (await response.json()) as ApiSuccessBody<CreateLeadResponse> | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new LeadRequestError(errors.form[0] ?? "Не удалось отправить заявку", errors);
  }

  return (body as ApiSuccessBody<CreateLeadResponse>).data;
}
