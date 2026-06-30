import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { audienceSegments } from "./mock-data";

export function ForWhomSection() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Аудитория"
          title="Для кого Tutopt"
          description="Платформа создана для B2B-закупок: без розничной витрины и без онлайн-оплаты."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:gap-6">
          {audienceSegments.map((segment) => (
            <article
              key={segment.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <span className="text-3xl" aria-hidden="true">
                {segment.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{segment.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {segment.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
