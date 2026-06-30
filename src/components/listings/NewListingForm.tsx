"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { FormSection } from "@/components/listings/FormSection";
import { ListingImageUpload } from "@/components/listings/ListingImageUpload";
import { ChipPicker, OptionPicker } from "@/components/listings/OptionPicker";
import { currencyOptions, listingUnitOptions, type SelectOption } from "@/features/listings/constants";
import {
  ListingRequestError,
  createListingRequest,
  getListingFieldError,
  type ListingFormErrors,
} from "@/features/listings/lib/listings-client";
import type { CategoryItem } from "@/features/listings/types/category";
import type { CreateListingInput } from "@/features/listings/validators/listing.validators";

type NewListingFormProps = {
  categories: CategoryItem[];
  cities: SelectOption[];
  brands: SelectOption[];
};

const emptyErrors: ListingFormErrors = { form: [], fields: {} };

const fieldClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

export function NewListingForm({ categories, cities, brands }: NewListingFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("KGS");
  const [moq, setMoq] = useState("1");
  const [unit, setUnit] = useState("PIECE");
  const [cityId, setCityId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [errors, setErrors] = useState<ListingFormErrors>(emptyErrors);
  const [clientError, setClientError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(emptyErrors);
    setClientError("");

    if (!categoryId) {
      setClientError("Выберите категорию");
      return;
    }

    if (imageUrls.length === 0) {
      setClientError("Добавьте хотя бы одно фото");
      return;
    }

    if (imageUrls.length > 10) {
      setClientError("Можно загрузить не более 10 фотографий");
      return;
    }

    if (!cityId) {
      setClientError("Выберите город");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createListingRequest({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        currency,
        moq: Number(moq),
        unit: unit as CreateListingInput["unit"],
        category_id: categoryId,
        city_id: cityId,
        brand_id: brandId || null,
        stock_quantity: stockQuantity ? Number(stockQuantity) : null,
        image_urls: imageUrls,
      });

      router.push(`/listings/${result.listing.id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof ListingRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: ["Не удалось создать объявление. Попробуйте позже."],
          fields: {},
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {(clientError || errors.form.length > 0) && (
        <div
          role="alert"
          className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
        >
          {clientError ? <p>{clientError}</p> : null}
          {errors.form.length > 0 ? (
            <ul className="space-y-1">
              {errors.form.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

      <FormSection
        title="Основная информация"
        description="Название, описание, категория и фото — самое важное для покупателя."
      >
        <div className="space-y-2">
          <label htmlFor="listing-title" className="text-sm font-medium text-slate-700">
            Название
          </label>
          <input
            id="listing-title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: Цемент М500 оптом"
            className={fieldClassName}
            disabled={isSubmitting}
          />
          {getListingFieldError(errors, "title") ? (
            <p className="text-xs text-red-600">{getListingFieldError(errors, "title")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="listing-description" className="text-sm font-medium text-slate-700">
            Описание
          </label>
          <textarea
            id="listing-description"
            name="description"
            rows={5}
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Опишите товар, условия поставки и преимущества для оптовых покупателей"
            className={`${fieldClassName} resize-y min-h-[140px]`}
            disabled={isSubmitting}
          />
          {getListingFieldError(errors, "description") ? (
            <p className="text-xs text-red-600">{getListingFieldError(errors, "description")}</p>
          ) : null}
        </div>

        <CategoryPicker
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
          disabled={isSubmitting}
          error={getListingFieldError(errors, "category_id")}
        />

        <ListingImageUpload
          value={imageUrls}
          onChange={setImageUrls}
          disabled={isSubmitting}
          error={getListingFieldError(errors, "image_urls")}
        />
      </FormSection>

      <FormSection title="Цена" description="Укажите оптовую цену и минимальную партию.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="listing-price" className="text-sm font-medium text-slate-700">
              Цена
            </label>
            <input
              id="listing-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="320"
              className={fieldClassName}
              disabled={isSubmitting}
            />
            {getListingFieldError(errors, "price") ? (
              <p className="text-xs text-red-600">{getListingFieldError(errors, "price")}</p>
            ) : null}
          </div>

          <ChipPicker
            label="Валюта"
            value={currency}
            onChange={setCurrency}
            disabled={isSubmitting}
            options={currencyOptions.map((option) => ({
              id: option.value,
              label: option.label,
            }))}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="listing-moq" className="text-sm font-medium text-slate-700">
              MOQ (мин. партия)
            </label>
            <input
              id="listing-moq"
              name="moq"
              type="number"
              min="1"
              required
              value={moq}
              onChange={(event) => setMoq(event.target.value)}
              className={fieldClassName}
              disabled={isSubmitting}
            />
            {getListingFieldError(errors, "moq") ? (
              <p className="text-xs text-red-600">{getListingFieldError(errors, "moq")}</p>
            ) : null}
          </div>

          <ChipPicker
            label="Единица"
            value={unit}
            onChange={setUnit}
            disabled={isSubmitting}
            options={listingUnitOptions.map((option) => ({
              id: option.value,
              label: option.label,
            }))}
          />
        </div>
      </FormSection>

      <FormSection
        title="Дополнительная информация"
        description="Город, бренд и остаток помогут покупателю быстрее принять решение."
        className={openPickerId ? "relative z-40" : undefined}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <OptionPicker
            pickerId="city"
            openPickerId={openPickerId}
            onOpenPickerChange={setOpenPickerId}
            label="Город"
            value={cityId}
            onChange={setCityId}
            options={cities}
            placeholder="Выберите город"
            searchable
            disabled={isSubmitting}
            error={getListingFieldError(errors, "city_id")}
          />

          <OptionPicker
            pickerId="brand"
            openPickerId={openPickerId}
            onOpenPickerChange={setOpenPickerId}
            label="Бренд"
            value={brandId}
            onChange={setBrandId}
            options={brands}
            placeholder="Без бренда"
            searchable
            optional
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="listing-stock" className="text-sm font-medium text-slate-700">
            Остаток на складе <span className="font-normal text-slate-400">(необязательно)</span>
          </label>
          <input
            id="listing-stock"
            name="stock_quantity"
            type="number"
            min="0"
            value={stockQuantity}
            onChange={(event) => setStockQuantity(event.target.value)}
            placeholder="1000"
            className={fieldClassName}
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <div className="relative z-0 animate-fade-in-up rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 shadow-sm sm:p-8">
        <button
          type="submit"
          disabled={isSubmitting || imageUrls.length === 0}
          className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Публикация..." : "Опубликовать объявление"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          После публикации объявление отправится на модерацию.
        </p>
      </div>
    </form>
  );
}

export function ListingAccessMessage({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
