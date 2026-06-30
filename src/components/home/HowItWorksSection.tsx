import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howItWorksSteps } from "./mock-data";

export function HowItWorksSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-14 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Процесс"
          title="Как это работает"
          description="Три простых шага от поиска поставщика до договорённости об оптовой поставке."
        />

        <ol className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {howItWorksSteps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
