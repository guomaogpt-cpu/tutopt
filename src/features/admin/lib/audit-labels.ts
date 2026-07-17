export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "listing.approve": "Одобрение объявления",
  "listing.reject": "Отклонение объявления",
  "user.block": "Блокировка пользователя",
  "user.unblock": "Разблокировка пользователя",
  "user.restrict_listings": "Ограничение объявлений",
  "user.unrestrict_listings": "Снятие ограничения объявлений",
  "user.restrict_leads": "Ограничение заявок",
  "user.unrestrict_leads": "Снятие ограничения заявок",
  "user.role_change": "Изменение роли",
  "report.review": "Жалоба рассмотрена",
  "report.dismiss": "Жалоба отклонена",
  // legacy action recorded before Phase 20 unified naming
  USER_ROLE_CHANGED: "Изменение роли",
};

export const AUDIT_TARGET_TYPE_LABELS: Record<string, string> = {
  listing: "Объявление",
  user: "Пользователь",
  report: "Жалоба",
  // legacy entity_type
  User: "Пользователь",
};

export function getAuditActionLabel(action: string): string {
  return AUDIT_ACTION_LABELS[action] ?? action;
}

export function getAuditTargetTypeLabel(targetType: string): string {
  return AUDIT_TARGET_TYPE_LABELS[targetType] ?? targetType;
}
