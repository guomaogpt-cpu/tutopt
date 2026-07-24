export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export type ErrorResponse = {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode = "INTERNAL_ERROR",
    statusCode = 500,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "CONFLICT", 409, details);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Слишком много запросов. Попробуйте позже.") {
    super(message, "RATE_LIMITED", 429);
    this.name = "RateLimitError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  // Never expose raw Error/Prisma messages to clients.
  return new AppError("Произошла ошибка. Попробуйте позже.", "INTERNAL_ERROR", 500);
}

export function toErrorResponse(error: unknown): ErrorResponse {
  const appError = normalizeError(error);

  return {
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details !== undefined ? { details: appError.details } : {}),
    },
  };
}

export function getErrorStatusCode(error: unknown): number {
  return normalizeError(error).statusCode;
}
