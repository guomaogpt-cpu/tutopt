const ALLOWED_PREFIXES = [
  "/notifications",
  "/account",
  "/listings",
  "/cargo",
  "/support",
  "/privacy",
  "/terms",
  "/delete-account",
  "/favorites",
  "/market",
  "/services",
  "/opt",
] as const;

const DEFAULT_PUSH_PATH = "/notifications";

/** Validates and normalizes a relative in-app path for push deep links. */
export function sanitizePushPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") {
    return DEFAULT_PUSH_PATH;
  }

  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return DEFAULT_PUSH_PATH;
  }

  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return DEFAULT_PUSH_PATH;
  }

  const pathOnly = trimmed.split("?")[0]?.split("#")[0] ?? trimmed;
  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => pathOnly === prefix || pathOnly.startsWith(`${prefix}/`),
  );

  return allowed ? trimmed : DEFAULT_PUSH_PATH;
}
