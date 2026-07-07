"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type NewListingFormProps = {
  categories: CategoryItem[];
  cities: SelectOption[];
  brands: SelectOption[];
};

const emptyErrors: ListingFormErrors = { form: [], fields: {} };

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-destructive">{message}</p>;
}

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

    if (isSubmitting) {
      return;
    }

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
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="mt-8 space-y-6">
      {(clientError || errors.form.length > 0) && (
        <Card className="border-destructive/30 bg-destructive/5" role="alert">
          <CardContent className="space-y-1 p-4 text-sm text-destructive">
            {clientError ? <p>{clientError}</p> : null}
            {errors.form.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </CardContent>
        </Card>
      )}

      <FormSection
        title="Основная информация"
        description="Название, описание и категория — самое важное для покупателя."
      >
        <div className="space-y-2">
          <label htmlFor="listing-title" className="text-sm font-medium text-foreground">
            Название
          </label>
          <Input
            id="listing-title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Например: Цемент М500 оптом"
            disabled={isSubmitting}
          />
          <FieldError message={getListingFieldError(errors, "title")} />
        </div>

        <div className="space-y-2">
          <label htmlFor="listing-description" className="text-sm font-medium text-foreground">
            Описание
          </label>
          <Textarea
            id="listing-description"
            name="description"
            rows={5}
            required
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Опишите товар, условия поставки и преимущества для оптовых покупателей"
            className="min-h-[140px] resize-y"
            disabled={isSubmitting}
          />
          <FieldError message={getListingFieldError(errors, "description")} />
        </div>

        <CategoryPicker
          categories={categories}
          value={categoryId}
          onChange={setCategoryId}
          disabled={isSubmitting}
          error={getListingFieldError(errors, "category_id")}
        />
      </FormSection>

      <FormSection
        title="Фото"
        description="Загрузите от 1 до 10 фотографий. Первое фото станет главным на карточке."
      >
        <ListingImageUpload
          value={imageUrls}
          onChange={setImageUrls}
          disabled={isSubmitting}
          error={getListingFieldError(errors, "image_urls")}
        />
      </FormSection>

      <FormSection title="Цена и условия" description="Укажите оптовую цену и минимальную партию.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="listing-price" className="text-sm font-medium text-foreground">
              Цена
            </label>
            <Input
              id="listing-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="320"
              disabled={isSubmitting}
            />
            <FieldError message={getListingFieldError(errors, "price")} />
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
            <label htmlFor="listing-moq" className="text-sm font-medium text-foreground">
              MOQ (мин. партия)
            </label>
            <Input
              id="listing-moq"
              name="moq"
              type="number"
              min="1"
              required
              value={moq}
              onChange={(event) => setMoq(event.target.value)}
              disabled={isSubmitting}
            />
            <FieldError message={getListingFieldError(errors, "moq")} />
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
        title="Местоположение и бренд"
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
          <label htmlFor="listing-stock" className="text-sm font-medium text-foreground">
            Остаток на складе <span className="font-normal text-muted-foreground">(необязательно)</span>
          </label>
          <Input
            id="listing-stock"
            name="stock_quantity"
            type="number"
            min="0"
            value={stockQuantity}
            onChange={(event) => setStockQuantity(event.target.value)}
            placeholder="1000"
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Публикация" description="После публикации объявление отправится на модерацию.">
        <Button
          type="submit"
          disabled={isSubmitting || imageUrls.length === 0}
          className="h-12 w-full text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Публикация...
            </>
          ) : (
            "Опубликовать объявление"
          )}
        </Button>
      </FormSection>
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
    <EmptyState
      title={title}
      description={description}
      className="mt-8"
      action={
        actionHref && actionLabel ? (
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null
      }
    />
  );
}
