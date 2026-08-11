import type { Metadata } from "next";
import { DeleteAccountPublicInstructions } from "@/components/account/DeleteAccountPublicInstructions";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { LegalPageUpdateNote } from "@/components/legal/LegalPageUpdateNote";
import { buildPageMetadata } from "@/shared/seo/seo.config";

export const metadata: Metadata = buildPageMetadata({
  title: "Удаление аккаунта — ВсеТут",
  description:
    "Как запросить удаление аккаунта ВсеТут через приложение или обращение в поддержку.",
  path: "/delete-account",
});

export default function DeleteAccountPublicPage() {
  return (
    <LegalPageShell
      eyebrow="Аккаунт"
      title="Удаление аккаунта ВсеТут"
      description="Как запросить удаление аккаунта через кабинет или поддержку. Страница доступна без входа."
    >
      <LegalPageUpdateNote />
      <DeleteAccountPublicInstructions loginNextPath="/account/delete" />
    </LegalPageShell>
  );
}
