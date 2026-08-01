import {
  CARGO_DIRECTION_LABEL_KEY,
  CARGO_SERVICE_TYPE_LABEL_KEY,
  isCargoDirectionId,
  isCargoServiceTypeId,
} from "@/features/cargo/lib/cargo-subscription-options";
import { findCargoTelegramRecipients } from "@/features/cargo/lib/cargo-subscription-data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sendTelegramMessage } from "@/lib/telegram/sendTelegramMessage";
import { getAbsoluteUrl } from "@/shared/seo/absolute-url";

const ruDict = getDictionary("ru");

export type CargoTelegramRequestPayload = {
  actorId: string | null;
  itemName: string;
  fromLocation: string;
  toLocation: string;
  serviceType: string | null;
  direction: string | null;
  weight: string | null;
  dimensions: string | null;
  quantity: string | null;
};

function labelOrDash(value: string | null, kind: "service" | "direction"): string {
  if (!value) {
    return "-";
  }
  if (kind === "service" && isCargoServiceTypeId(value)) {
    return ruDict[CARGO_SERVICE_TYPE_LABEL_KEY[value]];
  }
  if (kind === "direction" && isCargoDirectionId(value)) {
    return ruDict[CARGO_DIRECTION_LABEL_KEY[value]];
  }
  return value;
}

export function buildCargoRequestTelegramText(input: CargoTelegramRequestPayload): string {
  const boardUrl = getAbsoluteUrl("/seller/cargo-requests");
  const lines = [
    ruDict["cargo.telegram.message.newRequestTitle"],
    "",
    `Товар: ${input.itemName}`,
    `Маршрут: ${input.fromLocation} → ${input.toLocation}`,
    `Тип услуги: ${labelOrDash(input.serviceType, "service")}`,
    `Направление: ${labelOrDash(input.direction, "direction")}`,
    `Вес: ${input.weight?.trim() || "-"}`,
    `Габариты: ${input.dimensions?.trim() || "-"}`,
    `Количество мест: ${input.quantity?.trim() || "-"}`,
    "",
    `${ruDict["cargo.telegram.message.openRequests"]}`,
    boardUrl,
  ];

  return lines.join("\n");
}

/**
 * Sends Telegram alerts to matching cargo sellers. Safe: never throws to callers
 * that wrap it; individual send failures are ignored.
 */
export async function sendCargoRequestTelegramNotifications(
  input: CargoTelegramRequestPayload,
): Promise<void> {
  const recipients = await findCargoTelegramRecipients({
    serviceType: input.serviceType,
    direction: input.direction,
    fromLocation: input.fromLocation,
    toLocation: input.toLocation,
  });

  const text = buildCargoRequestTelegramText(input);
  const seen = new Set<string>();

  for (const recipient of recipients) {
    if (input.actorId && recipient.userId === input.actorId) {
      continue;
    }
    if (seen.has(recipient.userId) || seen.has(recipient.chatId)) {
      continue;
    }
    seen.add(recipient.userId);
    seen.add(recipient.chatId);

    await sendTelegramMessage({
      chatId: recipient.chatId,
      text,
    });
  }
}

export function buildCargoTelegramTestText(): string {
  return ruDict["cargo.telegram.testMessage"];
}
