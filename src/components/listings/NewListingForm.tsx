"use client";

import Link from "next/link";
import type { ListingUnit, ListingVertical } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { FormSection } from "@/components/listings/FormSection";
import type { ListingQualityInput } from "@/lib/moderation/listing-quality";
import { ListingImageUpload } from "@/components/listings/ListingImageUpload";
import { NewListingSidebar } from "@/components/listings/NewListingSidebar";
import { ChipPicker, OptionPicker } from "@/components/listings/OptionPicker";
import { currencyOptions, type SelectOption } from "@/features/listings/constants";
import {
  ListingRequestError,
  createListingRequest,
  getListingFieldError,
  type ListingFormErrors,
} from "@/features/listings/lib/listings-client";
import { getVerticalFormConfig } from "@/features/listings/lib/vertical-form-config";
import type { CategoryItem } from "@/features/listings/types/category";
import type { CreateListingInput } from "@/features/listings/validators/listing.validators";
import {
  DEFAULT_LISTING_VERTICAL,
  VERTICAL_LIST,
} from "@/features/verticals/verticals";
import {
  trackCreateListingStart,
  trackCreateListingSubmit,
} from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type NewListingFormProps = {
  categories: CategoryItem[];
  cities: SelectOption[];
  brands: SelectOption[];
  initialVertical?: ListingVertical;
  initialCategoryId?: string;
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

function resolveInitialCategoryId(
  categories: CategoryItem[],
  vertical: ListingVertical,
  initialCategoryId?: string,
): string {
  if (!initialCategoryId) {
    return "";
  }

  const match = categories.find(
    (category) => category.id === initialCategoryId && category.vertical === vertical,
  );
  return match?.id ?? "";
}

export function NewListingForm({
  categories,
  cities,
  brands,
  initialVertical = DEFAULT_LISTING_VERTICAL,
  initialCategoryId,
}: NewListingFormProps) {
  const router = useRouter();
  const [vertical, setVertical] = useState<ListingVertical>(initialVertical);
  const formConfig = getVerticalFormConfig(vertical);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(() =>
    resolveInitialCategoryId(categories, initialVertical, initialCategoryId),
  );
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("KGS");
  const [moq, setMoq] = useState("1");
  const [unit, setUnit] = useState<ListingUnit>(formConfig.defaultUnit);
  const [cityId, setCityId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [errors, setErrors] = useState<ListingFormErrors>(emptyErrors);
  const [clientError, setClientError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);

  const categoriesForVertical = useMemo(
    () => categories.filter((category) => category.vertical === vertical),
    [categories, vertical],
  );

  useEffect(() => {
    trackCreateListingStart(initialVertical);
  }, [initialVertical]);

  useEffect(() => {
    const allowed = formConfig.unitOptions.some((option) => option.value === unit);
    if (!allowed) {
      setUnit(formConfig.defaultUnit);
    }
  }, [formConfig, unit]);

  function handleVerticalChange(nextVertical: ListingVertical) {
    const nextConfig = getVerticalFormConfig(nextVertical);
    setVertical(nextVertical);
    setUnit(nextConfig.defaultUnit);
    setMoq("1");

    if (!nextConfig.showBrand) {
      setBrandId("");
    }
    if (!nextConfig.showStock) {
      setStockQuantity("");
    }

    const selected = categories.find((category) => category.id === categoryId);
    if (!selected || selected.vertical !== nextVertical) {
      setCategoryId("");
    }
  }

  const cityLabel = useMemo(
    () => cities.find((city) => city.id === cityId)?.label ?? "",
    [cities, cityId],
  );

  const qualityInput: ListingQualityInput = {
    title,
    description,
    price,
    cityId: cityId || null,
    cityName: cityLabel || null,
    categoryId: categoryId || null,
    vertical,
    imageCount: imageUrls.length,
    moq: Number.isFinite(Number(moq)) ? Number(moq) : null,
    unit,
  };

  const sidebarPreview = {
    title,
    price,
    currency,
    moq,
    cityLabel,
    imageUrl: imageUrls[0] ?? null,
    tips: formConfig.sidebarTips,
    quantityLabel: formConfig.previewQuantityLabel,
    showQuantity: formConfig.showMoq,
    qualityInput,
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

    const resolvedMoq = formConfig.showMoq ? Number(moq) : 1;
    if (!Number.isFinite(resolvedMoq) || resolvedMoq < 1) {
      setClientError(formConfig.showMoq ? "Укажите корректное количество" : "Ошибка формы");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createListingRequest({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        currency,
        moq: resolvedMoq,
        unit: unit as CreateListingInput["unit"],
        category_id: categoryId,
        city_id: cityId,
        brand_id: formConfig.showBrand && brandId ? brandId : null,
        stock_quantity:
          formConfig.showStock && stockQuantity ? Number(stockQuantity) : null,
        vertical,
        image_urls: serverImageUrls,
      });

      trackCreateListingSubmit(vertical);
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
            title="Раздел"
            description="Выберите, где будет размещено объявление."
          >
            <div className="space-y-2">
              <label htmlFor="listing-vertical" className="text-sm font-medium text-[#0F172A]">
                Раздел объявления
              </label>
              <Select
                value={vertical}
                onValueChange={(value) => handleVerticalChange(value as ListingVertical)}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="listing-vertical"
                  className="h-11 rounded-xl border-[rgba(148,163,184,0.25)] bg-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VERTICAL_LIST.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormSection>

          <FormSection title="Основная информация" description={formConfig.basicsDescription}>
            <div className="space-y-2">
              <label htmlFor="listing-title" className="text-sm font-medium text-[#0F172A]">
                {formConfig.titleLabel}
              </label>
              <Input
                id="listing-title"
                name="title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={formConfig.titlePlaceholder}
                disabled={isSubmitting}
                className={fieldInputClass(Boolean(titleError))}
              />
              <p className="text-xs text-[#64748B]">{formConfig.titleHint}</p>
              <FieldError message={titleError} />
            </div>

            {formConfig.showBrand ? (
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
            ) : null}
          </FormSection>

          <FormSection title="Категория" description={formConfig.categoryDescription}>
            <CategoryPicker
              categories={categoriesForVertical}
              value={categoryId}
              onChange={setCategoryId}
              disabled={isSubmitting}
              error={categoryError || (clientError === "Выберите категорию" ? clientError : undefined)}
            />
          </FormSection>

          <FormSection
            title={formConfig.priceSectionTitle}
            description={formConfig.priceSectionDescription}
          >
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="space-y-2">
                <label htmlFor="listing-price" className="text-sm font-medium text-[#0F172A]">
                  {formConfig.priceLabel}
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
                <p className="text-xs text-[#64748B]">{formConfig.priceHint}</p>
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

            <div
              className={cn(
                "grid gap-5",
                formConfig.showMoq ? "sm:grid-cols-2" : "sm:grid-cols-1",
              )}
            >
              {formConfig.showMoq ? (
                <div className="space-y-2">
                  <label htmlFor="listing-moq" className="text-sm font-medium text-[#0F172A]">
                    {formConfig.moqLabel}
                  </label>
                  <Input
                    id="listing-moq"
                    name="moq"
                    type="number"
                    min="1"
                    required
                    value={moq}
                    onChange={(event) => setMoq(event.target.value)}
                    placeholder={formConfig.moqPlaceholder}
                    disabled={isSubmitting}
                    className={fieldInputClass(Boolean(moqError))}
                  />
                  <p className="text-xs text-[#64748B]">{formConfig.moqHint}</p>
                  <FieldError message={moqError} />
                </div>
              ) : null}

              <ChipPicker
                label={formConfig.unitLabel}
                value={unit}
                onChange={(value) => setUnit(value as ListingUnit)}
                disabled={isSubmitting}
                options={formConfig.unitOptions.map((option) => ({
                  id: option.value,
                  label: option.label,
                }))}
              />
            </div>
          </FormSection>

          <FormSection
            title={formConfig.locationSectionTitle}
            description={formConfig.locationSectionDescription}
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

            {formConfig.showStock ? (
              <div className="space-y-2">
                <label htmlFor="listing-stock" className="text-sm font-medium text-[#0F172A]">
                  {formConfig.stockLabel}
                </label>
                <Input
                  id="listing-stock"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(event) => setStockQuantity(event.target.value)}
                  placeholder={formConfig.stockPlaceholder}
                  disabled={isSubmitting}
                  className={fieldInputClass(false)}
                />
                <p className="text-xs text-[#64748B]">{formConfig.stockHint}</p>
              </div>
            ) : null}
          </FormSection>

          <FormSection
            title="Фото"
            description="Качественные фото повышают доверие и отклик."
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
            description={formConfig.descriptionSectionDescription}
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
                placeholder={formConfig.descriptionPlaceholder}
                className={cn(
                  "min-h-[160px] resize-y rounded-xl border-[rgba(148,163,184,0.25)]",
                  descriptionError && "border-[#FECACA] focus-visible:ring-[#FECACA]",
                )}
                disabled={isSubmitting}
              />
              <ul className="text-xs leading-relaxed text-[#64748B]">
                {formConfig.descriptionTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
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

        <NewListingSidebar {...sidebarPreview} className="hidden lg:block" />
      </div>

      <NewListingSidebar {...sidebarPreview} className="mt-8 lg:hidden" />
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
