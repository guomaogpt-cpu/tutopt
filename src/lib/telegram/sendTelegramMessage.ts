import {
  getTelegramBotToken,
  isTelegramBotConfigured,
} from "@/lib/telegram/env";

export type SendTelegramResult =
  | { status: "sent" }
  | { status: "skipped"; reason: "missing_token" | "missing_chat_id" }
  | { status: "failed"; reason: string };

type SendTelegramMessageParams = {
  chatId: string | null | undefined;
  text: string;
  parseMode?: "HTML" | "Markdown" | "MarkdownV2";
};

export { isTelegramBotConfigured };

/**
 * Sends a Telegram Bot API message. Never throws for transport/API failures.
 * Does not log or return the bot token.
 */
export async function sendTelegramMessage(
  params: SendTelegramMessageParams,
): Promise<SendTelegramResult> {
  const token = getTelegramBotToken();
  if (!token) {
    return { status: "skipped", reason: "missing_token" };
  }

  const chatId = params.chatId?.trim() ?? "";
  if (!chatId) {
    return { status: "skipped", reason: "missing_chat_id" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: params.text,
        ...(params.parseMode ? { parse_mode: params.parseMode } : {}),
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { status: "failed", reason: `telegram_http_${response.status}` };
    }

    const body = (await response.json()) as { ok?: boolean };
    if (!body.ok) {
      return { status: "failed", reason: "telegram_api_rejected" };
    }

    return { status: "sent" };
  } catch {
    return { status: "failed", reason: "telegram_network_error" };
  } finally {
    clearTimeout(timer);
  }
}
