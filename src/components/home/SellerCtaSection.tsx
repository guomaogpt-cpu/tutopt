import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function SellerCtaSection() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-blue-100">
              Для продавцов
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Разместите оптовое объявление
            </h2>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              Покажите свой ассортимент оптовым покупателям по всей стране. Бесплатная публикация,
              модерация и прямые заявки от заинтересованных клиентов.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/listings/new"
                className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 sm:w-auto"
              >
                Разместить объявление
              </Link>
              <Link
                href="/sellers"
                className="w-full rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10 sm:w-auto"
              >
                Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
