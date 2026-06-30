import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

const faqItems = [
  {
    question: "Что такое Tutopt?",
    answer:
      "Tutopt — платформа оптовых объявлений для бизнеса в Кыргызстане. Продавцы публикуют предложения, покупатели находят поставщиков и связываются напрямую.",
  },
  {
    question: "Можно ли купить товар на сайте?",
    answer:
      "Нет. Tutopt не является интернет-магазином. Вы отправляете заявку или связываетесь с продавцом, а условия сделки обсуждаются напрямую.",
  },
  {
    question: "Как разместить объявление?",
    answer:
      "Зарегистрируйтесь как продавец, заполните профиль компании и создайте объявление через раздел «Подать объявление». После модерации оно появится в каталоге.",
  },
  {
    question: "Сколько стоит публикация?",
    answer:
      "На этапе MVP публикация объявлений бесплатна. В будущем появятся PRO-тарифы и дополнительные опции продвижения.",
  },
  {
    question: "Как связаться с продавцом?",
    answer:
      "После входа в аккаунт вы увидите контакты продавца и сможете отправить заявку на оптовую закупку.",
  },
];

export default function HelpPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Поддержка"
          title="Помощь"
          description="Ответы на частые вопросы о работе с платформой Tutopt."
        />

        <div className="mt-10 max-w-3xl space-y-4">
          {faqItems.map((item) => (
            <article
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-base font-semibold text-slate-900">{item.question}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
