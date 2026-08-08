import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { LegalDraftBanner } from "@/components/legal/LegalDraftBanner";
import { LegalSection } from "@/components/legal/LegalSection";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { buildPageMetadata } from "@/shared/seo/seo.config";
import {
  getSupportEmail,
  getSupportMailtoHref,
  LEGAL_OPERATOR_PLACEHOLDER,
} from "@/shared/config/support";

export const metadata: Metadata = buildPageMetadata({
  title: "Политика конфиденциальности — ВсеТут",
  description:
    "Как приложение и сайт ВсеТут собирают, используют и защищают персональные данные пользователей.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const supportEmail = getSupportEmail();

  return (
    <main className="bg-white py-10 dark:bg-slate-950 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Правовая информация"
          title="Политика конфиденциальности"
          description="Приложение и сайт «ВсеТут» — объявления, услуги, опт и карго в Кыргызстане."
        />

        <div className="mt-8 max-w-3xl space-y-8">
          <LegalDraftBanner />

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Настоящий документ описывает, какие данные могут обрабатываться при использовании
            мобильного приложения и веб-сервиса «ВсеТут» (далее — «Сервис»). Документ является
            черновиком и не заменяет индивидуальную юридическую консультацию.
          </p>

          <LegalSection title="1. Оператор данных">
            <p>{LEGAL_OPERATOR_PLACEHOLDER}</p>
            <p>
              Контакт для вопросов по данным:{" "}
              <a
                href={getSupportMailtoHref("ВсеТут — вопрос по персональным данным")}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {supportEmail}
              </a>
            </p>
          </LegalSection>

          <LegalSection title="2. Какие данные мы можем собирать">
            <ul className="list-disc space-y-2 pl-5">
              <li>номер телефона — для регистрации и входа;</li>
              <li>имя или название профиля;</li>
              <li>email — если используется вход через Google или указан в профиле;</li>
              <li>данные объявлений: название, описание, цена, категория, характеристики;</li>
              <li>фотографии объявлений, загруженные пользователем;</li>
              <li>город или локация, которую пользователь указывает самостоятельно;</li>
              <li>сообщения, заявки и обращения (leads), если пользователь связывается через Сервис;</li>
              <li>карго-заявки и связанные поля (контакты, описание груза, фото при необходимости);</li>
              <li>технические данные: IP-адрес, cookies/session, журналы безопасности и ошибок.</li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Для чего используются данные">
            <ul className="list-disc space-y-2 pl-5">
              <li>регистрация, вход и управление аккаунтом;</li>
              <li>публикация и модерация объявлений;</li>
              <li>связь между пользователями (заявки, сообщения);</li>
              <li>обработка карго-заявок;</li>
              <li>безопасность, предотвращение злоупотреблений и спама;</li>
              <li>уведомления о событиях в аккаунте;</li>
              <li>поддержка пользователей.</li>
            </ul>
          </LegalSection>

          <LegalSection title="4. Push-уведомления">
            <p>
              Мобильное приложение Android может использовать push-token устройства для доставки
              уведомлений о событиях в аккаунте.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                уведомления используются для заявок по объявлениям, статусов модерации, карго-заявок
                и системных событий;
              </li>
              <li>
                push-token хранится на сервере для доставки уведомлений и может быть отключён
                пользователем в настройках приложения или Android;
              </li>
              <li>push-token не используется для продажи данных или рекламных рассылок.</li>
            </ul>
            <p>
              Доставка push осуществляется через Firebase Cloud Messaging (Google). Подробнее см.{" "}
              <Link href="/support" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                страницу поддержки
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="5. Искусственный интеллект (AI)">
            <p>
              Если вы нажимаете кнопку генерации описания объявления, введённые вами данные объявления
              (например, название, категория, характеристики, город) могут отправляться
              AI-провайдеру для формирования текста описания.
            </p>
            <p>
              Не вводите в поля объявления пароли, коды, платёжные реквизиты и другую конфиденциальную
              информацию, не относящуюся к публикации.
            </p>
            <p>
              Сгенерированный текст нужно проверить перед публикацией. Ответственность за содержание
              объявления несёт пользователь.
            </p>
          </LegalSection>

          <LegalSection title="6. Хостинг и передача данных">
            <p>
              Сервис размещён на облачной инфраструктуре (в том числе Railway и связанные
              провайдеры). Данные могут обрабатываться на серверах за пределами вашего устройства для
              обеспечения работы приложения.
            </p>
            <p>
              Мы не продаём персональные данные пользователей. Передача возможна только для работы
              Сервиса (хостинг, AI по запросу пользователя, доставка уведомлений) или если этого
              требует закон.
            </p>
          </LegalSection>

          <LegalSection title="7. Хранение данных">
            <p>
              Данные хранятся, пока аккаунт активен и пока это необходимо для работы Сервиса, защиты
              прав пользователей, выполнения требований закона или разрешения споров.
            </p>
          </LegalSection>

          <LegalSection title="8. Удаление аккаунта">
            <p>
              Вы можете запросить удаление аккаунта через{" "}
              <Link href="/account/delete" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                страницу удаления в кабинете
              </Link>{" "}
              или публичную страницу{" "}
              <Link href="/delete-account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                /delete-account
              </Link>
              . Запрос обрабатывается вручную; автоматическое полное удаление всех связанных данных
              может быть расширено в будущих версиях.
            </p>
          </LegalSection>

          <LegalSection title="9. Безопасность">
            <p>
              Мы используем HTTPS, ограничение доступа и другие технические меры для защиты данных.
              Абсолютная безопасность в интернете не гарантируется — сообщайте о подозрительной
              активности на {supportEmail}.
            </p>
          </LegalSection>

          <LegalSection title="10. Контакты">
            <p>
              Вопросы по политике конфиденциальности:{" "}
              <a
                href={getSupportMailtoHref("ВсеТут — политика конфиденциальности")}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {supportEmail}
              </a>
              . Также см.{" "}
              <Link href="/support" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                страницу поддержки
              </Link>
              .
            </p>
          </LegalSection>
        </div>
      </Container>
    </main>
  );
}
