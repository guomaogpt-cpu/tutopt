import path from "path";
import { getEnv } from "@/shared/config/env";
import {
  buildListingImagePublicUrl,
  normalizeListingImageUrl,
  resolveListingImageUrl,
} from "@/features/listings/lib/listing-image-url";

export {
  buildListingImagePublicUrl,
  normalizeListingImageUrl,
  resolveListingImageUrl,
};

/** Absolute directory root for uploads (Volume or public/). */
export function getUploadRootDir(): string {
  const configured = getEnv().UPLOAD_DIR?.trim();
  if (configured) {
    return path.resolve(configured);
  }
  return path.join(process.cwd(), "public", "uploads");
}

/** Absolute directory for listing images. */
export function getListingUploadDir(): string {
  return path.join(getUploadRootDir(), "listings");
}

const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export function getImageContentType(filename: string): string | null {
  const ext = path.extname(filename).toLowerCase();
  return CONTENT_TYPES[ext] ?? null;
}

export function isAllowedUploadExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_UPLOAD_EXTENSIONS.has(ext);
}

/**
 * Resolve a safe absolute file path under upload root.
 * Rejects traversal and absolute escapes.
 */
export function resolveSafeUploadPath(relativeParts: string[]): string | null {
  if (relativeParts.length === 0) {
    return null;
  }

  for (const part of relativeParts) {
    if (!part || part === "." || part === ".." || part.includes("\\") || part.includes("\0")) {
      return null;
    }
  }

  const filename = relativeParts[relativeParts.length - 1];
  if (!filename || !isAllowedUploadExtension(filename)) {
    return null;
  }

  const root = getUploadRootDir();
  const candidate = path.resolve(root, ...relativeParts);
  const relative = path.relative(root, candidate);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return candidate;
}
