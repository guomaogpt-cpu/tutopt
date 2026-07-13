import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2 } from "lucide-react";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import type { SellerProfileData } from "@/features/sellers/lib/seller-profile-data";
import { cn } from "@/lib/utils";

type SellerProfileHeaderProps = {
  profile: SellerProfileData;
  publishedListingCount: number;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function SellerProfileHeader({
  profile,
  publishedListingCount,
}: SellerProfileHeaderProps) {
  const logoUrl = profile.logo_url ?? profile.user.avatar_url;
  const locationLabel = [profile.city?.name, profile.region?.name].filter(Boolean).join(", ");

  return (
    <header
      className={cn(
        "rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-8",
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[#F1F5F9] sm:size-24">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={profile.company_name}
              fill
              unoptimized
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#EFF6FF] text-xl font-bold text-[#2563EB] sm:text-2xl">
              {getInitials(profile.company_name)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium text-[#475569]">
              Поставщик
            </span>
            {profile.is_verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Проверен
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            {profile.company_name}
          </h1>

          {profile.user.name !== profile.company_name ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#64748B]">
              <Building2 className="size-4 shrink-0" aria-hidden="true" />
              <span>{profile.user.name}</span>
            </p>
          ) : null}

          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748B]">
            {locationLabel ? (
              <div>
                <dt className="sr-only">Город</dt>
                <dd>{locationLabel}</dd>
              </div>
            ) : null}
            <div>
              <dt className="sr-only">На сайте с</dt>
              <dd>На сайте с {formatListingDate(profile.created_at)}</dd>
            </div>
            <div>
              <dt className="sr-only">Объявлений</dt>
              <dd>
                {publishedListingCount}{" "}
                {publishedListingCount === 1
                  ? "объявление"
                  : publishedListingCount < 5
                    ? "объявления"
                    : "объявлений"}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <Link
              href="#seller-listings"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2563EB] px-5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] sm:w-auto"
            >
              Смотреть товары
            </Link>
            <Link
              href="#seller-contacts"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[rgba(148,163,184,0.25)] bg-white px-5 text-sm font-semibold text-[#334155] transition hover:border-[#2563EB]/30 hover:text-[#2563EB] sm:w-auto"
            >
              Связаться
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
