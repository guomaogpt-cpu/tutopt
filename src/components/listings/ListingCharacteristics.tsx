import { cn } from "@/lib/utils";

export type ListingCharacteristicItem = {
  label: string;
  value: string;
};

type ListingCharacteristicsProps = {
  items: ListingCharacteristicItem[];
};

export function ListingCharacteristics({ items }: ListingCharacteristicsProps) {
  const visibleItems = items.filter((item) => item.value.trim().length > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="listing-characteristics-title">
      <h2
        id="listing-characteristics-title"
        className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl"
      >
        Характеристики
      </h2>

      <div
        className={cn(
          "rounded-[22px] border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-sm sm:p-6",
        )}
      >
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {visibleItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[rgba(148,163,184,0.12)] bg-[#F8FAFC] px-4 py-3"
            >
              <dt className="text-sm text-[#64748B]">{item.label}</dt>
              <dd className="mt-1 text-sm font-medium text-[#0F172A]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
