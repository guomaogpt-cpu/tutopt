import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

const faqItems = [
  {
    question: "Что такое ВсеТут?",
    answer:
      "ВсеТут — платформа объявлений, услуг, оптовых предложений и карго в Кыргызстане. Компании и частные лица публикуют предложения, а пользователи находят нужное и связываются напрямую.",
  },
  {
    question: "Можно ли купить товар на сайте?",
    answer:
      "Нет. ВсеТут не является интернет-магазином. Вы отправляете заявку или связываетесь с автором объявления, а условия сделки обсуждаются напрямую.",
  },
  {
    question: "Как разместить объявление?",
    answer:
      "Создайте аккаунт, нажмите «Подать объявление» и выберите тип публикации: объявление, услуга, опт или карго-компания. После модерации оно появится в каталоге.",
  },
  {
    question: "Сколько стоит публикация?",
    answer:
      "На этапе MVP публикация объявлений бесплатна. В будущем появятся PRO-тарифы и дополнительные опции продвижения.",
  },
  {
    question: "Как связаться с автором объявления?",
    answer:
      "После входа в аккаунт вы увидите доступные контакты и сможете отправить заявку.",
  },
];

export default function HelpPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Поддержка"
          title="Помощь"
          description="Ответы на частые вопросы о работе с платформой ВсеТут."
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
