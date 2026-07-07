import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ListingAccessMessage } from "@/components/listings/NewListingForm";
import { SellerLeadsTable } from "@/components/seller/SellerLeadsTable";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl, buildRegisterUrl } from "@/features/auth/lib/login-redirect";
import { getSellerLeads } from "@/features/leads/lib/leads-data";
import { prisma } from "@/shared/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";

export const dynamic = "force-dynamic";

export default async function SellerLeadsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/seller/leads"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="bg-background py-10 sm:py-14">
        <Container size="lg">
          <PageHeader>
            <PageHeaderContent>
              <PageTitle className="text-2xl sm:text-3xl">Заявки</PageTitle>
            </PageHeaderContent>
          </PageHeader>
          <ListingAccessMessage
            title="Раздел доступен только продавцам"
            description="Зарегистрируйтесь с типом аккаунта «Продавец» или войдите в аккаунт продавца."
            actionHref={buildRegisterUrl({ role: "SELLER", returnPath: "/seller/leads" })}
            actionLabel="Стать продавцом"
          />
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
    <main className="bg-background py-10 sm:py-14">
      <Container size="lg">
        <PageHeader>
          <PageHeaderContent>
            <Badge variant="secondary" className="w-fit">
              Продавец
            </Badge>
            <PageTitle className="text-2xl sm:text-3xl">Заявки</PageTitle>
            <PageSubtitle className="text-sm sm:text-base">
              {sellerProfile
                ? `Входящие заявки по объявлениям ${sellerProfile.company_name}`
                : "Создайте объявление, чтобы начать получать заявки от покупателей."}
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions>
            <Button variant="outline" asChild>
              <Link href="/seller/dashboard">Кабинет продавца</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <Section spacing="none" className="mt-8">
          <SellerLeadsTable leads={leads} />
        </Section>
      </Container>
    </main>
  );
}
