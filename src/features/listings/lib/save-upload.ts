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

export async function saveListingImageFile(file: UploadFileLike): Promise<{
  url: string;
  filename: string;
}> {
  validateListingImageFile(file);

  const uploadDir = getListingUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const extension = ALLOWED_MIME_TYPES.get(file.type) ?? ".jpg";
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${extension}`;
  const absolutePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, buffer);

  return {
    filename,
    url: buildListingImagePublicUrl(filename),
  };
}
