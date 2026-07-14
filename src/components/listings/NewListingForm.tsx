"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { FormSection } from "@/components/listings/FormSection";
import { ListingImageUpload } from "@/components/listings/ListingImageUpload";
import { NewListingSidebar } from "@/components/listings/NewListingSidebar";
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
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

  return <p className="text-sm text-[#DC2626]">{message}</p>;
}

function fieldInputClass(hasError: boolean): string {
  return cn(
    "h-11 rounded-xl border-[rgba(148,163,184,0.25)]",
    hasError && "border-[#FECACA] focus-visible:ring-[#FECACA]",
  );
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

  const cityLabel = useMemo(
    () => cities.find((city) => city.id === cityId)?.label ?? "",
    [cities, cityId],
  );

  const sidebarPreview = {
    title,
    price,
    currency,
    moq,
    cityLabel,
    imageUrl: imageUrls[0] ?? null,
  };

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

    const serverImageUrls = imageUrls.filter((url) =>
      url.startsWith("/api/uploads/listings/"),
    );

    if (serverImageUrls.length === 0) {
      setClientError("Дождитесь окончания загрузки фото");
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
        image_urls: serverImageUrls,
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

  const titleError = getListingFieldError(errors, "title");
  const descriptionError = getListingFieldError(errors, "description");
  const categoryError = getListingFieldError(errors, "category_id");
  const priceError = getListingFieldError(errors, "price");
  const moqError = getListingFieldError(errors, "moq");
  const cityError = getListingFieldError(errors, "city_id");
  const imageError = getListingFieldError(errors, "image_urls");

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 lg:mt-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-6">
          {(clientError || errors.form.length > 0) && (
            <div
              className="rounded-[18px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#DC2626]"
              role="alert"
            >
              {clientError ? <p>{clientError}</p> : null}
              {errors.form.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          )}

          <FormSection
            title="Основная информация"
            description="Название и бренд помогут покупателю быстро понять предложение."
          >
            <div className="space-y-2">
              <label htmlFor="listing-title" className="text-sm font-medium text-[#0F172A]">
                Название объявления
              </label>
              <Input
                id="listing-title"
                name="title"
                type="text"
                required
                maxLength={200}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Например: Сахар оптом 50 кг"
                disabled={isSubmitting}
                className={fieldInputClass(Boolean(titleError))}
              />
              <p className="text-xs text-[#64748B]">
                Укажите товар, фасовку или ключевую характеристику
              </p>
              <FieldError message={titleError} />
            </div>

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
          </FormSection>

          <FormSection
            title="Категория"
            description="Выберите наиболее подходящую категорию для вашего товара."
          >
            <CategoryPicker
              categories={categories}
              value={categoryId}
              onChange={setCategoryId}
              disabled={isSubmitting}
              error={categoryError || (clientError === "Выберите категорию" ? clientError : undefined)}
            />
          </FormSection>

          <FormSection
            title="Цена и условия опта"
            description="Укажите оптовую цену, валюту и минимальную партию."
          >
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="space-y-2">
                <label htmlFor="listing-price" className="text-sm font-medium text-[#0F172A]">
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
                  placeholder="250"
                  disabled={isSubmitting}
                  className={fieldInputClass(Boolean(priceError))}
                />
                <p className="text-xs text-[#64748B]">Цена за выбранную единицу измерения</p>
                <FieldError message={priceError} />
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
                <label htmlFor="listing-moq" className="text-sm font-medium text-[#0F172A]">
                  Минимальная партия (MOQ)
                </label>
                <Input
                  id="listing-moq"
                  name="moq"
                  type="number"
                  min="1"
                  required
                  value={moq}
                  onChange={(event) => setMoq(event.target.value)}
                  placeholder="100"
                  disabled={isSubmitting}
                  className={fieldInputClass(Boolean(moqError))}
                />
                <p className="text-xs text-[#64748B]">Минимальный объём заказа для опта</p>
                <FieldError message={moqError} />
              </div>

              <ChipPicker
                label="Единица измерения"
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
            title="Наличие и город"
            description="Укажите город отгрузки и остаток, если он известен."
            className={openPickerId === "city" ? "relative z-40" : undefined}
          >
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
              error={cityError || (clientError === "Выберите город" ? clientError : undefined)}
            />

            <div className="space-y-2">
              <label htmlFor="listing-stock" className="text-sm font-medium text-[#0F172A]">
                Остаток на складе
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
                className={fieldInputClass(false)}
              />
              <p className="text-xs text-[#64748B]">
                Можно оставить пустым, если точный остаток неизвестен
              </p>
            </div>
          </FormSection>

          <FormSection
            title="Фото"
            description="Качественные фото повышают доверие покупателей и скорость продаж."
          >
            <ListingImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              disabled={isSubmitting}
              error={
                imageError ||
                (clientError === "Добавьте хотя бы одно фото" ? clientError : undefined) ||
                (clientError === "Можно загрузить не более 10 фотографий" ? clientError : undefined)
              }
            />
          </FormSection>

          <FormSection
            title="Описание"
            description="Расскажите об упаковке, отгрузке и особенностях товара."
          >
            <div className="space-y-2">
              <label htmlFor="listing-description" className="text-sm font-medium text-[#0F172A]">
                Полное описание
              </label>
              <Textarea
                id="listing-description"
                name="description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Опишите товар, условия продажи, упаковку, наличие, особенности..."
                className={cn(
                  "min-h-[160px] resize-y rounded-xl border-[rgba(148,163,184,0.25)]",
                  descriptionError && "border-[#FECACA] focus-visible:ring-[#FECACA]",
                )}
                disabled={isSubmitting}
              />
              <ul className="text-xs leading-relaxed text-[#64748B]">
                <li>Упаковка и фасовка</li>
                <li>Минимальная партия и условия отгрузки</li>
                <li>Город и сроки поставки</li>
                <li>Ключевые характеристики товара</li>
              </ul>
              <FieldError message={descriptionError} />
            </div>
          </FormSection>

          <div className="rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6">
            <Button
              type="submit"
              disabled={isSubmitting || imageUrls.length === 0}
              className="h-12 w-full rounded-xl bg-[#2563EB] text-base hover:bg-[#1D4ED8]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Отправка...
                </>
              ) : (
                "Отправить на модерацию"
              )}
            </Button>
            <p className="mt-3 text-center text-sm text-[#64748B]">
              После отправки объявление будет проверено модератором.
            </p>
            <div className="mt-4 text-center">
              <Link
                href="/seller/dashboard"
                className="text-sm font-medium text-[#64748B] transition hover:text-[#2563EB]"
              >
                Отмена
              </Link>
            </div>
          </div>
        </div>

        <NewListingSidebar
          {...sidebarPreview}
          className="hidden lg:block"
        />
      </div>

      <NewListingSidebar
        {...sidebarPreview}
        className="mt-8 lg:hidden"
      />
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
      className="mt-8 rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white"
      action={
        actionHref && actionLabel ? (
          <Button asChild className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null
      }
    />
  );
}
