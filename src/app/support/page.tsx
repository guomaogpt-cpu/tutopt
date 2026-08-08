import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { LegalDraftBanner } from "@/components/legal/LegalDraftBanner";
import { LegalSection } from "@/components/legal/LegalSection";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { buildPageMetadata } from "@/shared/seo/seo.config";
import { getSupportEmail, getSupportMailtoHref } from "@/shared/config/support";

export const metadata: Metadata = buildPageMetadata({
  title: "Поддержка — ВсеТут",
  description: "Как связаться с поддержкой ВсеТут по вопросам аккаунта, объявлений и карго.",
  path: "/support",
});

export default function SupportPage() {
  const supportEmail = getSupportEmail();

  return (
    <main className="bg-white py-10 dark:bg-slate-950 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Помощь"
          title="Поддержка"
          description="Свяжитесь с командой ВсеТут по вопросам аккаунта, объявлений и сервиса."
        />

        <div className="mt-8 max-w-3xl space-y-8">
          <LegalDraftBanner />

          <LegalSection title="Email поддержки">
            <p>
              Основной канал связи:{" "}
              <a
                href={getSupportMailtoHref("ВсеТут — обращение в поддержку")}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {supportEmail}
              </a>
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Укажите в письме телефон или email аккаунта и опишите проблему. Мы ответим, когда
              сможем — срок зависит от нагрузки поддержки.
            </p>
          </LegalSection>

          <LegalSection title="Чем можем помочь">
            <ul className="list-disc space-y-2 pl-5">
              <li>вход в аккаунт и восстановление доступа;</li>
              <li>публикация и модерация объявлений;</li>
              <li>жалобы на объявления (также кнопка «Пожаловаться» на странице объявления);</li>
              <li>карго-заявки;</li>
              <li>
                <Link href="/delete-account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  удаление аккаунта
                </Link>
                ;
              </li>
              <li>технические проблемы приложения и сайта.</li>
            </ul>
          </LegalSection>

          <LegalSection title="Удаление аккаунта">
            <p>
              Если вы авторизованы — откройте{" "}
              <Link href="/account/delete" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                удаление в кабинете
              </Link>
              . Если войти не получается — используйте{" "}
              <Link href="/delete-account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                публичную инструкцию
              </Link>{" "}
              или напишите на {supportEmail}.
            </p>
          </LegalSection>

          <LegalSection title="Правовая информация">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <Link href="/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Пользовательское соглашение
                </Link>
              </li>
            </ul>
          </LegalSection>
        </div>
      </Container>
    </main>
  );
}
