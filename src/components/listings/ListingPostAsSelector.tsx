"use client";

import Link from "next/link";
import { Building2, User } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useRouteVerticalTheme } from "@/lib/use-route-vertical-theme";
import { cn } from "@/lib/utils";

type ListingPostAsSelectorProps = {
  hasCompanyProfile: boolean;
  companyName: string | null;
  postedAsCompany: boolean;
  onChange: (postedAsCompany: boolean) => void;
};

export function ListingPostAsSelector({
  hasCompanyProfile,
  companyName,
  postedAsCompany,
  onChange,
}: ListingPostAsSelectorProps) {
  const { t } = useTranslation();
  const { theme } = useRouteVerticalTheme();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {t("company.postAs")}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition",
            !postedAsCompany
              ? cn(theme.primaryBorder, theme.softBg, "text-slate-900 dark:text-slate-100")
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300",
          )}
        >
          <User className="size-4 shrink-0" aria-hidden="true" />
          <span>{t("company.postAsPersonal")}</span>
        </button>

        <button
          type="button"
          disabled={!hasCompanyProfile}
          onClick={() => {
            if (hasCompanyProfile) {
              onChange(true);
            }
          }}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition",
            postedAsCompany && hasCompanyProfile
              ? cn(theme.primaryBorder, theme.softBg, "text-slate-900 dark:text-slate-100")
              : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300",
            !hasCompanyProfile && "cursor-not-allowed opacity-60",
          )}
        >
          <Building2 className="size-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">
            {hasCompanyProfile && companyName
              ? t("company.postAsCompany").replace("{companyName}", companyName)
              : t("company.profile")}
          </span>
        </button>
      </div>

      {!hasCompanyProfile ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {t("company.createProfileHint")}
          <br />
          <Link
            href="/account/company"
            className={cn("mt-1 inline-block font-medium hover:underline", theme.softLink)}
          >
            {t("company.createProfile")}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
