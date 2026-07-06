import Link from "next/link";
import {
  Car,
  FlaskConical,
  Hammer,
  Package,
  Shirt,
  Sofa,
  Sparkles,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { getCategoriesPageData } from "@/features/home/lib/categories-page-data";

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

const CATEGORY_ICON_RULES: { match: RegExp; icon: LucideIcon }[] = [
  { match: /авто|запчаст/i, icon: Car },
  { match: /строит|цемент/i, icon: Hammer },
  { match: /продукт|питан/i, icon: UtensilsCrossed },
  { match: /одежд|текстил/i, icon: Shirt },
  { match: /мебел/i, icon: Sofa },
  { match: /электрон/i, icon: Sparkles },
  { match: /хими|бытов/i, icon: FlaskConical },
  { match: /сель|сельхоз/i, icon: Wheat },
];

function getCategoryIcon(name: string, slug: string): LucideIcon {
  for (const rule of CATEGORY_ICON_RULES) {
    if (rule.match.test(name) || rule.match.test(slug)) {
      return rule.icon;
    }
  }

  return Package;
}

function formatListingsCount(count: number): string {
  if (count === 0) {
    return "Пока нет объявлений";
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} объявление`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} объявления`;
  }

  return `${count} объявлений`;
}

export default async function CategoriesPage() {
  const categories = await getCategoriesPageData();

  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Навигация"
          title="Категории"
          description="Выберите направление оптовых закупок и перейдите в каталог."
        />

        {categories.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <p className="text-base font-medium text-slate-900">Категории пока не добавлены</p>
            <Link
              href="/listings"
              className={`mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 ${focusRingClassName}`}
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name, category.slug);

              return (
                <Link
                  key={category.id}
                  href={`/listings?category=${encodeURIComponent(category.id)}`}
                  className={`group flex h-full min-h-[148px] flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:bg-blue-50/20 ${focusRingClassName}`}
                >
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h2 className="mt-4 line-clamp-2 text-lg font-semibold text-slate-900 transition group-hover:text-blue-700">
                    {category.name}
                  </h2>
                  <p className="mt-auto pt-3 text-sm text-slate-500">
                    {formatListingsCount(category.listingsCount)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}
