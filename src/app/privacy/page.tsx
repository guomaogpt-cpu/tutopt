import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function PrivacyPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Правовая информация"
          title="Политика конфиденциальности"
          description="Как ВсеТут собирает, использует и защищает персональные данные пользователей."
        />

        <div className="mt-10 max-w-3xl space-y-6 text-sm leading-relaxed text-slate-600 sm:text-base">
          <p>
            Настоящая политика описывает порядок обработки персональных данных на платформе ВсеТут.
            Полный юридический текст будет опубликован перед публичным запуском.
          </p>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Какие данные мы собираем</h2>
            <p className="mt-3">
              Имя, email, телефон, данные профиля компании и информация об объявлениях, которые вы
              размещаете на платформе.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Как мы используем данные</h2>
            <p className="mt-3">
              Для предоставления сервиса, модерации контента, связи с пользователями и улучшения
              качества платформы.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Защита данных</h2>
            <p className="mt-3">
              Мы применяем технические и организационные меры для защиты персональных данных от
              несанкционированного доступа.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
