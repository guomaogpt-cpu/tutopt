import type { LoginInput, RegisterInput } from "@/features/auth/validators/auth.validators";

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

type AuthSuccessBody = {
  data: {
    user: {
      id: string;
      name: string;
      email: string | null;
      role: string;
    };
  };
};

export type AuthFormErrors = {
  form: string[];
  fields: Record<string, string>;
};

export class AuthRequestError extends Error {
  readonly formErrors: AuthFormErrors;

  constructor(message: string, formErrors: AuthFormErrors) {
    super(message);
    this.name = "AuthRequestError";
    this.formErrors = formErrors;
  }
}

export function parseIdentity(identity: string): Pick<LoginInput, "email" | "phone"> {
  const trimmed = identity.trim();

  if (trimmed.includes("@")) {
    return { email: trimmed };
  }

  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 9) {
    return { phone: `+996${digits}` };
  }

  if (digits.length === 12 && digits.startsWith("996")) {
    return { phone: `+${digits}` };
  }

  if (trimmed.startsWith("+996") && trimmed.length === 13) {
    return { phone: trimmed };
  }

  return { phone: trimmed.startsWith("+") ? trimmed : `+${digits}` };
}

function mapApiErrors(body: ApiErrorBody): AuthFormErrors {
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

async function parseAuthResponse(response: Response): Promise<AuthSuccessBody["data"]> {
  const body = (await response.json()) as AuthSuccessBody | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new AuthRequestError(errors.form[0] ?? "Request failed", errors);
  }

  return (body as AuthSuccessBody).data;
}

export async function loginRequest(
  identity: string,
  password: string,
  rememberMe = false,
): Promise<AuthSuccessBody["data"]> {
  const payload: LoginInput = {
    ...parseIdentity(identity),
    password,
    remember_me: rememberMe,
  };

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseAuthResponse(response);
}

export async function registerRequest(input: RegisterInput): Promise<AuthSuccessBody["data"]> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return parseAuthResponse(response);
}

export async function logoutRequest(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

type ForgotPasswordResponse = {
  message: string;
};

type ResetPasswordResponse = {
  message: string;
};

type MessageSuccessBody = {
  data: {
    message: string;
  };
};

async function parseMessageResponse(response: Response): Promise<string> {
  const body = (await response.json()) as MessageSuccessBody | ApiErrorBody;

  if (!response.ok) {
    const errors = mapApiErrors(body as ApiErrorBody);
    throw new AuthRequestError(errors.form[0] ?? "Не удалось выполнить запрос", errors);
  }

  return (body as MessageSuccessBody).data.message;
}

export async function forgotPasswordRequest(email: string): Promise<ForgotPasswordResponse> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const message = await parseMessageResponse(response);
  return { message };
}

export async function resetPasswordRequest(
  token: string,
  password: string,
): Promise<ResetPasswordResponse> {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });

  const message = await parseMessageResponse(response);
  return { message };
}

export function getFieldError(
  errors: AuthFormErrors,
  field: string,
  fallback?: string,
): string | undefined {
  return errors.fields[field] ?? fallback;
}
