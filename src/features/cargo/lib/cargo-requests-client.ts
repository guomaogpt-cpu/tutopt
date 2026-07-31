import type { CreateCargoRequestInput } from "@/features/cargo/validators/cargo-request.validators";
import type { CreateCargoResponseInput } from "@/features/cargo/validators/cargo-response.validators";
import type { CargoRequestStatus } from "@prisma/client";

type CreateCargoRequestResponse = {
  request: {
    id: string;
  };
};

type CreateCargoResponseResult = {
  response: {
    id: string;
  };
};

type UpdateCargoRequestStatusResult = {
  request: {
    id: string;
    status: CargoRequestStatus;
  };
};

type UploadCargoImageResponse = {
  url: string;
  filename: string;
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

export type CargoRequestFormErrors = {
  form: string[];
  fields: Record<string, string>;
  code?: string;
  messageCode?: string;
};

export class CargoRequestError extends Error {
  readonly formErrors: CargoRequestFormErrors;

  constructor(message: string, formErrors: CargoRequestFormErrors) {
    super(message);
    this.name = "CargoRequestError";
    this.formErrors = formErrors;
  }
}

function mapApiErrors(body: ApiErrorBody): CargoRequestFormErrors {
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

  return {
    form: [...new Set(form)],
    fields,
    code: body.error.code,
    messageCode: body.error.message,
  };
}

export async function createCargoRequest(
  input: CreateCargoRequestInput,
): Promise<CreateCargoRequestResponse> {
  const response = await fetch("/api/cargo/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = (await response.json()) as
    | ApiSuccessBody<CreateCargoRequestResponse>
    | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new CargoRequestError(errors.form[0] ?? "CARGO_GENERIC_ERROR", errors);
  }

  return (body as ApiSuccessBody<CreateCargoRequestResponse>).data;
}

export async function uploadCargoRequestImage(
  file: File,
): Promise<UploadCargoImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads/cargo-request-images", {
    method: "POST",
    body: formData,
  });

  const body = (await response.json()) as
    | ApiSuccessBody<UploadCargoImageResponse>
    | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new CargoRequestError(errors.form[0] ?? "CARGO_UPLOAD_ERROR", errors);
  }

  return (body as ApiSuccessBody<UploadCargoImageResponse>).data;
}

export async function createCargoResponse(
  requestId: string,
  input: CreateCargoResponseInput,
): Promise<CreateCargoResponseResult> {
  const response = await fetch(`/api/cargo/requests/${requestId}/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = (await response.json()) as
    | ApiSuccessBody<CreateCargoResponseResult>
    | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new CargoRequestError(errors.form[0] ?? "CARGO_GENERIC_ERROR", errors);
  }

  return (body as ApiSuccessBody<CreateCargoResponseResult>).data;
}

export async function updateAdminCargoRequestStatus(
  requestId: string,
  status: CargoRequestStatus,
): Promise<UpdateCargoRequestStatusResult> {
  const response = await fetch(`/api/admin/cargo-requests/${requestId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const body = (await response.json()) as
    | ApiSuccessBody<UpdateCargoRequestStatusResult>
    | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new CargoRequestError(errors.form[0] ?? "CARGO_GENERIC_ERROR", errors);
  }

  return (body as ApiSuccessBody<UpdateCargoRequestStatusResult>).data;
}
