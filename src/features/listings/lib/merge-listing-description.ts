/** Merge optional characteristics into description without duplicating. */
export function mergeListingDescriptionParts(
  description: string,
  characteristics: string,
): string {
  const desc = description.trim();
  const chars = characteristics.trim();
  if (!chars) {
    return desc;
  }
  if (!desc) {
    return chars;
  }
  if (desc.includes(chars)) {
    return desc;
  }
  return `${desc}\n\n${chars}`;
}
