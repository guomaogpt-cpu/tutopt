import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

type HeroSectionProps = {
  createListingHref: string;
};

export function HeroSection({ createListingHref }: HeroSectionProps) {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/40 to-white">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Оптовые товары и поставщики Кыргызстана
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Ищите товары оптом, сравнивайте предложения и связывайтесь с поставщиками напрямую.
          </p>
        </div>

        <div className="mx-auto mt-8 w-full max-w-2xl">
          <HomeSearchBar />
        </div>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/listings"
            className={`inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto ${focusRingClassName}`}
          >
            Смотреть каталог
          </Link>
          <Link
            href={createListingHref}
            className={`inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto ${focusRingClassName}`}
          >
            Подать объявление
          </Link>
        </div>
      </Container>
    </section>
  );
}
