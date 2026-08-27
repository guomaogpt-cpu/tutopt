import { execSync } from "node:child_process";

if (process.env.IMPORT_RENDER_FALLBACK_ENABLED !== "true") {
  console.log(
    "[playwright] Skipping chromium install (set IMPORT_RENDER_FALLBACK_ENABLED=true to install)",
  );
  process.exit(0);
}

try {
  execSync("npx playwright-core install chromium", { stdio: "inherit" });
} catch (error) {
  console.warn(
    "[playwright] Chromium install failed — render fallback will be unavailable at runtime.",
    error instanceof Error ? error.message : error,
  );
}
