import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CategoriesDirectory } from "@/components/categories/CategoriesDirectory";
import { getCategoriesPageData } from "@/features/home/lib/categories-page-data";
import { buildPageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPageMetadata({
  title: "Категории — ВсеТут",
  description: "Категории товаров, услуг, опта и карго в Кыргызстане.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await getCategoriesPageData();

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA] py-8 sm:py-10">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Категории
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              Выберите раздел, чтобы быстрее найти нужные объявления.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 sm:self-auto"
          >
            Все объявления
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <CategoriesDirectory categories={categories} />
      </Container>
    </main>
  );
}
