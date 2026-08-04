import { ListingVertical } from "@prisma/client";
import { z } from "zod";

export const GENERATE_DESCRIPTION_TITLE_MAX = 120;
export const GENERATE_DESCRIPTION_CHARS_MAX = 800;
export const GENERATE_DESCRIPTION_CURRENT_MAX = 2000;
export const GENERATE_DESCRIPTION_OUTPUT_MAX = 1200;

export const generateListingDescriptionSchema = z.object({
  vertical: z.nativeEnum(ListingVertical),
  category: z.string().trim().max(150).optional().nullable(),
  title: z.string().trim().min(3).max(GENERATE_DESCRIPTION_TITLE_MAX),
  price: z.union([z.string(), z.number()]).optional().nullable(),
  currency: z.string().trim().max(3).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
  characteristics: z.string().trim().max(GENERATE_DESCRIPTION_CHARS_MAX).optional().nullable(),
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

export function buildListingDescriptionUserPrompt(
  input: GenerateListingDescriptionInput,
): string {
  const lines = [
    formatField("Тип публикации", input.vertical),
    formatField("Категория", input.category),
    formatField("Название", input.title),
    formatField("Цена", input.price),
    formatField("Валюта", input.currency),
    formatField("Город", input.city),
    formatField("Единица", input.unit),
    formatField("Минимальная партия / количество", input.moq),
    formatField("Состояние", input.condition),
    formatField("Характеристики", input.characteristics),
    formatField("Текущее описание", input.currentDescription),
  ].filter((line): line is string => Boolean(line));

  return `Составь описание объявления по данным пользователя.\n\n${lines.join("\n")}`;
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

export async function generateListingDescription(
  input: GenerateListingDescriptionInput,
): Promise<GenerateListingDescriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_LISTING_MODEL?.trim() || "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildListingDescriptionUserPrompt(input) },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = body.choices?.[0]?.message?.content;
    if (!content || !content.trim()) {
      throw new Error("OpenAI returned empty description");
    }

    const description = sanitizeGeneratedDescription(content);
    if (description.length < 20) {
      throw new Error("Generated description is too short");
    }

    return { description };
  } finally {
    clearTimeout(timeout);
  }
}
