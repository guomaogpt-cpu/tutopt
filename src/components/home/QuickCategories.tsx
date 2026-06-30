import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { quickCategories } from "./mock-data";

export function QuickCategories() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Категории"
          title="Быстрый выбор направления"
          description="Переходите в нужную категорию и смотрите актуальные оптовые предложения."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {quickCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
            >
              <span className="text-2xl" aria-hidden="true">
                {category.icon}
              </span>
              <p className="mt-4 text-sm font-semibold leading-snug text-slate-900 group-hover:text-blue-600 sm:text-base">
                {category.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/catalog"
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            Смотреть весь каталог →
          </Link>
        </div>
      </Container>
    </section>
  );
}
