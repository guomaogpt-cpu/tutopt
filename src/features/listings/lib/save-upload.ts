import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import type { UploadFileLike } from "@/features/listings/lib/upload-file-like";
import { buildListingImagePublicUrl } from "@/features/listings/lib/listing-image-url";
import { getListingUploadDir } from "@/features/listings/lib/upload-paths";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export function validateListingImageFile(file: UploadFileLike): void {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG and WEBP images are allowed");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Image size must be 5 MB or less");
  }
}

/** Detect image type from magic bytes (do not trust client MIME alone). */
export function detectListingImageMime(buffer: Buffer): string | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export async function saveListingImageFile(file: UploadFileLike): Promise<{
  url: string;
  filename: string;
}> {
  validateListingImageFile(file);

  const uploadDir = getListingUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectListingImageMime(buffer);

  if (!detectedMime || !ALLOWED_MIME_TYPES.has(detectedMime)) {
    throw new Error("Only JPG, PNG and WEBP images are allowed");
  }

  if (detectedMime !== file.type) {
    throw new Error("File content does not match the declared image type");
  }

  const extension = ALLOWED_MIME_TYPES.get(detectedMime) ?? ".jpg";
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${extension}`;
  const absolutePath = path.join(uploadDir, filename);

  await writeFile(absolutePath, buffer);

  return {
    filename,
    url: buildListingImagePublicUrl(filename),
  };
}
