import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import type { VerticalDefinition } from "@/features/verticals/verticals";

type VerticalStubPageProps = {
  vertical: VerticalDefinition;
};

export function VerticalStubPage({ vertical }: VerticalStubPageProps) {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Направление"
          title={vertical.label}
          description={vertical.description}
        />

        <div className="mt-8 max-w-xl space-y-4 text-base leading-relaxed text-slate-600">
          {vertical.comingSoon ? (
            <p>Раздел готовится к запуску.</p>
          ) : (
            <p>Каталог оптовых объявлений доступен уже сейчас.</p>
          )}

          <p>
            <Link
              href={vertical.listingsHref}
              className="font-medium text-[#2563EB] underline-offset-4 hover:underline"
            >
              Открыть объявления {vertical.label}
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
