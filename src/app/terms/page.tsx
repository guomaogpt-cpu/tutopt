import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalPageUpdateNote } from "@/components/legal/LegalPageUpdateNote";
import { LegalSection } from "@/components/legal/LegalSection";
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
    <LegalPageShell
      eyebrow="Правовая информация"
      title="Пользовательское соглашение"
      description="Условия использования приложения и сайта «ВсеТут»."
    >
      <LegalPageUpdateNote />

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
        Используя «ВсеТут», вы соглашаетесь с настоящими условиями. Если вы не согласны с правилами,
        пожалуйста, не используйте Сервис.
      </p>

      <LegalSection title="1. Что такое ВсеТут">
        <p>
          «ВсеТут» — платформа объявлений, услуг, оптовых предложений и карго-заявок в Кыргызстане.
          Сервис доступен через сайт и мобильное приложение.
        </p>
      </LegalSection>

      <LegalSection title="2. Роль платформы">
        <p>
          ВсеТут предоставляет площадку для размещения информации и связи между пользователями.
          Платформа <strong>не является стороной сделок</strong> между покупателями и продавцами и
          не несёт ответственности за качество товаров, услуг, условия оплаты и расчёты вне Сервиса.
        </p>
      </LegalSection>

      <LegalSection title="3. Обязанности пользователя">
        <ul className="list-disc space-y-2 pl-5">
          <li>размещать достоверную информацию в объявлениях;</li>
          <li>соблюдать законодательство Кыргызской Республики;</li>
          <li>не публиковать запрещённый контент;</li>
          <li>не нарушать права третьих лиц (авторские права, товарные знаки и т.д.);</li>
          <li>бережно относиться к другим пользователям.</li>
        </ul>
        <p className="mt-3">
          Пользователь самостоятельно отвечает за содержание своих объявлений, заявок и сообщений.
        </p>
      </LegalSection>

      <LegalSection title="4. Запрещённый контент">
        <p>Запрещено размещать объявления и материалы о:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>незаконных товарах и услугах;</li>
          <li>оружии и боеприпасах;</li>
          <li>наркотиках и запрещённых веществах;</li>
          <li>поддельных документах;</li>
          <li>мошеннических предложениях;</li>
          <li>экстремистском, оскорбительном и ином запрещённом контенте;</li>
          <li>товарах и услугах, нарушающих закон или права третьих лиц.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Модерация и жалобы">
        <p>
          Объявления могут проходить модерацию перед публикацией. Администрация вправе отклонить,
          скрыть или удалить контент, ограничить или заблокировать аккаунт при нарушении правил.
        </p>
        <p>
          На странице объявления доступна функция «Пожаловаться» для сообщения о нарушениях. Жалобы
          рассматриваются модераторами.
        </p>
      </LegalSection>

      <LegalSection title="6. Заявки между пользователями">
        <p>
          Через Сервис покупатель может отправить заявку продавцу по объявлению. Платформа
          передаёт контактные данные и сообщение продавцу объявления. Дальнейшие договорённости
          пользователи заключают самостоятельно — ВсеТут не гарантирует исполнение сделки.
        </p>
      </LegalSection>

      <LegalSection title="7. Карго-заявки">
        <p>
          Раздел карго предназначен для заявок на перевозку и логистику. Пользователь несёт
          ответственность за достоверность указанных данных. Платформа не гарантирует исполнение
          перевозки и не является перевозчиком, если иное не указано явно.
        </p>
      </LegalSection>

      <LegalSection title="8. AI-описания объявлений">
        <p>
          Функция генерации описания с помощью AI помогает составить черновик текста. Пользователь
          обязан проверить описание перед публикацией и несёт ответственность за его
          достоверность и соответствие закону.
        </p>
      </LegalSection>

      <LegalSection title="9. Блокировка и удаление аккаунта">
        <p>
          При нарушении правил доступ к аккаунту может быть ограничен или прекращён. Запрос на
          удаление аккаунта — через{" "}
          <Link href="/delete-account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            страницу удаления аккаунта
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="10. Изменение правил">
        <p>
          Мы можем обновлять настоящее соглашение. Актуальная версия всегда доступна на этой
          странице. Продолжая использовать Сервис после обновления, вы соглашаетесь с новой
          версией правил.
        </p>
      </LegalSection>

      <LegalSection title="11. Контакты">
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
            страницу поддержки
          </Link>{" "}
          и{" "}
          <Link href="/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            политику конфиденциальности
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
