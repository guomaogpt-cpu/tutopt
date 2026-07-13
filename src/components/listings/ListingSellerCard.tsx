import Link from "next/link";
import { BadgeCheck, Building2 } from "lucide-react";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const displayName = companyName.trim() || sellerName;

  return (
    <div
      className={cn(
        "rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-6",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-14 shrink-0">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
          <AvatarFallback className="bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full text-[11px]">
              Поставщик
            </Badge>
            {isVerified ? (
              <Badge variant="secondary" className="gap-1 rounded-full text-[11px]">
                <BadgeCheck className="size-3.5" aria-hidden="true" />
                Проверен
              </Badge>
            ) : null}
          </div>

          <h2 className="mt-2 text-base font-semibold text-[#0F172A]">{displayName}</h2>

          {companyName.trim() && companyName !== sellerName ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#64748B]">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{sellerName}</span>
            </p>
          ) : null}
        </div>
      </div>

      <dl className="mt-4 space-y-2 border-t border-[rgba(148,163,184,0.14)] pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#64748B]">Объявлений</dt>
          <dd className="font-medium text-[#0F172A]">{publishedListingCount}</dd>
        </div>
        {sellerCity ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Город</dt>
            <dd className="font-medium text-[#0F172A]">{sellerCity}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-[#64748B]">На платформе с</dt>
          <dd className="font-medium text-[#0F172A]">{formatListingDate(sellerSince)}</dd>
        </div>
      </dl>

      <Button
        variant="outline"
        className="mt-4 h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)]"
        asChild
      >
        <Link href={`/seller/${sellerId}`}>Все товары продавца</Link>
      </Button>
    </div>
  );
}
