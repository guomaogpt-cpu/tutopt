import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SearchWithSuggest } from "@/components/search/SearchWithSuggest";
import { VerticalCards } from "@/components/verticals/VerticalCards";

export function HomeVerticalsSection() {
  return (
    <section
      data-home-section="verticals"
      className="overflow-x-clip bg-[#F5F7FA] pb-2 pt-4 sm:pt-5"
      aria-labelledby="home-verticals-heading"
    >
      <Container size="lg">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div className="min-w-0 max-w-xl">
            <h2
              id="home-verticals-heading"
              className="text-lg font-bold tracking-tight text-[#0F172A] sm:text-xl"
            >
              Выберите, что вы ищете
            </h2>
            <p className="mt-1 text-sm leading-snug text-[#64748B]">
              Опт, объявления, услуги и логистика — в понятных разделах платформы.
            </p>
          </div>

          <div className="w-full min-w-0 lg:max-w-[420px]">
            <SearchWithSuggest
              id="home-entry-search"
              variant="header"
              placeholder="Что вы ищете?"
              buttonLabel="Найти"
            />
          </div>
        </div>

        <VerticalCards
          className="mt-3.5 sm:mt-4"
          variant="compact"
          trackingSource="homepage"
        />

        <div className="mt-3 flex justify-center sm:mt-3.5">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            Смотреть все категории
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
