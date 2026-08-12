import type { FormEvent } from "react";

/** Read search text from the submitted form (Android WebView-safe). */
export function readSubmittedSearchQuery(
  form: HTMLFormElement,
  fallback: string,
): string {
  const input = form.querySelector<HTMLInputElement>("[data-search-input]");
  const raw = input?.value ?? fallback;
  return raw.trim();
}

export function handleSearchFormSubmit(
  event: FormEvent<HTMLFormElement>,
  fallback: string,
  onQuery: (trimmedQuery: string) => void,
): void {
  event.preventDefault();
  const trimmed = readSubmittedSearchQuery(event.currentTarget, fallback);
  onQuery(trimmed);
}

export const searchInputMobileProps = {
  type: "text" as const,
  inputMode: "search" as const,
  enterKeyHint: "search" as const,
  autoComplete: "off" as const,
  "data-search-input": true,
};
