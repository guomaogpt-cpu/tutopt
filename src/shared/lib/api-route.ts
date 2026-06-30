import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";
import {
  ValidationError,
  getErrorStatusCode,
  normalizeError,
  toErrorResponse,
} from "@/shared/lib/errors";
import { logger } from "@/shared/lib/logger";

export function jsonData<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function jsonMessage(message: string, status = 200): NextResponse {
  return NextResponse.json({ data: { message } }, { status });
}

export function jsonError(error: unknown): NextResponse {
  const appError = normalizeError(error);

  if (appError.statusCode >= 500) {
    logger.error("API error", {
      code: appError.code,
      message: appError.message,
    });
  }

  return NextResponse.json(toErrorResponse(appError), { status: appError.statusCode });
}

export async function parseJsonBody<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ValidationError("Invalid JSON body");
  }

  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError("Validation failed", error.flatten());
    }
    throw error;
  }
}

export async function withApiHandler(handler: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return jsonError(error);
  }
}

export function getStatusCodeFromError(error: unknown): number {
  return getErrorStatusCode(error);
}
