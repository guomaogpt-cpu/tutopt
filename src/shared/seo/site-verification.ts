import type { Metadata } from "next";

function readVerificationEnv(
  name: "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION" | "NEXT_PUBLIC_YANDEX_VERIFICATION",
): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

/** Search engine ownership verification meta tags (only when env is set). */
export function getSiteVerificationMetadata(): Pick<Metadata, "verification"> {
  const google = readVerificationEnv("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION");
  const yandex = readVerificationEnv("NEXT_PUBLIC_YANDEX_VERIFICATION");

  if (!google && !yandex) {
    return {};
  }

  return {
    verification: {
      ...(google ? { google } : {}),
      ...(yandex ? { yandex } : {}),
    },
  };
}
