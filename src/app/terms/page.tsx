import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { LegalDraftBanner } from "@/components/legal/LegalDraftBanner";
import { LegalSection } from "@/components/legal/LegalSection";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { buildPageMetadata } from "@/shared/seo/seo.config";
import { getSupportEmail, getSupportMailtoHref } from "@/shared/config/support";

export const metadata: Metadata = buildPageMetadata({
  title: "Пользовательское соглашение — ВсеТут",
  description: "Условия использования платформы ВсеТут для покупателей и продавцов.",
  path: "/terms",
});

export default function TermsPage() {
  const supportEmail = getSupportEmail();

  return (
    <main className="bg-white py-10 dark:bg-slate-950 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Правовая информация"
          title="Пользовательское соглашение"
          description="Условия использования приложения и сайта «ВсеТут»."
        />

        <div className="mt-8 max-w-3xl space-y-8">
          <LegalDraftBanner />

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Используя «ВсеТут», вы соглашаетесь с настоящими условиями. Документ является черновиком
            и требует юридической проверки перед публикацией в Google Play.
          </p>

          <LegalSection title="1. Что такое ВсеТут">
            <p>
              «ВсеТут» — платформа объявлений, услуг, оптовых предложений и карго-заявок в
              Кыргызстан. Сервис доступен через сайт и мобильное приложение (Capacitor WebView).
            </p>
          </LegalSection>

          <LegalSection title="2. Роль платформы">
            <p>
              ВсеТут предоставляет площадку для размещения информации и связи между пользователями.
              Платформа <strong>не является стороной сделок</strong> между покупателями и продавцами
              и не несёт ответственности за качество товаров, услуг, доставку и расчёты вне Сервиса.
            </p>
          </LegalSection>

          <LegalSection title="3. Обязанности пользователя">
            <ul className="list-disc space-y-2 pl-5">
              <li>размещать достоверную информацию в объявлениях;</li>
              <li>соблюдать законодательство Кыргызской Республики;</li>
              <li>не публиковать запрещённые товары, услуги, мошеннические или спам-материалы;</li>
              <li>не нарушать права третьих лиц (авторские права, товарные знаки и т.д.);</li>
              <li>бережно относиться к другим пользователям.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Запрещённый контент">
            <p>Запрещено размещать объявления о:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>незаконных товарах и услугах;</li>
              <li>оружии, наркотиках и иных запрещённых категориях;</li>
              <li>мошенничестве, фишинге, поддельных документах;</li>
              <li>контенте, нарушающем права и достоинство других лиц.</li>
            </ul>
          </LegalSection>

          <LegalSection title="5. Модерация">
            <p>
              Объявления могут проходить модерацию перед публикацией. Администрация вправе отклонить,
              скрыть или удалить контент, ограничить или заблокировать аккаунт при нарушении правил.
            </p>
            <p>
              На странице объявления доступна функция «Пожаловаться» для сообщения о нарушениях.
            </p>
          </LegalSection>

          <LegalSection title="6. Карго-заявки">
            <p>
              Раздел карго предназначен для заявок на перевозку и логистику. Пользователь несёт
              ответственность за достоверность указанных данных. Платформа не гарантирует исполнение
              перевозки и не является перевозчиком, если иное не указано явно.
            </p>
          </LegalSection>

          <LegalSection title="7. AI-описания объявлений">
            <p>
              Функция генерации описания с помощью AI помогает составить черновик текста. Пользователь
              обязан проверить описание перед публикацией и несёт ответственность за его
              достоверность и соответствие закону.
            </p>
          </LegalSection>

          <LegalSection title="8. Блокировка аккаунта">
            <p>
              При нарушении правил доступ к аккаунту может быть ограничен или прекращён. Запрос на
              удаление аккаунта — через{" "}
              <Link href="/delete-account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                /delete-account
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="9. Контакты">
            <p>
              Поддержка:{" "}
              <a
                href={getSupportMailtoHref("ВсеТут — пользовательское соглашение")}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {supportEmail}
              </a>
              . См. также{" "}
              <Link href="/support" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                /support
              </Link>{" "}
              и{" "}
              <Link href="/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                политику конфиденциальности
              </Link>
              .
            </p>
          </LegalSection>
        </div>
      </Container>
    </main>
  );
}
