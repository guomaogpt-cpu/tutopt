/**
 * Serialize JSON-LD for embedding in <script type="application/ld+json">.
 * Escapes `<` so user-controlled strings cannot break out of the script tag.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
