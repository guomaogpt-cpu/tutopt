import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { sellerList } from "@/components/public/mock-data";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function SellersPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Поставщики"
          title="Продавцы"
          description="Оптовые компании и поставщики, размещающие объявления на Tutopt. Данные показаны в демо-режиме."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {sellerList.map((seller) => (
            <article
              key={seller.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700">
                  {seller.name.charAt(0)}
                </div>
                {seller.verified ? (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Проверен
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Новый
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                <Link href={`/seller/${seller.slug}`} className="transition hover:text-blue-600">
                  {seller.name}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-slate-500">{seller.city}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{seller.description}</p>
              <p className="mt-4 text-sm font-medium text-slate-700">
                {seller.listingsCount} активных объявлений
              </p>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
