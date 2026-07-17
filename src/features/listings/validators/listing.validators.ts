import { ListingUnit, ListingVertical } from "@prisma/client";
import { z } from "zod";

export const LISTING_TITLE_MIN = 5;
export const LISTING_TITLE_MAX = 120;
export const LISTING_DESCRIPTION_MIN = 20;
export const LISTING_DESCRIPTION_MAX = 5000;
export const LISTING_IMAGE_MAX = 10;

const trimmedTitle = z
  .string()
  .trim()
  .min(LISTING_TITLE_MIN, "Заголовок слишком короткий")
  .max(LISTING_TITLE_MAX, "Заголовок слишком длинный")
  .refine((value) => value.length > 0, { message: "Укажите заголовок" });

const trimmedDescription = z
  .string()
  .trim()
  .min(LISTING_DESCRIPTION_MIN, "Описание слишком короткое")
  .max(LISTING_DESCRIPTION_MAX, "Описание слишком длинное");

const listingPrice = z.coerce
  .number()
  .refine((value) => Number.isFinite(value), { message: "Укажите корректную цену" })
  .refine((value) => value >= 0, { message: "Цена не может быть отрицательной" });

export const createListingSchema = z.object({
  title: trimmedTitle,
  description: trimmedDescription,
  price: listingPrice,
  currency: z.string().length(3, "Валюта должна состоять из 3 символов").default("KGS"),
  moq: z.coerce
    .number()
    .int("Минимальная партия должна быть целым числом")
    .min(0, "Минимальная партия не может быть отрицательной"),
  unit: z.nativeEnum(ListingUnit),
  category_id: z.string().uuid("Выберите категорию"),
  city_id: z.string().uuid("Выберите город"),
  brand_id: z.string().uuid("Некорректный бренд").optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0).optional().nullable(),
  /** Sent by create form; API defaults to OPT when omitted. */
  vertical: z.nativeEnum(ListingVertical).optional(),
  image_urls: z
    .array(
      z
        .string()
        .regex(
          /^\/(api\/)?uploads\/listings\/[a-zA-Z0-9._-]+$/,
          "Некорректный адрес изображения",
        ),
    )
    .min(1, "Добавьте хотя бы одно фото")
    .max(LISTING_IMAGE_MAX, `Можно загрузить не более ${LISTING_IMAGE_MAX} фото`),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

// Editing exposes the same seller-controlled fields as creation. Keeping one
// schema prevents create and update validation rules from drifting apart.
export const updateListingSchema = createListingSchema;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
