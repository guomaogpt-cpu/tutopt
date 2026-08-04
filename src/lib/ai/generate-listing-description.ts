import { ListingVertical } from "@prisma/client";
import { z } from "zod";

export const GENERATE_DESCRIPTION_TITLE_MAX = 120;
export const GENERATE_DESCRIPTION_CHARS_MAX = 800;
export const GENERATE_DESCRIPTION_CURRENT_MAX = 2000;
export const GENERATE_DESCRIPTION_OUTPUT_MAX = 1200;

/** Cheapest GPT-5.6 text tier. Do not use alias `gpt-5.6` — it routes to Sol. */
export const DEFAULT_LISTING_DESCRIPTION_MODEL = "gpt-5.6-luna";

/** Fallback if Luna is unavailable on the account. */
export const FALLBACK_LISTING_DESCRIPTION_MODEL = "gpt-4o-mini";

const characteristicItemSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(200),
});

export const generateListingDescriptionSchema = z.object({
  vertical: z.nativeEnum(ListingVertical),
  category: z.string().trim().max(150).optional().nullable(),
  title: z.string().trim().min(3).max(GENERATE_DESCRIPTION_TITLE_MAX),
  price: z.union([z.string(), z.number()]).optional().nullable(),
  currency: z.string().trim().max(3).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  /** Legacy free-text characteristics (still accepted). */
  characteristics: z.string().trim().max(GENERATE_DESCRIPTION_CHARS_MAX).optional().nullable(),
  /** Structured category-based characteristics (preferred). */
  characteristicItems: z.array(characteristicItemSchema).max(30).optional(),
  currentDescription: z
    .string()
    .trim()
    .max(GENERATE_DESCRIPTION_CURRENT_MAX)
    .optional()
    .nullable(),
  unit: z.string().trim().max(40).optional().nullable(),
  moq: z.union([z.string(), z.number()]).optional().nullable(),
  condition: z.string().trim().max(80).optional().nullable(),
});

export type GenerateListingDescriptionInput = z.infer<
  typeof generateListingDescriptionSchema
>;

export type GenerateListingDescriptionResult = {
  description: string;
  source: "openai" | "mock";
  model?: string;
};

const SYSTEM_PROMPT = `Ты помогаешь создать описание объявления для сайта ВсеТут.
Пиши на русском языке.
Не выдумывай характеристики.
Используй только данные пользователя.
Не обещай гарантию, доставку, оригинальность, документы или наличие, если это не указано.
Не пиши цену, если цена не указана.
Не пиши контакты.
Не используй markdown, эмодзи, списки и агрессивную рекламу.
Не используй слова «лучший», «идеальный», «100%», если пользователь этого не указал.
Стиль: простой, понятный, 1–2 коротких абзаца.
Если уже есть черновик описания — улучши его, сохранив факты пользователя.`;

const VERTICAL_INTRO: Record<ListingVertical, string> = {
  MARKET: "Продаётся",
  SERVICES: "Предлагаю услугу",
  OPT: "Оптовое предложение",
  CARGO: "Карго-услуга",
};

function formatField(label: string, value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const text = String(value).trim();
  if (!text) {
    return null;
  }
  return `${label}: ${text}`;
}

function formatStructuredCharacteristics(
  items: Array<{ label: string; value: string }> | undefined,
  legacy: string | null | undefined,
): string | null {
  const structured = (items ?? [])
    .map((item) => {
      const label = item.label.trim();
      const value = item.value.trim();
      if (!label || !value) {
        return null;
      }
      return `${label}: ${value}`;
    })
    .filter((line): line is string => Boolean(line));

  if (structured.length > 0) {
    return structured.join("\n");
  }

  const legacyText = legacy?.trim();
  return legacyText ? legacyText : null;
}

function hasUsefulPrice(price: string | number | null | undefined): boolean {
  if (price === null || price === undefined) {
    return false;
  }
  const text = String(price).trim();
  if (!text) {
    return false;
  }
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric > 0 : true;
}

export function buildListingDescriptionUserPrompt(
  input: GenerateListingDescriptionInput,
): string {
  const characteristicsBlock = formatStructuredCharacteristics(
    input.characteristicItems,
    input.characteristics,
  );

  const lines = [
    formatField("Тип публикации", input.vertical),
    formatField("Категория", input.category),
    formatField("Название", input.title),
    hasUsefulPrice(input.price) ? formatField("Цена", input.price) : null,
    hasUsefulPrice(input.price) ? formatField("Валюта", input.currency) : null,
    formatField("Город", input.city),
    formatField("Единица", input.unit),
    formatField("Минимальная партия / количество", input.moq),
    formatField("Состояние", input.condition),
    characteristicsBlock
      ? `Характеристики:\n${characteristicsBlock}`
      : null,
    formatField("Текущее описание", input.currentDescription),
  ].filter((line): line is string => Boolean(line));

  return `Составь описание объявления по данным пользователя.\nИспользуй только указанные характеристики. Не добавляй гарантию, комплектацию или другие факты, если пользователь их не указал.\n\n${lines.join("\n")}`;
}

function sanitizeGeneratedDescription(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[*_#>`]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, GENERATE_DESCRIPTION_OUTPUT_MAX);
}

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function resolveListingDescriptionModel(): string {
  return process.env.OPENAI_LISTING_MODEL?.trim() || DEFAULT_LISTING_DESCRIPTION_MODEL;
}

/** Template mock: only uses provided fields, invents nothing. */
export function buildMockListingDescription(
  input: GenerateListingDescriptionInput,
): GenerateListingDescriptionResult {
  if (input.currentDescription?.trim() && input.currentDescription.trim().length >= 20) {
    return {
      description: sanitizeGeneratedDescription(input.currentDescription),
      source: "mock",
    };
  }

  const intro = VERTICAL_INTRO[input.vertical];
  const title = input.title.trim();
  const parts: string[] = [];

  let first = `${intro}: ${title}.`;
  if (input.category?.trim()) {
    first += ` Категория — ${input.category.trim()}.`;
  }
  if (input.city?.trim()) {
    first += ` Город — ${input.city.trim()}.`;
  }
  parts.push(first);

  const details: string[] = [];
  const characteristicsBlock = formatStructuredCharacteristics(
    input.characteristicItems,
    input.characteristics,
  );
  if (characteristicsBlock) {
    details.push(characteristicsBlock.replace(/\n/g, ". ") + ".");
  }
  if (input.condition?.trim()) {
    details.push(`Состояние: ${input.condition.trim()}.`);
  }
  if (input.vertical === "OPT" && input.moq != null && String(input.moq).trim()) {
    const unitLabel = input.unit?.trim() ? ` ${input.unit.trim()}` : "";
    details.push(`Минимальная партия: ${String(input.moq).trim()}${unitLabel}.`);
  }
  if (hasUsefulPrice(input.price)) {
    const currency = input.currency?.trim() ? ` ${input.currency.trim()}` : "";
    details.push(`Цена: ${String(input.price).trim()}${currency}.`);
  }

  if (details.length > 0) {
    parts.push(details.join(" "));
  } else {
    parts.push("Подробности уточняйте в объявлении.");
  }

  const description = sanitizeGeneratedDescription(parts.join("\n\n"));
  return {
    description:
      description.length >= 20
        ? description
        : sanitizeGeneratedDescription(
            `${intro}: ${title}. Подробности уточняйте в объявлении.`,
          ),
    source: "mock",
  };
}

type OpenAiErrorBody = {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

export function isOpenAiBillingOrQuotaError(
  status: number,
  body: OpenAiErrorBody | null,
): boolean {
  if (status === 402) {
    return true;
  }

  const code = (body?.error?.code ?? "").toLowerCase();
  const type = (body?.error?.type ?? "").toLowerCase();
  const message = (body?.error?.message ?? "").toLowerCase();

  if (
    code === "insufficient_quota" ||
    code === "billing_not_active" ||
    code === "billing_hard_limit_reached" ||
    type === "insufficient_quota"
  ) {
    return true;
  }

  if (
    message.includes("insufficient_quota") ||
    message.includes("exceeded your current quota") ||
    message.includes("billing") ||
    message.includes("payment")
  ) {
    return true;
  }

  return status === 429 && (code.includes("quota") || message.includes("quota"));
}

type OpenAiChatCompletionResponse = OpenAiErrorBody & {
  choices?: Array<{ message?: { content?: string | null } }>;
};

async function requestOpenAiChatCompletion(options: {
  apiKey: string;
  model: string;
  input: GenerateListingDescriptionInput;
  signal: AbortSignal;
}): Promise<{ ok: true; content: string } | { ok: false; status: number; body: OpenAiErrorBody | null }> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    signal: options.signal,
    body: JSON.stringify({
      model: options.model,
      temperature: 0.4,
      ...(options.model.includes("gpt-5") || options.model.includes("luna")
        ? { max_completion_tokens: 400 }
        : { max_tokens: 400 }),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildListingDescriptionUserPrompt(options.input) },
      ],
    }),
  });

  let body: OpenAiChatCompletionResponse | null = null;

  try {
    body = (await response.json()) as OpenAiChatCompletionResponse;
  } catch {
    body = null;
  }

  if (!response.ok) {
    return { ok: false, status: response.status, body };
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    return {
      ok: false,
      status: 502,
      body: { error: { message: "OpenAI returned empty description", code: "empty" } },
    };
  }

  return { ok: true, content };
}

export async function generateListingDescription(
  input: GenerateListingDescriptionInput,
): Promise<GenerateListingDescriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return buildMockListingDescription(input);
  }

  const preferredModel = resolveListingDescriptionModel();
  const modelsToTry = Array.from(
    new Set([preferredModel, FALLBACK_LISTING_DESCRIPTION_MODEL]),
  );

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    for (const model of modelsToTry) {
      try {
        const result = await requestOpenAiChatCompletion({
          apiKey,
          model,
          input,
          signal: controller.signal,
        });

        if (result.ok) {
          const description = sanitizeGeneratedDescription(result.content);
          if (description.length < 20) {
            continue;
          }
          return { description, source: "openai", model };
        }

        if (isOpenAiBillingOrQuotaError(result.status, result.body)) {
          return buildMockListingDescription(input);
        }

        // Model missing / not allowed — try next model.
        if (result.status === 404 || result.status === 400) {
          continue;
        }

        // Other API errors → mock so the form still works.
        return buildMockListingDescription(input);
      } catch {
        // Network / abort — try next model, then mock.
        continue;
      }
    }

    return buildMockListingDescription(input);
  } finally {
    clearTimeout(timeout);
  }
}
