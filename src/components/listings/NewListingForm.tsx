"use client";

import Link from "next/link";
import type { ListingStatus, ListingUnit, ListingVertical } from "@prisma/client";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useDeferredValue, type FormEvent } from "react";
import { CategoryPicker } from "@/components/listings/CategoryPicker";
import { CreateListingSteps } from "@/components/listings/CreateListingSteps";
import { CreateListingVerticalChooser } from "@/components/listings/CreateListingVerticalChooser";
import { ListingFormDraftBanner } from "@/components/listings/ListingFormDraftBanner";
import { GenerateListingDescriptionButton } from "@/components/listings/GenerateListingDescriptionButton";
import { ListingAutosuggestCard } from "@/components/listings/ListingAutosuggestCard";
import { ListingCharacteristicsFields } from "@/components/listings/ListingCharacteristicsFields";
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
import {
  GenerateDescriptionRequestError,
  generateListingDescriptionRequest,
} from "@/features/listings/lib/generate-description-client";
import {
  characteristicValuesToPairs,
  characteristicValuesToPersisted,
  characteristicValuesToText,
  hydrateCharacteristicValues,
  mergeCharacteristicValuesForFields,
  type CharacteristicValuesState,
} from "@/features/listings/lib/listing-characteristics";
import {
  clearListingFormDraft,
  LISTING_FORM_DRAFT_DEBOUNCE_MS,
  LISTING_FORM_DRAFT_VERSION,
  listingFormDraftHasContent,
  readListingFormDraft,
  writeListingFormDraft,
  type ListingFormDraft,
} from "@/features/listings/lib/listing-form-draft";
import { mergeListingDescriptionParts } from "@/features/listings/lib/merge-listing-description";
import { getVerticalFormConfig } from "@/features/listings/lib/vertical-form-config";
import type { CategoryItem } from "@/features/listings/types/category";
import type { ListingCharacteristic } from "@/features/listings/types/listing-characteristic";
import type { CreateListingInput } from "@/features/listings/validators/listing.validators";
import { resolveListingCharacteristicFields } from "@/config/listing-characteristics";
import {
  applyCharacteristicSuggestions,
  buildAutosuggestDismissKey,
  getListingSuggestions,
  type SuggestedCategory,
  type SuggestedCharacteristic,
} from "@/lib/listings/listing-autosuggest";
import { useMobileFormBackGuard } from "@/hooks/use-mobile-form-back-guard";
import { mobileStickyBottomOffset } from "@/lib/mobile/mobile-viewport";
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
  aiEnabled?: boolean;
  draftUserId?: string;
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
  characteristics?: ListingCharacteristic[];
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
  aiEnabled = false,
  draftUserId,
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
  const [characteristicValues, setCharacteristicValues] =
    useState<CharacteristicValuesState>({});
  const [priceNegotiable, setPriceNegotiable] = useState(
    Boolean(initialValues && Number(initialValues.price) === 0),
  );
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [aiError, setAiError] = useState("");
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
  const [dismissedAutosuggestKeys, setDismissedAutosuggestKeys] = useState<string[]>([]);
  const [storedDraft, setStoredDraft] = useState<ListingFormDraft | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const draftLoadedRef = useRef(false);
  const pendingCharacteristicSuggestionsRef = useRef<SuggestedCharacteristic[] | null>(
    null,
  );
  const hasHydratedCharacteristicsRef = useRef(false);
  const deferredTitle = useDeferredValue(title);

  const categoriesForVertical = useMemo(
    () => categories.filter((category) => category.vertical === vertical),
    [categories, vertical],
  );

  const categoryLabel = useMemo(
    () => categories.find((category) => category.id === categoryId)?.name ?? "",
    [categories, categoryId],
  );

  const categoryPathLabel = useMemo(() => {
    if (!categoryId) {
      return "";
    }
    const path: string[] = [];
    const byId = new Map(categories.map((item) => [item.id, item]));
    let current = byId.get(categoryId);
    while (current) {
      path.unshift(current.name);
      current = current.parent_id ? byId.get(current.parent_id) : undefined;
    }
    return path.join(" → ");
  }, [categories, categoryId]);

  const categorySlug = useMemo(
    () => categories.find((category) => category.id === categoryId)?.slug ?? "",
    [categories, categoryId],
  );

  const characteristicFields = useMemo(
    () =>
      vertical && categoryId
        ? resolveListingCharacteristicFields(vertical, categorySlug)
        : [],
    [vertical, categoryId, categorySlug],
  );

  const characteristicFieldsSignature = useMemo(
    () => characteristicFields.map((field) => `${field.id}:${field.group}`).join("|"),
    [characteristicFields],
  );

  const characteristicPairs = useMemo(
    () => characteristicValuesToPairs(characteristicFields, characteristicValues),
    [characteristicFields, characteristicValues],
  );

  const characteristicsText = useMemo(
    () => characteristicValuesToText(characteristicFields, characteristicValues),
    [characteristicFields, characteristicValues],
  );

  useEffect(() => {
    setCharacteristicValues((previous) => {
      let next = mergeCharacteristicValuesForFields(characteristicFields, previous);

      const pending = pendingCharacteristicSuggestionsRef.current;
      if (pending && pending.length > 0) {
        next = applyCharacteristicSuggestions(next, pending);
        pendingCharacteristicSuggestionsRef.current = null;
      } else if (
        !hasHydratedCharacteristicsRef.current &&
        mode === "edit" &&
        characteristicFields.length > 0 &&
        (initialValues?.characteristics?.length ?? 0) > 0
      ) {
        next = hydrateCharacteristicValues(
          characteristicFields,
          initialValues?.characteristics ?? [],
        );
        hasHydratedCharacteristicsRef.current = true;
      }

      return next;
    });
  }, [characteristicFieldsSignature, characteristicFields, mode, initialValues?.characteristics]);

  useEffect(() => {
    if (mode !== "create" || !draftUserId || draftLoadedRef.current) {
      return;
    }

    draftLoadedRef.current = true;
    const draft = readListingFormDraft(draftUserId);
    if (draft && listingFormDraftHasContent(draft)) {
      setStoredDraft(draft);
      setShowDraftBanner(true);
    }
  }, [draftUserId, mode]);

  useEffect(() => {
    if (
      mode !== "create" ||
      !draftUserId ||
      !vertical ||
      showDraftBanner ||
      isSubmitting ||
      createdListingId
    ) {
      return;
    }

    const hasDraftContent = Boolean(
      title.trim() ||
        description.trim() ||
        categoryId ||
        cityId ||
        price.trim() ||
        imageUrls.length > 0,
    );

    if (!hasDraftContent) {
      return;
    }

    const timer = window.setTimeout(() => {
      writeListingFormDraft(draftUserId, {
        version: LISTING_FORM_DRAFT_VERSION,
        savedAt: new Date().toISOString(),
        vertical,
        categoryId,
        title,
        description,
        price,
        currency,
        moq,
        unit,
        cityId,
        brandId,
        stockQuantity,
        priceNegotiable,
        postedAsCompany,
        imageUrls: imageUrls.filter(
          (url) =>
            url.startsWith("/api/uploads/listings/") || url.startsWith("/uploads/listings/"),
        ),
        characteristicValues,
        dismissedAutosuggestKeys,
      });
    }, LISTING_FORM_DRAFT_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    mode,
    draftUserId,
    vertical,
    showDraftBanner,
    isSubmitting,
    createdListingId,
    categoryId,
    title,
    description,
    price,
    currency,
    moq,
    unit,
    cityId,
    brandId,
    stockQuantity,
    priceNegotiable,
    postedAsCompany,
    imageUrls,
    characteristicValues,
    dismissedAutosuggestKeys,
  ]);

  function restoreListingDraft() {
    if (!storedDraft) {
      return;
    }

    setVertical(storedDraft.vertical);
    setCategoryId(storedDraft.categoryId);
    setTitle(storedDraft.title);
    setDescription(storedDraft.description);
    setPrice(storedDraft.price);
    setCurrency(storedDraft.currency);
    setMoq(storedDraft.moq);
    setUnit(storedDraft.unit);
    setCityId(storedDraft.cityId);
    setBrandId(storedDraft.brandId);
    setStockQuantity(storedDraft.stockQuantity);
    setPriceNegotiable(storedDraft.priceNegotiable);
    setPostedAsCompany(storedDraft.postedAsCompany);
    setImageUrls(storedDraft.imageUrls);
    setCharacteristicValues(storedDraft.characteristicValues);
    setDismissedAutosuggestKeys(storedDraft.dismissedAutosuggestKeys);
    setShowDraftBanner(false);
    setStoredDraft(null);
    setChooserDone(true);
  }

  function dismissListingDraft() {
    if (draftUserId) {
      clearListingFormDraft(draftUserId);
    }
    setShowDraftBanner(false);
    setStoredDraft(null);
  }

  const persistedCharacteristics = useMemo(
    () => characteristicValuesToPersisted(characteristicFields, characteristicValues),
    [characteristicFields, characteristicValues],
  );

  const previewCharacteristics = useMemo(() => {
    const items = [...persistedCharacteristics];
    const pathParts = categoryPathLabel
      .split(" → ")
      .map((part) => part.trim())
      .filter(Boolean);
    if (
      pathParts.length >= 2 &&
      !items.some((item) => item.id === "subcategory")
    ) {
      items.unshift({
        id: "subcategory",
        label: "Подкатегория",
        value: pathParts[pathParts.length - 1] ?? "",
        group: "main",
      });
    }
    return items;
  }, [persistedCharacteristics, categoryPathLabel]);

  const listingSuggestions = useMemo(() => {
    if (!vertical || mode === "edit") {
      return null;
    }
    return getListingSuggestions({
      vertical,
      title: deferredTitle,
      categories,
      currentCategoryId: categoryId || null,
      currentCategorySlug: categorySlug || null,
    });
  }, [vertical, mode, deferredTitle, categories, categoryId, categorySlug]);

  const primaryCategorySuggestion = listingSuggestions?.suggestedCategories[0] ?? null;

  const categoryDismissKey = primaryCategorySuggestion
    ? buildAutosuggestDismissKey({
        title: deferredTitle,
        categoryId: "",
        kind: "category",
        payload: primaryCategorySuggestion.categoryId,
      })
    : "";

  const actionableCharacteristicSuggestions = useMemo(() => {
    const items = listingSuggestions?.suggestedCharacteristics ?? [];
    if (items.length === 0) {
      return [];
    }
    if (!categoryId) {
      return items;
    }
    return items.filter((item) => {
      const current = characteristicValues[item.fieldId];
      if (!current) {
        return true;
      }
      if (current.kind === "text") {
        return !current.text.trim();
      }
      if (current.kind === "single") {
        return !current.optionId;
      }
      if (current.kind === "multi") {
        return current.optionIds.length === 0;
      }
      return current.enabled === null;
    });
  }, [listingSuggestions, categoryId, characteristicValues]);

  const characteristicsDismissKey =
    actionableCharacteristicSuggestions.length > 0
      ? buildAutosuggestDismissKey({
          title: deferredTitle,
          categoryId: categoryId || primaryCategorySuggestion?.categoryId || "",
          kind: "characteristics",
          payload: actionableCharacteristicSuggestions.map((item) => item.fieldId).join(","),
        })
      : "";

  const showCategorySuggestion = Boolean(
    primaryCategorySuggestion &&
      categoryDismissKey &&
      !dismissedAutosuggestKeys.includes(categoryDismissKey),
  );

  const showCharacteristicSuggestion = Boolean(
    actionableCharacteristicSuggestions.length > 0 &&
      characteristicsDismissKey &&
      !dismissedAutosuggestKeys.includes(characteristicsDismissKey),
  );

  function dismissAutosuggest(key: string) {
    if (!key) {
      return;
    }
    setDismissedAutosuggestKeys((prev) =>
      prev.includes(key) ? prev : [...prev, key].slice(-40),
    );
  }

  function handleChooseSuggestedCategory(suggestion: SuggestedCategory) {
    setCategoryId(suggestion.categoryId);
    dismissAutosuggest(categoryDismissKey);
  }

  function handleApplySuggestedCharacteristics() {
    if (actionableCharacteristicSuggestions.length === 0) {
      return;
    }

    if (!categoryId && primaryCategorySuggestion) {
      pendingCharacteristicSuggestionsRef.current = [
        ...actionableCharacteristicSuggestions,
      ];
      setCategoryId(primaryCategorySuggestion.categoryId);
      dismissAutosuggest(categoryDismissKey);
      dismissAutosuggest(characteristicsDismissKey);
      return;
    }

    setCharacteristicValues((prev) =>
      applyCharacteristicSuggestions(prev, actionableCharacteristicSuggestions),
    );
    dismissAutosuggest(characteristicsDismissKey);
  }

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

  useMobileFormBackGuard({
    enabled: mode === "create" && isDirty && !isSubmitting && !createdListingId,
    message: t("listingForm.unsavedExitConfirm"),
  });

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

  const canGenerateDescription =
    title.trim().length >= 3 &&
    (Boolean(categoryLabel.trim()) || characteristicPairs.length > 0);

  const activeStep =
    !categoryId
      ? "category"
      : !title.trim() || !cityId || imageUrls.length === 0
        ? "details"
        : !description.trim() && characteristicPairs.length === 0
          ? "description"
          : "preview";

  async function handleGenerateDescription() {
    if (!vertical || isGeneratingDescription || !canGenerateDescription) {
      return;
    }

    setAiError("");
    setAiHint("");
    setIsGeneratingDescription(true);
    try {
      const generated = await generateListingDescriptionRequest({
        vertical,
        category: categoryPathLabel || categoryLabel || null,
        title: title.trim(),
        price: priceNegotiable ? null : price.trim() || null,
        currency: priceNegotiable ? null : currency,
        city: cityLabel || null,
        characteristics: characteristicsText || null,
        characteristicItems: characteristicPairs,
        currentDescription: description.trim() || null,
        unit: formConfig.unitOptions.find((option) => option.value === unit)?.label ?? unit,
        moq: formConfig.showMoq ? moq : null,
        condition: null,
      });
      if (!description.trim()) {
        setDescription(generated);
        setAiHint(t("listingForm.reviewDescriptionHint"));
      } else {
        setAiHint(t("listingForm.aiKeptExistingDescription"));
      }
    } catch (error) {
      if (error instanceof GenerateDescriptionRequestError) {
        setAiError(error.message);
      } else {
        setAiError(t("listingForm.aiGenerateError"));
      }
    } finally {
      setIsGeneratingDescription(false);
    }
  }

  const qualityInput: ListingQualityInput = {
    title,
    description: mergeListingDescriptionParts(description, characteristicsText),
    price: priceNegotiable ? "0" : price,
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

    const priceValue = priceNegotiable ? 0 : Number(price);
    if (
      !priceNegotiable &&
      (!Number.isFinite(priceValue) || priceValue < 0 || price.trim() === "")
    ) {
      setClientError(t("createListing.validation.invalidPrice"));
      return;
    }

    const resolvedMoq = formConfig.showMoq ? Number(moq) : 1;
    if (!Number.isFinite(resolvedMoq) || resolvedMoq < 1) {
      setClientError(formConfig.showMoq ? "Укажите корректное количество" : "Ошибка формы");
      return;
    }

    const finalDescription = description.trim();
    if (finalDescription.length < 20) {
      setClientError(t("listingForm.descriptionTooShort"));
      return;
    }

    const characteristicsPayload = [...persistedCharacteristics];
    const pathParts = categoryPathLabel
      .split(" → ")
      .map((part) => part.trim())
      .filter(Boolean);
    if (pathParts.length >= 2) {
      const alreadyHasSubcategory = characteristicsPayload.some(
        (item) => item.id === "subcategory",
      );
      if (!alreadyHasSubcategory) {
        characteristicsPayload.unshift({
          id: "subcategory",
          label: "Подкатегория",
          value: pathParts[pathParts.length - 1] ?? "",
          group: "main",
        });
      }
    }

    setIsSubmitting(true);

    try {
      const payload: CreateListingInput = {
        title: title.trim(),
        description: finalDescription,
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
        characteristics:
          characteristicsPayload.length > 0 ? characteristicsPayload : null,
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
      if (draftUserId) {
        clearListingFormDraft(draftUserId);
      }
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
              : vertical === "SERVICES"
                ? t("services.submittedForModeration")
                : vertical === "OPT"
                  ? t("opt.submittedForModeration")
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
                {vertical === "SERVICES"
                  ? t("services.openService")
                  : vertical === "OPT"
                    ? t("opt.openOffer")
                    : t("createListing.openListing")}
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
                {vertical === "SERVICES"
                  ? t("services.postAnotherService")
                  : vertical === "OPT"
                    ? t("opt.postAnotherOffer")
                    : t("createListing.postAnother")}
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
      : t("listingForm.submitForModeration");

  const submitDisabled = isSubmitting || imageUrls.length === 0;

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      autoComplete="off"
      className="mt-4 pb-24 sm:mt-6 sm:pb-0 lg:mt-8"
    >
      {mode === "create" ? <CreateListingSteps activeStep={activeStep} /> : null}

      <div className="grid gap-4 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0 space-y-4 sm:space-y-6">
          {mode === "create" && showDraftBanner && storedDraft ? (
            <ListingFormDraftBanner
              onRestore={restoreListingDraft}
              onDismiss={dismissListingDraft}
            />
          ) : null}
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

            {mode === "create" ? (
              <ListingAutosuggestCard
                categorySuggestion={primaryCategorySuggestion}
                characteristicSuggestions={actionableCharacteristicSuggestions}
                showCategory={showCategorySuggestion}
                showCharacteristics={showCharacteristicSuggestion}
                onChooseCategory={handleChooseSuggestedCategory}
                onApplyCharacteristics={handleApplySuggestedCharacteristics}
                onDismissCategory={() => dismissAutosuggest(categoryDismissKey)}
                onDismissCharacteristics={() =>
                  dismissAutosuggest(characteristicsDismissKey)
                }
                disabled={isSubmitting}
              />
            ) : null}

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
                  required={!priceNegotiable}
                  inputMode="decimal"
                  value={priceNegotiable ? "" : price}
                  onChange={(event) => {
                    setPriceNegotiable(false);
                    setPrice(event.target.value);
                  }}
                  placeholder="250"
                  disabled={isSubmitting || priceNegotiable}
                  className={fieldInputClass(Boolean(priceError))}
                />
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={priceNegotiable}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setPriceNegotiable(checked);
                      if (checked) {
                        setPrice("0");
                      }
                    }}
                    disabled={isSubmitting}
                    className="size-4 rounded border-slate-300"
                  />
                  {t("listingForm.priceNegotiable")}
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formConfig.priceHint}</p>
                <FieldError message={priceError} />
              </div>

              <ChipPicker
                label="Валюта"
                value={currency}
                onChange={setCurrency}
                disabled={isSubmitting || priceNegotiable}
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

            {formConfig.showBrand || formConfig.showStock ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowExtraFields((value) => !value)}
                  className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline dark:text-slate-300"
                >
                  {showExtraFields
                    ? t("listingForm.hideExtra")
                    : t("listingForm.showExtra")}
                </button>
                {showExtraFields ? (
                  <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
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
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formConfig.stockHint}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
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
                vertical === "CARGO"
                  ? t("cargo.form.cityOffice")
                  : vertical === "SERVICES"
                    ? t("services.formCity")
                    : vertical === "OPT"
                      ? t("opt.formCity")
                      : "Город"
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
            title={t("listingForm.description")}
            description={formConfig.descriptionSectionDescription}
          >
            <ListingCharacteristicsFields
              fields={characteristicFields}
              values={characteristicValues}
              onChange={(updater) =>
                setCharacteristicValues((previous) =>
                  typeof updater === "function" ? updater(previous) : updater,
                )
              }
              disabled={isSubmitting}
            />

            <GenerateListingDescriptionButton
              aiEnabled={aiEnabled}
              canGenerate={canGenerateDescription}
              isGenerating={isGeneratingDescription}
              onGenerate={() => void handleGenerateDescription()}
            />
            {aiError ? (
              <p className="text-sm text-red-600 dark:text-red-400">{aiError}</p>
            ) : null}
            {aiHint ? (
              <p className="text-xs text-emerald-700 dark:text-emerald-400">{aiHint}</p>
            ) : null}

            <div className="space-y-2">
              <label
                htmlFor="listing-description"
                className="text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                {t("listingForm.description")}
              </label>
              <Textarea
                id="listing-description"
                name="description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={formConfig.descriptionPlaceholder}
                className={cn(
                  "min-h-[140px] w-full resize-y rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:min-h-[160px]",
                  descriptionError && "border-red-200 focus-visible:ring-red-200",
                )}
                disabled={isSubmitting}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("listingForm.reviewDescriptionHint")}
              </p>
              <FieldError message={descriptionError} />
            </div>
          </FormSection>

          <FormSection dense title={t("listingForm.publishPreview")}>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {t("createListing.reviewBeforePublish")}
              </p>
              {imageUrls[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrls[0]}
                  alt=""
                  className="mt-3 h-28 w-full rounded-xl object-cover"
                />
              ) : null}
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
                    {categoryPathLabel || categoryLabel || t("createListing.summaryNoCategory")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {t("createListing.sections.price")}
                  </dt>
                  <dd className="font-medium">
                    {priceNegotiable
                      ? t("listingForm.priceNegotiable")
                      : price.trim()
                        ? `${price} ${currency}`
                        : "—"}
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
                    {t("listingForm.postAs")}
                  </dt>
                  <dd className="line-clamp-1 text-right font-medium">
                    {postedAsCompany && companyProfile?.isConfigured
                      ? t("listingForm.postAsCompany").replace(
                          "{companyName}",
                          companyProfile.companyName,
                        )
                      : t("listingForm.postAsPersonal")}
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
                {previewCharacteristics.length > 0 ? (
                  <div className="pt-1">
                    <dt className="text-slate-500 dark:text-slate-400">
                      {t("listingCharacteristics.previewTitle")}
                    </dt>
                    <dd className="mt-1 space-y-0.5 text-sm text-slate-700 dark:text-slate-200">
                      {previewCharacteristics.map((item) => (
                        <p key={item.id} className="break-words">
                          {item.label}:{" "}
                          {typeof item.value === "boolean"
                            ? item.value
                              ? "Да"
                              : "Нет"
                            : Array.isArray(item.value)
                              ? item.value.join(", ")
                              : item.unit && !String(item.value).includes(item.unit)
                                ? `${item.value} ${item.unit}`
                                : String(item.value)}
                        </p>
                      ))}
                    </dd>
                  </div>
                ) : null}
                {description.trim() ? (
                  <div className="pt-1">
                    <dt className="text-slate-500 dark:text-slate-400">
                      {t("listingForm.description")}
                    </dt>
                    <dd className="mt-1 line-clamp-3 text-sm text-slate-700 dark:text-slate-200">
                      {description.trim()}
                    </dd>
                  </div>
                ) : null}
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
        style={{ bottom: mobileStickyBottomOffset(5) }}
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
