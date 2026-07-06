import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerLeadsTable } from "@/components/seller/SellerLeadsTable";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getSellerLeads } from "@/features/leads/lib/leads-data";
import { prisma } from "@/shared/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SellerLeadsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/leads"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="bg-slate-50 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-4xl">
            <PublicPageHeader title="Заявки" />
            <ListingAccessMessage
              title="Раздел доступен только продавцам"
              description="Заявки по объявлениям видят только аккаунты с ролью продавца."
            />
          </div>
        </Container>
      </main>
    );
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: { id: true, company_name: true },
  });

  const leads = sellerProfile ? await getSellerLeads(sellerProfile.id) : [];

  return (
    <main className="bg-slate-50 py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <PublicPageHeader
              eyebrow="Продавец"
              title="Заявки"
              description={
                sellerProfile
                  ? `Входящие заявки по объявлениям ${sellerProfile.company_name}`
                  : "Создайте объявление, чтобы начать получать заявки от покупателей."
              }
            />
            <Link
              href="/seller/dashboard"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Кабинет продавца
            </Link>
          </div>

          <div className="mt-10">
            <SellerLeadsTable leads={leads} />
          </div>
        </div>
      </Container>
    </main>
  );
}
