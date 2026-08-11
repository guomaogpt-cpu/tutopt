import { redirect } from "next/navigation";
import { DeleteAccountForm } from "@/components/account/DeleteAccountForm";
import { Container } from "@/components/ui/container";
import { LegalPageUpdateNote } from "@/components/legal/LegalPageUpdateNote";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Удаление аккаунта",
  "Запрос на удаление аккаунта ВсеТут.",
);

export const dynamic = "force-dynamic";

export default async function AccountDeletePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/account/delete"));
  }

  const userLabel = user.phone || user.email || user.name || "Аккаунт";

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
      <Container size="md" className="max-w-[720px] min-w-0">
        <PublicPageHeader
          eyebrow="Кабинет"
          title="Удаление аккаунта"
          description="Отправьте запрос на удаление. Аккаунт не удаляется автоматически — запрос обрабатывается вручную."
        />

        <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <LegalPageUpdateNote />
          <DeleteAccountForm userLabel={userLabel} />
        </div>
      </Container>
    </main>
  );
}
