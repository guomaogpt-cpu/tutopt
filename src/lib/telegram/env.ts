/** Optional Telegram env helpers — never throw if unset; never log secrets. */

export function getTelegramBotToken(): string | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  return token && token.length > 0 ? token : null;
}

export function getTelegramBotUsername(): string | null {
  const raw = process.env.TELEGRAM_BOT_USERNAME?.trim();
  if (!raw) {
    return null;
  }
  return raw.replace(/^@+/, "");
}

export function getTelegramWebhookSecret(): string | null {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  return secret && secret.length > 0 ? secret : null;
}

export function isTelegramBotConfigured(): boolean {
  return getTelegramBotToken() != null;
}

export function buildTelegramBotStartLink(token: string): string | null {
  const username = getTelegramBotUsername();
  if (!username) {
    return null;
  }
  return `https://t.me/${username}?start=${encodeURIComponent(token)}`;
}
