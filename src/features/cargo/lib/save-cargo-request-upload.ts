import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { buildCargoRequestImagePublicUrl } from "@/features/cargo/lib/cargo-request-image-url";
import type { UploadFileLike } from "@/features/listings/lib/upload-file-like";
import {
  detectListingImageMime,
  validateListingImageFile,
} from "@/features/listings/lib/save-upload";
import { getUploadRootDir } from "@/features/listings/lib/upload-paths";

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

function getCargoRequestUploadDir(): string {
  return path.join(getUploadRootDir(), "cargo");
}

export async function saveCargoRequestImageFile(file: UploadFileLike): Promise<{
  url: string;
  filename: string;
}> {
  validateListingImageFile(file);

  const uploadDir = getCargoRequestUploadDir();
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
    url: buildCargoRequestImagePublicUrl(filename),
  };
}
