/** Site origin from NEXT_PUBLIC_APP_URL with local fallback. */
export function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

/** Build absolute URL for OG/JSON-LD/sitemap. Passes through already-absolute URLs. */
export function getAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = getSiteBaseUrl();
  if (!path || path === "/") {
    return `${base}/`;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
