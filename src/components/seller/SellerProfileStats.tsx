import type { ListingVertical } from "@prisma/client";
import {
  getSellerVerticalBrandLabel,
  type SellerVerticalCounts,
} from "@/features/sellers/lib/seller-vertical-profile";

type SellerProfileStatsProps = {
  publishedListingCount: number;
  sellerVerticals: ListingVertical[];
  verticalCounts: SellerVerticalCounts;
  onPlatformSinceLabel: string;
};

type StatCard = {
  label: string;
  value: string;
};

export function SellerProfileStats({
  publishedListingCount,
  sellerVerticals,
  verticalCounts,
  onPlatformSinceLabel,
}: SellerProfileStatsProps) {
  const cards: StatCard[] = [
    { label: "Активные объявления", value: String(publishedListingCount) },
    { label: "Направления", value: String(sellerVerticals.length) },
    { label: "На платформе с", value: onPlatformSinceLabel },
    ...sellerVerticals.map((vertical) => ({
      label: getSellerVerticalBrandLabel(vertical),
      value: String(verticalCounts[vertical]),
    })),
  ];

  return (
    <section aria-label="Статистика продавца" className="min-w-0">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <li
            key={card.label}
            className="min-w-0 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white px-4 py-3 shadow-sm"
          >
            <p className="truncate text-xs font-medium uppercase tracking-wide text-[#94A3B8]">
              {card.label}
            </p>
            <p className="mt-1 truncate text-lg font-bold text-[#0F172A]">{card.value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
