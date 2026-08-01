import type { UpsertCompanyProfileInput } from "@/features/company/validators/company-profile.validators";
import type { CompanyProfileSummary } from "@/features/company/lib/company-profile";

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

export type CompanyFormErrors = {
  form: string[];
  fields: Record<string, string>;
};

export class CompanyRequestError extends Error {
  readonly formErrors: CompanyFormErrors;

  constructor(message: string, formErrors: CompanyFormErrors) {
    super(message);
    this.name = "CompanyRequestError";
    this.formErrors = formErrors;
  }
}

function mapApiErrors(body: ApiErrorBody): CompanyFormErrors {
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

export async function upsertCompanyProfileRequest(
  input: UpsertCompanyProfileInput,
): Promise<CompanyProfileSummary> {
  const response = await fetch("/api/account/company", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = (await response.json()) as
    | { data: { company: CompanyProfileSummary } }
    | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new CompanyRequestError(errors.form[0] ?? "Request failed", errors);
  }

  return (body as { data: { company: CompanyProfileSummary } }).data.company;
}

export async function submitCompanyVerificationRequest(): Promise<void> {
  const response = await fetch("/api/account/company/verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const body = (await response.json()) as ApiErrorBody | { data: unknown };

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new CompanyRequestError(errors.form[0] ?? "Request failed", errors);
  }
}
