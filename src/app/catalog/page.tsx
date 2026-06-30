import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { catalogListings } from "@/components/public/mock-data";

export default function CatalogPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Каталог"
          title="Оптовые объявления"
          description="Все опубликованные предложения от проверенных и новых поставщиков. Данные показаны в демо-режиме."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalogListings.map((listing) => (
            <article
              key={listing.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
                Фото товара
              </div>

              <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                {listing.category}
              </p>
              <h2 className="mt-2 text-base font-semibold text-slate-900">
                <Link
                  href={`/listing/${listing.slug}`}
                  className="transition hover:text-blue-600"
                >
                  {listing.title}
                </Link>
              </h2>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Цена</dt>
                  <dd className="font-semibold text-slate-900">
                    {listing.price} сом / {listing.unit}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Мин. партия</dt>
                  <dd className="font-medium text-slate-700">
                    {listing.moq} {listing.unit}
                  </dd>
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
    </main>
  );
}
