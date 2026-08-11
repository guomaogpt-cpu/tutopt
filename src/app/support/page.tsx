import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalPageUpdateNote } from "@/components/legal/LegalPageUpdateNote";
import { LegalSection } from "@/components/legal/LegalSection";
import { buildPageMetadata } from "@/shared/seo/seo.config";
import { getSupportEmail, getSupportMailtoHref } from "@/shared/config/support";

export const metadata: Metadata = buildPageMetadata({
  title: "Поддержка — ВсеТут",
  description: "Как связаться с поддержкой ВсеТут по вопросам аккаунта, объявлений и заявок.",
  path: "/support",
});

const SUPPORT_TOPICS = [
  {
    title: "Вопрос по аккаунту",
    description: "Вход, регистрация, смена данных, блокировка, удаление аккаунта.",
    subject: "ВсеТут — вопрос по аккаунту",
  },
  {
    title: "Проблема с объявлением",
    description: "Модерация, публикация, редактирование, скрытие или восстановление объявления.",
    subject: "ВсеТут — проблема с объявлением",
  },
  {
    title: "Жалоба на объявление",
    description:
      "Сообщите о нарушении правил. Также можно нажать «Пожаловаться» на странице объявления.",
    subject: "ВсеТут — жалоба на объявление",
  },
  {
    title: "Удаление аккаунта",
    description: "Запрос на удаление через кабинет или письмо в поддержку.",
    subject: "ВсеТут — удаление аккаунта",
  },
  {
    title: "Ошибка в приложении",
    description: "Сбой, некорректное отображение, проблема с загрузкой фото или формой.",
    subject: "ВсеТут — ошибка в приложении",
  },
] as const;

export default function SupportPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPageShell
      eyebrow="Помощь"
      title="Поддержка ВсеТут"
      description="Если у вас вопрос по аккаунту, объявлению, заявке или жалобе, свяжитесь с поддержкой."
    >
      <LegalPageUpdateNote />

      <LegalSection title="Контакты">
        <p>
          Email поддержки:{" "}
          <a
            href={getSupportMailtoHref("ВсеТут — обращение в поддержку")}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {supportEmail}
          </a>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Укажите в письме телефон или email аккаунта и опишите проблему. Запрос будет рассмотрен
          поддержкой.
        </p>
      </LegalSection>

      <LegalSection title="С чем поможем">
        <ul className="space-y-4">
          {SUPPORT_TOPICS.map((topic) => (
            <li
              key={topic.title}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="font-semibold text-slate-900 dark:text-slate-100">{topic.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {topic.description}
              </p>
              <a
                href={getSupportMailtoHref(topic.subject)}
                className="mt-2 inline-flex min-h-10 items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Написать в поддержку →
              </a>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Удаление аккаунта">
        <p>
          Если вы авторизованы — откройте{" "}
          <Link href="/account/delete" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            удаление в кабинете
          </Link>
          . Если войти не получается — см.{" "}
          <Link href="/delete-account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            инструкцию по удалению
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
