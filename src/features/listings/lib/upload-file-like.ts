/**
 * Server-safe upload shape for multipart FormData entries.
 * Avoid referencing browser `File` in Node/Railway runtimes.
 */
export type UploadFileLike = Blob & {
  name?: string;
};

export function isUploadFileLike(value: unknown): value is UploadFileLike {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Blob).arrayBuffer === "function" &&
    typeof (value as Blob).size === "number" &&
    typeof (value as Blob).type === "string"
  );
}

export function getUploadOriginalName(file: UploadFileLike): string {
  if (typeof file.name === "string" && file.name.trim().length > 0) {
    return file.name.trim();
  }
  return "upload";
}
