import type { ImportSourcePlatform } from "@/features/import-drafts/types/import-draft";

export function detectImportPlatform(url: URL, override?: ImportSourcePlatform | null): ImportSourcePlatform {
  if (override) {
    return override;
  }

  const host = url.hostname.toLowerCase();

  if (host.includes("lalafo.")) {
    return "LALAFO";
  }

  if (host.includes("instagram.com") || host === "instagr.am") {
    return "INSTAGRAM";
  }

  return "WEBSITE";
}
