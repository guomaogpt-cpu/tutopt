import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2 } from "lucide-react";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";

type ListingSellerCardProps = {
  sellerName: string;
  companyName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  sellerCity: string | null;
  sellerSince: Date;
  publishedListingCount: number;
  sellerId: string;
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

export function ListingSellerCard({
  sellerName,
  companyName,
  avatarUrl,
  isVerified,
  sellerCity,
  sellerSince,
  publishedListingCount,
  sellerId,
}: ListingSellerCardProps) {
  const showCompany = companyName.trim().length > 0 && companyName !== sellerName;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={sellerName}
              fill
              unoptimized
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50 text-sm font-semibold text-blue-700">
              {getInitials(sellerName)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900">{sellerName}</h2>
          {showCompany ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{companyName}</span>
            </p>
          ) : null}
          {isVerified ? (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Проверен
            </span>
          ) : null}
        </div>
      </div>

      <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Объявлений</dt>
          <dd className="font-medium text-slate-900">{publishedListingCount}</dd>
        </div>
        {sellerCity ? (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Город</dt>
            <dd className="font-medium text-slate-900">{sellerCity}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">На платформе с</dt>
          <dd className="font-medium text-slate-900">{formatListingDate(sellerSince)}</dd>
        </div>
      </dl>

      <Link
        href={`/seller/${sellerId}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50/40"
      >
        Все объявления продавца
      </Link>
    </article>
  );
}
