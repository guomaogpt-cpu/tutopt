export type ContentCheckIssue = {
  field: "title" | "description" | "message";
  code: string;
  message: string;
};

export type ContentWarning = {
  code: string;
  label: string;
};

const PHONE_PATTERN =
  /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{2,4}[\s-]?\d{2,4}[\s-]?\d{0,4}/;

const LINK_PATTERN =
  /(?:https?:\/\/|www\.|t\.me\/|wa\.me\/|telegram\.me\/|viber:\/\/)/i;

const REPEATED_CHAR_PATTERN = /(.)\1{5,}/u;

export function normalizeText(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

export function normalizeListingTitleForDuplicate(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ");
}

export function detectPhoneInText(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) {
    return false;
  }

  if (!PHONE_PATTERN.test(normalized)) {
    return false;
  }

  const digits = normalized.replace(/\D/g, "");
  return digits.length >= 9;
}

export function detectLinkInText(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) {
    return false;
  }

  return LINK_PATTERN.test(normalized);
}

export function hasRepeatedCharacters(text: string): boolean {
  return REPEATED_CHAR_PATTERN.test(normalizeText(text));
}

export function detectContactInfo(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) {
    return false;
  }

  if (detectPhoneInText(normalized) || detectLinkInText(normalized)) {
    return true;
  }

  if (/@[\w.-]+\.[a-z]{2,}/i.test(normalized)) {
    return true;
  }

  return false;
}

export function detectSpammyText(text: string): boolean {
  const normalized = normalizeText(text);
  if (!normalized) {
    return false;
  }

  if (hasRepeatedCharacters(normalized)) {
    return true;
  }

  if (hasExcessiveCaps(normalized)) {
    return true;
  }

  return countLinks(normalized) >= 3;
}

export function hasExcessiveCaps(text: string): boolean {
  if (text.length <= 20) {
    return false;
  }

  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length === 0) {
    return false;
  }

  const uppercase = letters.filter((char) => char === char.toUpperCase() && char !== char.toLowerCase());
  return uppercase.length / letters.length > 0.7;
}

export function countLinks(text: string): number {
  const matches = text.match(
    /(?:https?:\/\/|www\.|t\.me\/|wa\.me\/|telegram\.me\/|viber:\/\/)/gi,
  );
  return matches?.length ?? 0;
}

export function validateListingContent(input: {
  title: string;
  description: string;
}): ContentCheckIssue[] {
  const issues: ContentCheckIssue[] = [];
  const title = normalizeText(input.title);
  const description = normalizeText(input.description);

  if (detectContactInfo(title)) {
    issues.push({
      field: "title",
      code: "title_contact_info",
      message: "Не указывайте телефон, ссылки или email в заголовке",
    });
  }

  if (hasExcessiveCaps(title)) {
    issues.push({
      field: "title",
      code: "title_excessive_caps",
      message: "Слишком много заглавных букв в заголовке",
    });
  }

  if (detectSpammyText(title)) {
    issues.push({
      field: "title",
      code: "title_spammy",
      message: "Заголовок выглядит подозрительно. Переформулируйте его",
    });
  }

  if (detectSpammyText(description)) {
    issues.push({
      field: "description",
      code: "description_spammy",
      message: "Описание выглядит подозрительно. Уберите повторы, ссылки или CAPS",
    });
  }

  return issues;
}

export function validateLeadContent(input: { message: string }): ContentCheckIssue[] {
  const issues: ContentCheckIssue[] = [];
  const message = normalizeText(input.message);

  if (!message) {
    issues.push({
      field: "message",
      code: "message_empty",
      message: "Введите сообщение",
    });
    return issues;
  }

  if (detectSpammyText(message)) {
    issues.push({
      field: "message",
      code: "message_spammy",
      message: "Сообщение выглядит подозрительно. Переформулируйте его",
    });
  }

  return issues;
}

export function getModerationContentWarnings(input: {
  title: string;
  description?: string | null;
}): ContentWarning[] {
  const warnings: ContentWarning[] = [];
  const title = normalizeText(input.title);
  const description = input.description ? normalizeText(input.description) : "";

  if (detectContactInfo(title)) {
    warnings.push({
      code: "title_contact",
      label: "Контакт в заголовке",
    });
  }

  if (hasExcessiveCaps(title)) {
    warnings.push({
      code: "title_caps",
      label: "Много CAPS в заголовке",
    });
  }

  if (countLinks(description) >= 3) {
    warnings.push({
      code: "description_links",
      label: "Много ссылок в описании",
    });
  }

  if (description && detectSpammyText(description)) {
    warnings.push({
      code: "description_spammy",
      label: "Подозрительное описание",
    });
  }

  return warnings;
}
