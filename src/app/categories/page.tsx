import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { categoryList } from "@/components/public/mock-data";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function CategoriesPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Навигация"
          title="Категории"
          description="Выберите направление оптовых закупок. Список категорий показан в демо-режиме."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryList.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {category.icon}
              </span>
              <h2 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                {category.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{category.count} объявлений</p>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
