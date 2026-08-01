import { NextResponse } from "next/server";
import {
  completeCargoTelegramConnect,
  parseTelegramStartToken,
} from "@/features/cargo/lib/cargo-telegram-connect";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getTelegramWebhookSecret } from "@/lib/telegram/env";
import { sendTelegramMessage } from "@/lib/telegram/sendTelegramMessage";

export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number | string };
    from?: { username?: string };
  };
};

function okResponse(): NextResponse {
  return NextResponse.json({ ok: true });
}

function isAuthorizedWebhook(request: Request): boolean {
  const expected = getTelegramWebhookSecret();
  if (!expected) {
    return true;
  }

  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (headerSecret && headerSecret === expected) {
    return true;
  }

  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  return querySecret === expected;
}

export async function POST(request: Request) {
  try {
    if (!isAuthorizedWebhook(request)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    let update: TelegramUpdate;
    try {
      update = (await request.json()) as TelegramUpdate;
    } catch {
      return okResponse();
    }

    const text = update.message?.text;
    const chatIdRaw = update.message?.chat?.id;
    if (!text || chatIdRaw == null) {
      return okResponse();
    }

    const token = parseTelegramStartToken(text);
    if (!token) {
      return okResponse();
    }

    const chatId = String(chatIdRaw);
    const username = update.message?.from?.username ?? null;
    const result = await completeCargoTelegramConnect({
      token,
      chatId,
      username,
    });

    const ruDict = getDictionary("ru");

    if (result.status === "connected") {
      await sendTelegramMessage({
        chatId,
        text: ruDict["cargo.telegram.webhookConnectedMessage"],
      });
      return okResponse();
    }

    if (result.status === "expired_token") {
      await sendTelegramMessage({
        chatId,
        text: ruDict["cargo.telegram.linkExpired"],
      });
      return okResponse();
    }

    await sendTelegramMessage({
      chatId,
      text: ruDict["cargo.telegram.connectFailed"],
    });
    return okResponse();
  } catch {
    // Always ACK to Telegram to avoid retry storms; never leak internals.
    return okResponse();
  }
}
