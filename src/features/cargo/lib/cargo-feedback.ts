/**
 * Public feedback link for closed launch.
 * Prefer NEXT_PUBLIC_FEEDBACK_URL (https WhatsApp/Telegram/form).
 * Else mailto via NEXT_PUBLIC_SUPPORT_EMAIL or hello@tutopt.kg.
 */
export function getCargoFeedbackHref(): string {
  const custom = process.env.NEXT_PUBLIC_FEEDBACK_URL?.trim();
  if (custom) {
    return custom;
  }

  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "hello@tutopt.kg";
  const subject = encodeURIComponent("Карго: сообщение о проблеме");
  const body = encodeURIComponent(
    "Страница:\nЧто хотел сделать:\nЧто произошло:\n",
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}
