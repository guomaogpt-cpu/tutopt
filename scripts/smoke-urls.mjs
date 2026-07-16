const BASE_URL = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const TIMEOUT_MS = 10_000;

const PUBLIC_URLS = [
  "/",
  "/opt",
  "/market",
  "/services",
  "/cargo",
  "/listings",
  "/listings?vertical=OPT",
  "/listings?vertical=MARKET",
  "/listings?vertical=SERVICES",
  "/listings?vertical=CARGO",
  "/sitemap.xml",
  "/robots.txt",
  "/api/health",
  "/login",
  "/register",
  "/listings/new",
  "/listings/new?vertical=OPT",
  "/listings/new?vertical=MARKET",
  "/listings/new?vertical=SERVICES",
  "/listings/new?vertical=CARGO",
  "/admin",
  "/admin/moderation/listings",
];

/** @type {Array<{url: string, status: number | string, ok: boolean, note: string}>} */
const rows = [];

function formatUrl(path) {
  return new URL(path, BASE_URL).toString();
}

function isAllowedStatus(path, status) {
  if (path.startsWith("/admin")) {
    return (status >= 200 && status < 500) || status === 401 || status === 403;
  }
  return status >= 200 && status < 500;
}

async function checkUrl(path) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const url = formatUrl(path);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/json,text/plain,application/xml,*/*",
      },
    });

    const ok = isAllowedStatus(path, response.status);
    rows.push({
      url: path,
      status: response.status,
      ok,
      note: ok ? "OK" : "FAIL",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request error";
    rows.push({
      url: path,
      status: "ERR",
      ok: false,
      note: message,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

console.log(`\\nSmoke base URL: ${BASE_URL}`);
console.log(`Checking ${PUBLIC_URLS.length} URLs...\\n`);

for (const path of PUBLIC_URLS) {
  // eslint-disable-next-line no-await-in-loop
  await checkUrl(path);
}

console.table(rows);

const failed = rows.filter((row) => !row.ok);
if (failed.length > 0) {
  console.error(`\\nSmoke failed: ${failed.length} URL(s) failed.`);
  process.exit(1);
}

console.log("\\nSmoke passed: all URLs responded without server errors.");
