import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    step: 1,
    title: "Найдите товар",
    description: "Воспользуйтесь поиском и категориями, чтобы найти нужные оптовые предложения.",
  },
  {
    step: 2,
    title: "Свяжитесь с поставщиком",
    description: "Откройте объявление и напишите продавцу напрямую.",
  },
  {
    step: 3,
    title: "Договоритесь напрямую",
    description: "Согласуйте цену, объём и условия поставки без посредников.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
      <Container>
        <SectionHeading align="center" title="Как это работает" />

        <ol className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
