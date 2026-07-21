import { existsSync } from "node:fs";
import path from "node:path";

/** Server-only: true when the paper banner asset exists under public/. */
export function isHomepagePaperBannerAvailable(): boolean {
  return existsSync(
    path.join(process.cwd(), "public/images/homepage-paper-banner.png"),
  );
}
