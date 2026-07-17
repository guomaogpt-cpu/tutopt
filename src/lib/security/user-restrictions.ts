export type UserRestrictionSource = {
  is_blocked?: boolean | null;
  blocked_at?: Date | string | null;
  listing_restricted_at?: Date | string | null;
  lead_restricted_at?: Date | string | null;
};

function hasTimestamp(value: Date | string | null | undefined): boolean {
  if (!value) {
    return false;
  }
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

export function isUserBlocked(user: UserRestrictionSource): boolean {
  return Boolean(user.is_blocked) || hasTimestamp(user.blocked_at);
}

export function canUserCreateListings(user: UserRestrictionSource): boolean {
  if (isUserBlocked(user)) {
    return false;
  }
  return !hasTimestamp(user.listing_restricted_at);
}

export function canUserSendLeads(user: UserRestrictionSource): boolean {
  if (isUserBlocked(user)) {
    return false;
  }
  return !hasTimestamp(user.lead_restricted_at);
}

export function getUserRestrictionLabels(user: UserRestrictionSource): string[] {
  const labels: string[] = [];

  if (isUserBlocked(user)) {
    labels.push("Заблокирован");
    return labels;
  }

  if (hasTimestamp(user.listing_restricted_at)) {
    labels.push("Ограничено создание объявлений");
  }

  if (hasTimestamp(user.lead_restricted_at)) {
    labels.push("Ограничены заявки");
  }

  if (labels.length === 0) {
    labels.push("Активен");
  }

  return labels;
}

export function getCreateListingRestrictionMessage(user: UserRestrictionSource): string | null {
  if (isUserBlocked(user)) {
    return "Аккаунт заблокирован. Создание объявлений недоступно.";
  }
  if (hasTimestamp(user.listing_restricted_at)) {
    return "Создание объявлений временно ограничено.";
  }
  return null;
}

export function getEditListingRestrictionMessage(user: UserRestrictionSource): string | null {
  if (isUserBlocked(user)) {
    return "Аккаунт заблокирован. Редактирование объявлений недоступно.";
  }
  if (hasTimestamp(user.listing_restricted_at)) {
    return "Редактирование объявлений временно ограничено.";
  }
  return null;
}

export function getLeadRestrictionMessage(user: UserRestrictionSource): string | null {
  if (isUserBlocked(user)) {
    return "Аккаунт заблокирован. Отправка заявок недоступна.";
  }
  if (hasTimestamp(user.lead_restricted_at)) {
    return "Отправка заявок временно ограничена.";
  }
  return null;
}

export function getAccountRestrictedMessage(): string {
  return "Аккаунт ограничен. Обратитесь в поддержку.";
}
