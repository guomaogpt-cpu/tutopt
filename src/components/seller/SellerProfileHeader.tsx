import Image from "next/image";
import { BadgeCheck, Building2 } from "lucide-react";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import type { SellerProfileData } from "@/features/sellers/lib/seller-profile-data";

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
    <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={profile.company_name}
              fill
              unoptimized
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50 text-xl font-bold text-blue-700">
              {getInitials(profile.company_name)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              Поставщик
            </span>
            {profile.is_verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Проверен
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {profile.company_name}
          </h1>

          {profile.user.name !== profile.company_name ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
              <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{profile.user.name}</span>
            </p>
          ) : null}

          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {locationLabel ? (
              <div>
                <dt className="sr-only">Город</dt>
                <dd>{locationLabel}</dd>
              </div>
            ) : null}
            <div>
              <dt className="sr-only">На платформе с</dt>
              <dd>На платформе с {formatListingDate(profile.created_at)}</dd>
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
        </div>
      </div>

      {profile.description ? (
        <p className="mt-6 border-t border-slate-100 pt-6 text-base leading-relaxed text-slate-600">
          {profile.description}
        </p>
      ) : null}
    </header>
  );
}
