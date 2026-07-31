/** Public web URL saved in DB for a cargo request image filename. */
export function buildCargoRequestImagePublicUrl(filename: string): string {
  return `/api/uploads/cargo/${filename}`;
}
