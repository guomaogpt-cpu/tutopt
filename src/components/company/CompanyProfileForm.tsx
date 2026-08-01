"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { CompanyType } from "@prisma/client";
import {
  CompanyRequestError,
  submitCompanyVerificationRequest,
  upsertCompanyProfileRequest,
} from "@/features/company/lib/company-client";
import type { CompanyProfileSummary } from "@/features/company/lib/company-profile";
import { COMPANY_TYPES } from "@/features/company/lib/company-profile";
import { CompanyVerificationBadge } from "@/components/company/CompanyVerificationBadge";
import { uploadListingImageRequest } from "@/features/listings/lib/upload-client";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";
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

type CityOption = { id: string; label: string };

type CompanyProfileFormProps = {
  initial: CompanyProfileSummary | null;
  cities: CityOption[];
  defaultPhone: string;
  publicHref: string | null;
  isCargoType: boolean;
};

const TYPE_LABEL_KEY: Record<CompanyType, DictionaryKey> = {
  STORE: "company.types.store",
  SUPPLIER: "company.types.supplier",
  SERVICE: "company.types.service",
  CARGO: "company.types.cargo",
  OTHER: "company.types.other",
};

export function CompanyProfileForm({
  initial,
  cities,
  defaultPhone,
  publicHref,
  isCargoType,
}: CompanyProfileFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState(initial?.companyName ?? "");
  const [companyType, setCompanyType] = useState<CompanyType | "">(
    initial?.companyType ?? "",
  );
  const [cityId, setCityId] = useState(initial?.cityId ?? "");
  const [phone, setPhone] = useState(initial?.contactPhone || defaultPhone);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const isEdit = Boolean(initial?.isConfigured);
  const verificationStatus = initial?.verificationStatus ?? "UNVERIFIED";
  const canSubmitVerification =
    isEdit &&
    (verificationStatus === "UNVERIFIED" || verificationStatus === "REJECTED");

  async function handleSubmitVerification() {
    setFormError("");
    setVerificationMessage("");
    setIsSubmittingVerification(true);
    try {
      await submitCompanyVerificationRequest();
      setVerificationMessage(t("company.verification.submitted"));
      router.refresh();
    } catch (error) {
      if (error instanceof CompanyRequestError) {
        setFormError(error.formErrors.form[0] ?? t("company.saveError"));
      } else {
        setFormError(t("company.saveError"));
      }
    } finally {
      setIsSubmittingVerification(false);
    }
  }

  async function handleLogoChange(file: File | null) {
    if (!file) {
      return;
    }
    setIsUploading(true);
    setFormError("");
    try {
      const uploaded = await uploadListingImageRequest(file);
      setLogoUrl(uploaded.url);
    } catch {
      setFormError(t("company.logoUploadError"));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    setSaved(false);

    if (!companyType) {
      setFieldErrors({ company_type: t("company.typeRequired") });
      return;
    }

    setIsSubmitting(true);
    try {
      await upsertCompanyProfileRequest({
        name: name.trim(),
        company_type: companyType,
        city_id: cityId || null,
        phone: phone.trim(),
        description: description.trim() || null,
        website: website.trim() || null,
        logo_url: logoUrl || null,
      });
      setSaved(true);
      router.refresh();
    } catch (error) {
      if (error instanceof CompanyRequestError) {
        setFormError(error.formErrors.form[0] ?? t("company.saveError"));
        setFieldErrors(error.formErrors.fields);
      } else {
        setFormError(t("company.saveError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("company.name")}
        </label>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        {fieldErrors.name ? (
          <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("company.type")}
        </label>
        <Select
          value={companyType || undefined}
          onValueChange={(value) => setCompanyType(value as CompanyType)}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <SelectValue placeholder={t("company.type")} />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(TYPE_LABEL_KEY[type])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.company_type ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            {fieldErrors.company_type}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("company.city")}
        </label>
        <Select
          value={cityId || undefined}
          onValueChange={(value) => setCityId(value)}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <SelectValue placeholder={t("company.city")} />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("company.phone")}
        </label>
        <Input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          className="h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        {fieldErrors.phone ? (
          <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.phone}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("company.description")}
        </label>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={5}
          className="w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("company.website")}
        </label>
        <Input
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="https://"
          className="h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {t("company.logo")}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative size-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
            {logoUrl ? (
              <Image src={logoUrl} alt="" fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                —
              </div>
            )}
          </div>
          <label
            className={cn(
              "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700",
              "dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200",
              "sm:w-auto",
            )}
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {t("company.logo")}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={isUploading || isSubmitting}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                void handleLogoChange(file);
                event.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {formError ? (
        <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
      ) : null}
      {saved ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{t("company.saved")}</p>
      ) : null}

      <div className="flex flex-col gap-3 pb-20 sm:flex-row sm:pb-0">
        <Button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="h-12 w-full rounded-xl sm:h-11 sm:flex-1"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isEdit ? t("company.save") : t("company.create")}
        </Button>
        {publicHref ? (
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:h-11 sm:w-auto"
          >
            <Link href={publicHref}>{t("company.publicProfile")}</Link>
          </Button>
        ) : null}
      </div>

      {(isCargoType || companyType === "CARGO") && isEdit ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="font-medium text-slate-800 dark:text-slate-100">
            {t("company.types.cargo")}
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/seller/cargo-requests"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("seller.viewCargoRequests")}
            </Link>
            <Link
              href="/seller/cargo-settings"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("cargo.settings.title")}
            </Link>
            <Link
              href="/listings/new?vertical=cargo"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("post.cargoCompany")}
            </Link>
          </div>
        </div>
      ) : null}

      {isEdit ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("company.verification.status")}
            </p>
            <CompanyVerificationBadge status={verificationStatus} showOwnerStatus />
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t("company.verification.submitDescription")}
          </p>
          {canSubmitVerification ? (
            <Button
              type="button"
              variant="outline"
              disabled={isSubmittingVerification}
              onClick={() => void handleSubmitVerification()}
              className="mt-3 h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-auto"
            >
              {isSubmittingVerification ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {t("company.verification.submit")}
            </Button>
          ) : null}
          {verificationMessage ? (
            <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
              {verificationMessage}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
