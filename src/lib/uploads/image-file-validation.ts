const ALLOWED_IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);

const EXTENSION_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Android WebView often returns empty or non-standard MIME from gallery picks. */
export function normalizeClientImageMime(type: string, filename?: string): string | null {
  const trimmed = type.trim().toLowerCase();
  if (trimmed === "image/jpg") {
    return "image/jpeg";
  }
  if (ALLOWED_IMAGE_MIMES.has(trimmed)) {
    return trimmed;
  }

  if (filename) {
    const dotIndex = filename.lastIndexOf(".");
    if (dotIndex >= 0) {
      const extension = filename.slice(dotIndex).toLowerCase();
      return EXTENSION_TO_MIME[extension] ?? null;
    }
  }

  return trimmed.length > 0 ? trimmed : null;
}

export function isAllowedImagePickerFile(file: File): boolean {
  const normalized = normalizeClientImageMime(file.type, file.name);
  return normalized !== null && ALLOWED_IMAGE_MIMES.has(normalized);
}

/** Broad accept value so Android gallery picker opens reliably. */
export const IMAGE_PICKER_ACCEPT = "image/jpeg,image/png,image/webp,image/*";
