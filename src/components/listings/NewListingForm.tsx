"use client";

import Link from "next/link";
import type { ListingStatus, ListingUnit, ListingVertical } from "@prisma/client";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { CreateListingVerticalChooser } from "@/components/listings/CreateListingVerticalChooser";
import { ListingPostAsSelector } from "@/components/listings/ListingPostAsSelector";
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
  updateListingRequest,
} from "@/features/listings/lib/listings-client";
import { getVerticalFormConfig } from "@/features/listings/lib/vertical-form-config";
import type { CategoryItem } from "@/features/listings/types/category";
import type { CreateListingInput } from "@/features/listings/validators/listing.validators";
import { VERTICAL_LIST } from "@/features/verticals/verticals";
import {
  trackCreateListingStart,
  trackCreateListingSubmit,
  trackListingEditStart,
  trackListingEditSubmit,
} from "@/lib/analytics/events";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
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
  initialVertical?: ListingVertical | null;
  initialCategoryId?: string;
  mode?: "create" | "edit";
  listingId?: string;
  initialValues?: ListingFormInitialValues;
  cancelHref?: string;
  companyProfile?: {
    isConfigured: boolean;
    companyName: string;
  } | null;
};

export type ListingFormInitialValues = {
  title: string;
  description: string;
  vertical: ListingVertical;
  categoryId: string;
  price: string;
  currency: string;
  moq: number;
  unit: ListingUnit;
  cityId: string;
  brandId: string | null;
  stockQuantity: number | null;
  imageUrls: string[];
  status: ListingStatus;
};

const emptyErrors: ListingFormErrors = { form: [], fields: {} };

const VERTICAL_LABEL_KEY: Record<ListingVertical, DictionaryKey> = {
  MARKET: "nav.market",
  SERVICES: "nav.services",
  OPT: "nav.opt",
  CARGO: "nav.cargo",
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

function fieldInputClass(hasError: boolean): string {
  return cn(
    "h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100",
    hasError && "border-red-200 focus-visible:ring-red-200 dark:border-red-900",
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
  initialVertical = null,
  initialCategoryId,
  mode = "create",
  listingId,
  initialValues,
  cancelHref = "/account/listings",
  companyProfile = null,
}: NewListingFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const resolvedInitialVertical = initialValues?.vertical ?? initialVertical;
  const [vertical, setVertical] = useState<ListingVertical | null>(resolvedInitialVertical);
  const needsChooser = mode === "create" && !resolvedInitialVertical;
  const [chooserDone, setChooserDone] = useState(!needsChooser);
  const theme = getVerticalTheme(vertical);
  const formConfig = getVerticalFormConfig(vertical ?? "MARKET");
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [categoryId, setCategoryId] = useState(() =>
    resolveInitialCategoryId(
      categories,
      resolvedInitialVertical ?? "MARKET",
      initialValues?.categoryId ?? initialCategoryId,
    ),
  );
  const [imageUrls, setImageUrls] = useState<string[]>(initialValues?.imageUrls ?? []);
  const [price, setPrice] = useState(initialValues?.price ?? "");
  const [currency, setCurrency] = useState(initialValues?.currency ?? "KGS");
  const [moq, setMoq] = useState(String(initialValues?.moq ?? 1));
  const [unit, setUnit] = useState<ListingUnit>(
    initialValues?.unit ?? formConfig.defaultUnit,
  );
  const [cityId, setCityId] = useState(initialValues?.cityId ?? "");
  const [brandId, setBrandId] = useState(initialValues?.brandId ?? "");
  const [stockQuantity, setStockQuantity] = useState(
    initialValues?.stockQuantity == null ? "" : String(initialValues.stockQuantity),
  );
  const [postedAsCompany, setPostedAsCompany] = useState(
    Boolean(companyProfile?.isConfigured && initialVertical === "CARGO"),
  );
  const [errors, setErrors] = useState<ListingFormErrors>(emptyErrors);
  const [clientError, setClientError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);

  const categoriesForVertical = useMemo(
    () => categories.filter((category) => category.vertical === vertical),
    [categories, vertical],
  );

  const categoryLabel = useMemo(
    () => categories.find((category) => category.id === categoryId)?.name ?? "",
    [categories, categoryId],
  );

  const isDirty = useMemo(() => {
    if (mode === "edit") {
      return (
        title !== (initialValues?.title ?? "") ||
        description !== (initialValues?.description ?? "") ||
        price !== (initialValues?.price ?? "") ||
        cityId !== (initialValues?.cityId ?? "") ||
        categoryId !== (initialValues?.categoryId ?? "") ||
        imageUrls.length !== (initialValues?.imageUrls.length ?? 0)
      );
    }
    return Boolean(
      title.trim() ||
        description.trim() ||
        price.trim() ||
        cityId ||
        categoryId ||
        imageUrls.length > 0,
    );
  }, [
    mode,
    title,
    description,
    price,
    cityId,
    categoryId,
    imageUrls.length,
    initialValues,
  ]);

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      trackListingEditStart(initialValues.vertical, initialValues.status);
      return;
    }
    if (resolvedInitialVertical) {
      trackCreateListingStart(resolvedInitialVertical);
    }
  }, [initialValues, mode, resolvedInitialVertical]);

  useEffect(() => {
    const allowed = formConfig.unitOptions.some((option) => option.value === unit);
    if (!allowed) {
      setUnit(formConfig.defaultUnit);
    }
  }, [formConfig, unit]);

  useEffect(() => {
    if (!isDirty || isSubmitting || createdListingId) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting, createdListingId]);

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
    vertical: vertical ?? "MARKET",
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

    if (!title.trim()) {
      setClientError(t("createListing.validation.titleRequired"));
      return;
    }

    if (!vertical) {
      setClientError(t("createListing.validation.verticalRequired"));
      return;
    }

    if (!categoryId) {
      setClientError(t("createListing.validation.categoryRequired"));
      return;
    }

    if (imageUrls.length === 0) {
      setClientError(t("createListing.validation.photoRequired"));
      return;
    }

    if (imageUrls.length > 10) {
      setClientError(t("createListing.validation.photoLimit"));
      return;
    }

    const serverImageUrls = imageUrls.filter(
      (url) =>
        url.startsWith("/api/uploads/listings/") ||
        url.startsWith("/uploads/listings/"),
    );

    if (serverImageUrls.length === 0) {
      setClientError(t("createListing.validation.waitUpload"));
      return;
    }

    if (!cityId) {
      setClientError(t("createListing.validation.cityRequired"));
      return;
    }

    const priceValue = Number(price);
    if (!Number.isFinite(priceValue) || priceValue < 0 || price.trim() === "") {
      setClientError(t("createListing.validation.invalidPrice"));
      return;
    }

    const resolvedMoq = formConfig.showMoq ? Number(moq) : 1;
    if (!Number.isFinite(resolvedMoq) || resolvedMoq < 1) {
      setClientError(formConfig.showMoq ? "Укажите корректное количество" : "Ошибка формы");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateListingInput = {
        title: title.trim(),
        description: description.trim(),
        price: priceValue,
        currency,
        moq: resolvedMoq,
        unit: unit as CreateListingInput["unit"],
        category_id: categoryId,
        city_id: cityId,
        brand_id: formConfig.showBrand && brandId ? brandId : null,
        stock_quantity:
          formConfig.showStock && stockQuantity ? Number(stockQuantity) : null,
        vertical,
        posted_as_company:
          mode === "create" ? Boolean(postedAsCompany && companyProfile?.isConfigured) : undefined,
        image_urls: serverImageUrls,
      };
      const result =
        mode === "edit" && listingId
          ? await updateListingRequest(listingId, payload)
          : await createListingRequest(payload);

      if (mode === "edit" && initialValues) {
        trackListingEditSubmit(
          vertical,
          initialValues.status,
          result.listing.status ?? initialValues.status,
        );
        router.push(`/listings/${result.listing.id}`);
        router.refresh();
        return;
      }

      trackCreateListingSubmit(vertical);
      setCreatedListingId(result.listing.id);
      setIsSubmitting(false);
      router.refresh();
    } catch (error) {
      if (error instanceof ListingRequestError) {
        setErrors(error.formErrors);
      } else {
        setErrors({
          form: [
            mode === "edit"
              ? "Не удалось сохранить изменения. Попробуйте позже."
              : "Не удалось создать объявление. Попробуйте позже.",
          ],
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

  const categoryRequiredMsg = t("createListing.validation.categoryRequired");
  const cityRequiredMsg = t("createListing.validation.cityRequired");
  const photoRequiredMsg = t("createListing.validation.photoRequired");
  const photoLimitMsg = t("createListing.validation.photoLimit");

  if (createdListingId) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:mt-8 sm:rounded-[22px] sm:p-8">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-slate-800 dark:text-emerald-400">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-slate-100">
            {vertical === "CARGO"
              ? t("cargo.companySubmitted")
              : t("createListing.submittedForModeration")}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t("createListing.moderationNote")}
          </p>
          <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button
              asChild
              className={cn("h-12 flex-1 rounded-xl sm:min-w-[10rem] sm:flex-none", theme.primaryButton)}
            >
              <Link href={`/listings/${createdListingId}`}>
                {t("createListing.openListing")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 flex-1 rounded-xl border-slate-200 dark:border-slate-700 sm:min-w-[10rem] sm:flex-none"
            >
              <Link href="/account/listings">{t("createListing.myListings")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 flex-1 rounded-xl border-slate-200 dark:border-slate-700 sm:min-w-[10rem] sm:flex-none"
            >
              <Link href={`/listings/new?vertical=${vertical}`}>
                {t("createListing.postAnother")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!chooserDone || !vertical) {
    return (
      <CreateListingVerticalChooser
        onSelect={(nextVertical) => {
          handleVerticalChange(nextVertical);
          setChooserDone(true);
          if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("vertical", nextVertical);
            window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}`);
          }
        }}
      />
    );
  }

  const submitLabel = isSubmitting
    ? mode === "edit"
      ? t("createListing.saving")
      : t("createListing.publishing")
    : mode === "edit"
      ? t("createListing.saveChanges")
      : t("createListing.publish");

  const submitDisabled = isSubmitting || imageUrls.length === 0;

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="mt-4 pb-24 sm:mt-6 sm:pb-0 lg:mt-8"
    >
      <p className="mb-3 overflow-x-auto whitespace-nowrap text-xs font-medium text-slate-500 sm:hidden dark:text-slate-400">
        {t("createListing.progress")}
      </p>

      <div className="grid gap-4 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-4 sm:space-y-6">
          {mode === "create" ? (
            <ListingPostAsSelector
              hasCompanyProfile={Boolean(companyProfile?.isConfigured)}
              companyName={companyProfile?.companyName ?? null}
              postedAsCompany={postedAsCompany}
              onChange={setPostedAsCompany}
            />
          ) : null}

          {(clientError || errors.form.length > 0) && (
            <div
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              role="alert"
            >
              {clientError ? <p>{clientError}</p> : null}
              {errors.form.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          )}

          <FormSection
            dense
            title={
              vertical === "CARGO"
                ? t("cargo.addCompanyButton")
                : vertical === "SERVICES"
                  ? t("services.formSectionTitle")
                  : vertical === "OPT"
                    ? t("opt.formSectionTitle")
                    : t("createListing.whatSelling")
            }
            description={
              vertical === "CARGO"
                ? t("cargo.addCompanyDescription")
                : vertical === "SERVICES"
                  ? t("services.formDescriptionHint")
                  : t("createListing.sections.main")
            }
          >
            <div className="space-y-2">
              <label
                htmlFor="listing-title"
                className="text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                {vertical === "CARGO"
                  ? t("cargo.form.companyName")
                  : formConfig.titleLabel}
              </label>
              <Input
                id="listing-title"
                name="title"
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={
                  vertical === "CARGO"
                    ? t("cargo.form.companyName")
                    : formConfig.titlePlaceholder
                }
                disabled={isSubmitting}
                className={fieldInputClass(Boolean(titleError))}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {vertical === "CARGO"
                  ? t("cargo.form.companyDescription")
                  : formConfig.titleHint}
              </p>
              <FieldError message={titleError} />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="listing-vertical"
                className="text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                {t("createListing.verticalLabel")}
              </label>
              <Select
                value={vertical}
                onValueChange={(value) => handleVerticalChange(value as ListingVertical)}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="listing-vertical"
                  className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VERTICAL_LIST.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {t(VERTICAL_LABEL_KEY[item.id])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CategoryPicker
              categories={categoriesForVertical}
              value={categoryId}
              onChange={setCategoryId}
              disabled={isSubmitting}
              label={
                vertical === "SERVICES"
                  ? t("services.formCategory")
                  : vertical === "CARGO"
                    ? t("cargo.form.serviceType")
                    : t("filters.category")
              }
              error={
                categoryError ||
                (clientError === categoryRequiredMsg ? clientError : undefined)
              }
            />

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

          <FormSection dense title={t("createListing.sections.photos")}>
            <ListingImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              disabled={isSubmitting}
              error={
                imageError ||
                (clientError === photoRequiredMsg || clientError === photoLimitMsg
                  ? clientError
                  : undefined)
              }
            />
          </FormSection>

          <FormSection
            dense
            title={formConfig.priceSectionTitle}
            description={formConfig.priceSectionDescription}
          >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="listing-price"
                  className="text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  {vertical === "CARGO"
                    ? t("cargo.form.servicePrice")
                    : formConfig.priceLabel}
                </label>
                <Input
                  id="listing-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  inputMode="decimal"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="250"
                  disabled={isSubmitting}
                  className={fieldInputClass(Boolean(priceError))}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">{formConfig.priceHint}</p>
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
                "grid gap-4 sm:gap-5",
                formConfig.showMoq ? "sm:grid-cols-2" : "sm:grid-cols-1",
              )}
            >
              {formConfig.showMoq ? (
                <div className="space-y-2">
                  <label
                    htmlFor="listing-moq"
                    className="text-sm font-medium text-slate-900 dark:text-slate-100"
                  >
                    {formConfig.moqLabel}
                  </label>
                  <Input
                    id="listing-moq"
                    name="moq"
                    type="number"
                    min="1"
                    required
                    inputMode="numeric"
                    value={moq}
                    onChange={(event) => setMoq(event.target.value)}
                    placeholder={formConfig.moqPlaceholder}
                    disabled={isSubmitting}
                    className={fieldInputClass(Boolean(moqError))}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formConfig.moqHint}</p>
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

            {formConfig.showStock ? (
              <div className="space-y-2">
                <label
                  htmlFor="listing-stock"
                  className="text-sm font-medium text-slate-900 dark:text-slate-100"
                >
                  {formConfig.stockLabel}
                </label>
                <Input
                  id="listing-stock"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={stockQuantity}
                  onChange={(event) => setStockQuantity(event.target.value)}
                  placeholder={formConfig.stockPlaceholder}
                  disabled={isSubmitting}
                  className={fieldInputClass(false)}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">{formConfig.stockHint}</p>
              </div>
            ) : null}
          </FormSection>

          <FormSection
            dense
            title={t("createListing.sections.location")}
            description={formConfig.locationSectionDescription}
            className={openPickerId === "city" ? "relative z-40" : undefined}
          >
            <OptionPicker
              pickerId="city"
              openPickerId={openPickerId}
              onOpenPickerChange={setOpenPickerId}
              label={
                vertical === "CARGO" ? t("cargo.form.cityOffice") : "Город"
              }
              value={cityId}
              onChange={setCityId}
              options={cities}
              placeholder="Выберите город"
              searchable
              disabled={isSubmitting}
              error={cityError || (clientError === cityRequiredMsg ? clientError : undefined)}
            />
          </FormSection>

          <FormSection
            dense
            title={
              vertical === "SERVICES"
                ? t("services.formTitle")
                : vertical === "CARGO"
                  ? t("cargo.form.companyDescription")
                  : t("createListing.sections.description")
            }
            description={
              vertical === "SERVICES"
                ? t("services.formDescriptionHint")
                : vertical === "CARGO"
                  ? t("cargo.form.companyDescription")
                  : formConfig.descriptionSectionDescription
            }
          >
            <div className="space-y-2">
              <label
                htmlFor="listing-description"
                className="text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                {vertical === "SERVICES"
                  ? t("services.formTitle")
                  : vertical === "CARGO"
                    ? t("cargo.form.companyDescription")
                    : t("createListing.sections.description")}
              </label>
              <Textarea
                id="listing-description"
                name="description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={
                  vertical === "CARGO"
                    ? t("cargo.form.companyDescription")
                    : formConfig.descriptionPlaceholder
                }
                className={cn(
                  "min-h-[140px] w-full resize-y rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:min-h-[160px]",
                  descriptionError && "border-red-200 focus-visible:ring-red-200",
                )}
                disabled={isSubmitting}
              />
              {vertical === "SERVICES" || vertical === "CARGO" ? (
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {vertical === "CARGO"
                    ? t("cargo.form.companyDescription")
                    : t("services.formDescriptionHint")}
                </p>
              ) : (
                <ul className="hidden text-xs leading-relaxed text-slate-500 sm:block dark:text-slate-400">
                  {formConfig.descriptionTips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              )}
              <FieldError message={descriptionError} />
            </div>
          </FormSection>

          <FormSection dense title={t("createListing.sections.publish")}>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("createListing.reviewBeforePublish")}
              </p>
              <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {t("createListing.summaryTitle")}
                  </dt>
                  <dd className="line-clamp-1 text-right font-medium">
                    {title.trim() || t("createListing.summaryNoTitle")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {t("createListing.verticalLabel")}
                  </dt>
                  <dd className="line-clamp-1 text-right font-medium">
                    {t(VERTICAL_LABEL_KEY[vertical])}
                    {" · "}
                    {categoryLabel || t("createListing.summaryNoCategory")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {t("createListing.sections.price")}
                  </dt>
                  <dd className="font-medium">
                    {price.trim() ? `${price} ${currency}` : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {t("createListing.sections.location")}
                  </dt>
                  <dd className="font-medium">
                    {cityLabel || t("createListing.summaryNoCity")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {t("createListing.sections.photos")}
                  </dt>
                  <dd className="font-medium">
                    {imageUrls.length} {t("createListing.summaryPhotos")}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="hidden sm:block">
              <Button
                type="submit"
                disabled={submitDisabled}
                className={cn("h-12 w-full rounded-xl text-base", theme.primaryButton)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    {submitLabel}
                  </>
                ) : (
                  submitLabel
                )}
              </Button>
              <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
                {mode === "edit"
                  ? t("createListing.editModerationNote")
                  : t("createListing.moderationNote")}
              </p>
              <div className="mt-4 text-center">
                <Link
                  href={cancelHref}
                  className="text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
                >
                  {t("createListing.cancel")}
                </Link>
              </div>
            </div>

            <div className="sm:hidden">
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                {mode === "edit"
                  ? t("createListing.editModerationNote")
                  : t("createListing.moderationNote")}
              </p>
              <div className="mt-3 text-center">
                <Link
                  href={cancelHref}
                  className="text-sm font-medium text-slate-500 dark:text-slate-400"
                >
                  {t("createListing.cancel")}
                </Link>
              </div>
            </div>
          </FormSection>
        </div>

        <NewListingSidebar {...sidebarPreview} className="hidden lg:block" />
      </div>

      {/* Sticky submit above bottom nav on mobile */}
      <div
        className="fixed inset-x-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:hidden"
        style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
      >
        <Button
          type="submit"
          disabled={submitDisabled}
          className={cn("h-12 w-full rounded-xl text-base", theme.primaryButton)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {submitLabel}
            </>
          ) : (
            submitLabel
          )}
        </Button>
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
  const theme = getVerticalTheme(null);

  return (
    <EmptyState
      title={title}
      description={description}
      className="mt-8 rounded-[22px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      action={
        actionHref && actionLabel ? (
          <Button asChild className={cn("h-11 rounded-xl", theme.primaryButton)}>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : null
      }
    />
  );
}
