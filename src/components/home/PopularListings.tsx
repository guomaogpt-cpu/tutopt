import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { popularListings } from "./mock-data";

export function PopularListings() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Каталог"
            title="Популярные оптовые предложения"
            description="Актуальные объявления от поставщиков с указанием цены и минимальной партии."
          />
          <Link
            href="/catalog"
            className="shrink-0 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Все предложения →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularListings.map((listing) => (
            <article
              key={listing.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
                Фото товара
              </div>

              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-snug text-slate-900">
                  <Link
                    href={`/listing/${listing.slug}`}
                    className="transition hover:text-blue-600"
                  >
                    {listing.title}
                  </Link>
                </h3>
                {listing.verified ? (
                  <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    ✓
                  </span>
                ) : null}
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Цена</dt>
                  <dd className="font-semibold text-slate-900">
                    {listing.price} сом / {listing.unit}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Мин. партия</dt>
                  <dd className="font-medium text-slate-700">{listing.moq} {listing.unit}</dd>
                </div>
              </dl>

              <div className="mt-auto border-t border-slate-100 pt-4">
                <p className="text-sm font-medium text-slate-800">{listing.seller}</p>
                <p className="mt-1 text-xs text-slate-500">{listing.city}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
