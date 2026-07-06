import Link from "next/link";

type ListingsEmptyStateProps = {
  hasActiveFilters: boolean;
  createListingHref: string;
};

export function ListingsEmptyState({
  hasActiveFilters,
  createListingHref,
}: ListingsEmptyStateProps) {
  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        📦
      </div>
      <h2 className="mt-5 text-xl font-semibold text-slate-900">Объявления не найдены</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        {hasActiveFilters
          ? "По выбранным фильтрам ничего не найдено. Попробуйте изменить параметры поиска или сбросить фильтры."
          : "Пока нет опубликованных объявлений. Станьте первым продавцом на платформе."}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={createListingHref}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Подать объявление
        </Link>
        {hasActiveFilters ? (
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Сбросить фильтры
          </Link>
        ) : null}
      </div>
    </div>
  );
}
