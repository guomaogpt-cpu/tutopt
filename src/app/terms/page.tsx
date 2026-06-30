import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function TermsPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Правовая информация"
          title="Пользовательское соглашение"
          description="Условия использования платформы Tutopt для покупателей и продавцов."
        />

        <div className="mt-10 max-w-3xl space-y-6 text-sm leading-relaxed text-slate-600 sm:text-base">
          <p>
            Используя Tutopt, вы соглашаетесь с правилами платформы. Полный юридический текст будет
            опубликован перед публичным запуском.
          </p>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Роль платформы</h2>
            <p className="mt-3">
              Tutopt предоставляет площадку для размещения оптовых объявлений и не является стороной
              сделок между покупателями и продавцами.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Обязанности пользователей</h2>
            <p className="mt-3">
              Пользователи обязуются размещать достоверную информацию, соблюдать законодательство КР
              и не публиковать запрещённый контент.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Модерация</h2>
            <p className="mt-3">
              Администрация вправе отклонять, скрывать или удалять объявления, нарушающие правила
              платформы.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
