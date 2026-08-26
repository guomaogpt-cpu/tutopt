export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function extractMetaContent(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeHtmlEntities(match[1].trim());
    }
  }

  return null;
}

export function extractTitleTag(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtmlEntities(match[1].trim()) : null;
}

export function extractJsonLdObjects(html: string): unknown[] {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const objects: unknown[] = [];

  for (const script of scripts) {
    const raw = script[1]?.trim();
    if (!raw) {
      continue;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        objects.push(...parsed);
      } else {
        objects.push(parsed);
      }
    } catch {
      // ignore malformed JSON-LD
    }
  }

  return objects;
}

export function toAbsoluteUrl(value: string, baseUrl: string): string | null {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

export function uniqueUrls(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    result.push(trimmed);
  }

  return result.slice(0, 10);
}

export function stripHtmlTags(value: string): string {
  return decodeHtmlEntities(value.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

export function extractFirstMatch(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern);
  return match?.[1]?.trim() ?? null;
}
