import { Container } from "@/components/layout/Container";
import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <Container className="py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-600">
            Оптовая торговля · Кыргызстан
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Оптовые объявления для бизнеса
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            B2B платформа оптовых объявлений Кыргызстана. Находите поставщиков, сравнивайте
            условия и связывайтесь напрямую — без корзины и онлайн-оплаты.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <SearchBar />
          <p className="mt-4 text-center text-sm text-slate-500">
            Популярное: цемент, рис, упаковка, хозтовары
          </p>
        </div>
      </Container>
    </section>
  );
}
