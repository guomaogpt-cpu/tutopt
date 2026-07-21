import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { VerticalCards } from "@/components/verticals/VerticalCards";

export function HomeVerticalsSection() {
  return (
    <section
      data-home-section="verticals"
      className="overflow-x-clip bg-[#F5F7FA] pb-1 pt-5 sm:pt-6"
      aria-labelledby="home-verticals-heading"
    >
      <Container size="lg">
        <VerticalCards showTitle trackingSource="homepage" />
        <div className="mt-4 flex justify-center sm:mt-5">
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
