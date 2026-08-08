import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { DeleteAccountPublicInstructions } from "@/components/account/DeleteAccountPublicInstructions";
import { LegalDraftBanner } from "@/components/legal/LegalDraftBanner";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { buildPageMetadata } from "@/shared/seo/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Удаление аккаунта — ВсеТут",
  description:
    "Как запросить удаление аккаунта ВсеТут через приложение или обращение в поддержку.",
  path: "/delete-account",
});

export default function DeleteAccountPublicPage() {
  return (
    <main className="bg-white py-10 dark:bg-slate-950 sm:py-14">
      <Container>
        <PublicPageHeader
          eyebrow="Аккаунт"
          title="Удаление аккаунта ВсеТут"
          description="Публичная инструкция для пользователей приложения и сайта. Страница доступна без входа."
        />

        <div className="mt-8 max-w-3xl space-y-8">
          <LegalDraftBanner />
          <DeleteAccountPublicInstructions loginNextPath="/account/delete" />
        </div>
      </Container>
    </main>
  );
}
