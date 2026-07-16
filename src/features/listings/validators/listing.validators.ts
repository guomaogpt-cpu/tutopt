import { ListingUnit, ListingVertical } from "@prisma/client";
import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(3, "Заголовок слишком короткий").max(200, "Заголовок слишком длинный"),
  description: z
    .string()
    .min(10, "Описание слишком короткое")
    .max(10000, "Описание слишком длинное"),
  price: z.coerce.number().positive("Цена должна быть больше нуля"),
  currency: z.string().length(3, "Валюта должна состоять из 3 символов").default("KGS"),
  moq: z.coerce.number().int().min(1, "Минимальная партия должна быть не меньше 1"),
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
    .max(10, "Можно загрузить не более 10 фото"),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
