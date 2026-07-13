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
      <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
        <Container size="md" className="max-w-[1100px] min-w-0">
          <nav aria-label="Хлебные крошки" className="text-sm text-[#64748B]">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition hover:text-[#2563EB]">
                  Главная
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-[#334155]">Новое объявление</li>
            </ol>
          </nav>

          <PageHeader className="mt-4 pb-0">
            <PageHeaderContent>
              <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Подать объявление</PageTitle>
              <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
                Добавьте товар, который хотите продавать оптом
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
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="md" className="max-w-[1100px] min-w-0">
        <nav aria-label="Хлебные крошки" className="text-sm text-[#64748B]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-[#2563EB]">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/seller/dashboard" className="transition hover:text-[#2563EB]">
                Кабинет продавца
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="line-clamp-1 font-medium text-[#334155]">Новое объявление</li>
          </ol>
        </nav>

        <PageHeader className="mt-4 pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">Подать объявление</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Добавьте товар, который хотите продавать оптом
            </PageSubtitle>
          </PageHeaderContent>
        </PageHeader>

        {categories.length === 0 || cities.length === 0 ? (
          <div className="mt-8 rounded-[22px] border border-[#FDE68A] bg-[#FFFBEB] p-6 text-sm text-[#92400E]">
            Для создания объявления нужны категории и города в базе. Запустите{" "}
            <code className="rounded bg-[#FEF3C7] px-1">npm run db:seed</code>.
          </div>
        ) : (
          <NewListingForm
            categories={categories}
            cities={cities.map((item) => ({ id: item.id, label: item.name }))}
            brands={brands.map((item) => ({ id: item.id, label: item.name }))}
          />
        )}
      </Container>
    </main>
  );
}
