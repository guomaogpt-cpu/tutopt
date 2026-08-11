import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalPageUpdateNote } from "@/components/legal/LegalPageUpdateNote";
import { LegalSection } from "@/components/legal/LegalSection";
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
    <LegalPageShell
      eyebrow="Правовая информация"
      title="Политика конфиденциальности"
      description="Приложение и сайт «ВсеТут» — объявления, услуги, опт и карго в Кыргызстане."
    >
      <LegalPageUpdateNote />

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
        Настоящий документ описывает, какие данные обрабатываются при использовании мобильного
        приложения и веб-сервиса «ВсеТут» (далее — «Сервис»).
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

      <LegalSection title="2. Какие данные мы собираем">
        <ul className="list-disc space-y-2 pl-5">
          <li>данные аккаунта: номер телефона, имя или название профиля;</li>
          <li>email — если используется вход через Google или указан в профиле;</li>
          <li>данные объявлений: название, описание, цена, категория, характеристики;</li>
          <li>фотографии объявлений, загруженные пользователем;</li>
          <li>город, который пользователь указывает самостоятельно (без GPS-трекинга);</li>
          <li>заявки по объявлениям: контактные данные и текст сообщения;</li>
          <li>карго-заявки и связанные поля (контакты, описание груза, фото при необходимости);</li>
          <li>жалобы на объявления и обращения в поддержку;</li>
          <li>технические данные: IP-адрес, cookies/session, журналы безопасности и ошибок.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Зачем используются данные">
        <ul className="list-disc space-y-2 pl-5">
          <li>регистрация, вход и управление аккаунтом;</li>
          <li>публикация и модерация объявлений;</li>
          <li>связь между покупателем и продавцом через заявки;</li>
          <li>обработка карго-заявок;</li>
          <li>безопасность, предотвращение злоупотреблений и спама;</li>
          <li>уведомления о событиях в аккаунте (в приложении и на сайте);</li>
          <li>поддержка пользователей.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Кто видит данные">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Опубликованные объявления</strong> видны всем посетителям Сервиса: название,
            описание, цена, фото, город, данные продавца или компании в объявлении.
          </li>
          <li>
            <strong>Заявка по объявлению</strong> доступна продавцу этого объявления и
            авторизованному покупателю, отправившему заявку.
          </li>
          <li>
            <strong>Администраторы и модераторы</strong> могут видеть данные для модерации,
            обработки жалоб и поддержки.
          </li>
          <li>
            Мы <strong>не продаём</strong> персональные данные пользователей третьим лицам.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Искусственный интеллект (AI)">
        <p>
          Если вы нажимаете кнопку генерации описания объявления, введённые вами данные объявления
          (например, название, категория, характеристики, город) могут отправляться AI-провайдеру для
          формирования текста описания.
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
          Сервис размещён на облачной инфраструктуре. Данные могут обрабатываться на серверах за
          пределами вашего устройства для обеспечения работы приложения.
        </p>
        <p>
          Передача возможна только для работы Сервиса (хостинг, AI по запросу пользователя) или если
          этого требует закон.
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
            удаления аккаунта
          </Link>
          . Запрос будет рассмотрен поддержкой. После обработки профиль и связанные данные могут
          быть удалены или обезличены.
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
    </LegalPageShell>
  );
}
