/** Public support contact — override via NEXT_PUBLIC_SUPPORT_EMAIL. */
export function getSupportEmail(): string {
  return process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "hello@tutopt.kg";
}

export function getSupportMailtoHref(subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  if (body) {
    params.set("body", body);
  }
  return `mailto:${getSupportEmail()}?${params.toString()}`;
}

/** Placeholder until legal entity details are confirmed for store listing. */
export const LEGAL_OPERATOR_PLACEHOLDER =
  "Оператор платформы «ВсеТут» (реквизиты юридического лица уточняются перед публикацией в Google Play)";

export const LEGAL_DRAFT_NOTICE =
  "Черновик документа. Требуется юридическая проверка перед публикацией в Google Play и использованием как финальной политики.";
