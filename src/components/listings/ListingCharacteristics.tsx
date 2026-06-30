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
    <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-slate-900">Характеристики</h2>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-100">
        <dl className="divide-y divide-slate-100">
          {visibleItems.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-1 gap-1 px-4 py-3.5 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6 sm:px-5"
            >
              <dt className="text-sm text-slate-500">{item.label}</dt>
              <dd className="text-sm font-medium text-slate-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
