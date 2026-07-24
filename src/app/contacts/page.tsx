import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function ContactsPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Связь"
          title="Контакты"
          description="Свяжитесь с командой ВсеТут по вопросам сотрудничества и поддержки."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-blue-600">Email</h2>
            <p className="mt-3 text-base font-medium text-slate-900">hello@tutopt.kg</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-blue-600">Телефон</h2>
            <p className="mt-3 text-base font-medium text-slate-900">+996 (XXX) XX-XX-XX</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:col-span-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-blue-600">Адрес</h2>
            <p className="mt-3 text-base text-slate-700">Бишкек, Кыргызстан</p>
          </article>
        </div>
      </Container>
    </main>
  );
}
