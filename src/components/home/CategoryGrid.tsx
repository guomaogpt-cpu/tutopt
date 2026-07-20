import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { HomeCategoryCard } from "@/features/home/lib/home-data";
import { cn } from "@/lib/utils";
import { CategoryCarouselCard } from "@/components/home/CategoryCarouselCard";

const HOME_CATEGORIES_DISPLAY_LIMIT = 8;

type CategoryGridProps = {
  categories: HomeCategoryCard[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const visibleCategories = categories.slice(0, HOME_CATEGORIES_DISPLAY_LIMIT);

  return (
    <section
      data-home-section="categories"
      className="overflow-x-clip bg-[#F5F7FA] py-8 sm:py-9"
      id="categories"
    >
      <Container size="lg">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl">
              Популярные категории
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
              Начните с популярных разделов или используйте поиск.
            </p>
          </div>
          <Button
            variant="outline"
            className={cn(
              "h-10 shrink-0 rounded-xl border-[rgba(148,163,184,0.22)] bg-white px-3.5 text-sm font-semibold text-[#2563EB] shadow-none",
              "hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] hover:text-[#1D4ED8]",
            )}
            asChild
          >
            <Link href="/listings">
              Все категории
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {visibleCategories.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[rgba(148,163,184,0.35)] bg-[rgba(255,255,255,0.58)] px-4 py-5 text-center text-sm text-[#64748B] backdrop-blur-[14px]">
            Категории пока не добавлены.
            <div className="mt-3">
              <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]" size="sm" asChild>
                <Link href="/listings">Перейти в каталог</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-[#F5F7FA] to-transparent sm:w-7"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-[#F5F7FA] to-transparent sm:w-7"
              aria-hidden="true"
            />

            <div
              className={cn(
                "flex gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth sm:gap-4",
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {visibleCategories.map((category) => (
                <CategoryCarouselCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
