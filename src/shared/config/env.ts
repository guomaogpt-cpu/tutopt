import { z } from "zod";

const logLevelSchema = z.enum(["debug", "info", "warn", "error"]);

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: logLevelSchema.default("info"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type Env = ServerEnv & ClientEnv;

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("; ");
}

function parseServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(`Invalid server environment variables: ${formatZodError(result.error)}`);
  }

  return result.data;
}

function parseClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!result.success) {
    throw new Error(`Invalid client environment variables: ${formatZodError(result.error)}`);
  }

  return result.data;
}

let cachedEnv: Env | null = null;

/** Validated environment variables. Call from server-side code only. */
export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = {
    ...parseServerEnv(),
    ...parseClientEnv(),
  };

  return cachedEnv;
}

/** Reset cached env — for tests only. */
export function resetEnvCache(): void {
  cachedEnv = null;
}

export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    return getEnv()[prop as keyof Env];
  },
});
