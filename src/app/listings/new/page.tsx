import Link from "next/link";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ListingAccessMessage, NewListingForm } from "@/components/listings/NewListingForm";
import {
  buildLoginUrl,
  buildRegisterUrl,
} from "@/features/auth/lib/login-redirect";
import { getCurrentUser } from "@/features/auth/lib/session";
import { prisma } from "@/shared/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader, PageHeaderContent } from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";

export default async function NewListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/listings/new"));
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="bg-background py-10 sm:py-14">
        <Container size="md">
          <PageHeader>
            <PageHeaderContent>
              <Badge variant="secondary" className="w-fit">
                Продавцам
              </Badge>
              <PageTitle className="text-2xl sm:text-3xl">Подать объявление</PageTitle>
              <PageSubtitle className="text-sm sm:text-base">
                Разместите оптовое предложение на платформе Tutopt.
              </PageSubtitle>
            </PageHeaderContent>
          </PageHeader>

          <ListingAccessMessage
            title="Создание объявлений доступно только продавцам"
            description="Зарегистрируйтесь с типом аккаунта «Продавец» или войдите в аккаунт продавца."
            actionHref={buildRegisterUrl({ role: "SELLER", returnPath: "/listings/new" })}
            actionLabel="Стать продавцом"
          />
        </Container>
      </main>
    );
  }

  const [categories, cities, brands] = await Promise.all([
    prisma.category.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, parent_id: true, icon: true },
    }),
    prisma.city.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
    prisma.brand.findMany({
      where: { is_active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <main className="bg-background py-10 sm:py-14">
      <Container size="md">
        <PageHeader>
          <PageHeaderContent>
            <Badge variant="secondary" className="w-fit">
              Продавцам
            </Badge>
            <PageTitle className="text-2xl sm:text-3xl">Подать объявление</PageTitle>
            <PageSubtitle className="text-sm sm:text-base">
              Быстрая публикация оптового предложения — всего несколько минут.
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        {categories.length === 0 || cities.length === 0 ? (
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-sm text-amber-900">
              Для создания объявления нужны категории и города в базе. Запустите{" "}
              <code className="rounded bg-amber-100 px-1">npm run db:seed</code>.
            </CardContent>
          </Card>
        ) : (
          <NewListingForm
            categories={categories}
            cities={cities.map((item) => ({ id: item.id, label: item.name }))}
            brands={brands.map((item) => ({ id: item.id, label: item.name }))}
          />
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href="/seller/dashboard">Перейти в кабинет продавца</Link>
          </Button>
        </p>
      </Container>
    </main>
  );
}
