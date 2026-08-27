import { execSync } from "node:child_process";

const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);

if (nodeMajor < 20) {
  console.log(
    `[playwright] Skipping chromium install (Node 20+ required, current ${process.versions.node})`,
  );
  process.exit(0);
}

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
