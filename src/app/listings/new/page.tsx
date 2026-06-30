import Link from "next/link";
import { UserRole } from "@prisma/client";
import { Container } from "@/components/layout/Container";
import { ListingAccessMessage, NewListingForm } from "@/components/listings/NewListingForm";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { getCurrentUser } from "@/features/auth/lib/session";
import { prisma } from "@/shared/lib/prisma";

export default async function NewListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="bg-slate-50 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <PublicPageHeader
              eyebrow="Продавцам"
              title="Подать объявление"
              description="Разместите оптовое предложение на платформе Tutopt."
            />
            <ListingAccessMessage
              title="Нужно войти, чтобы подать объявление"
              description="Авторизуйтесь как продавец, чтобы создавать и публиковать оптовые объявления."
              actionHref="/login"
              actionLabel="Войти"
            />
          </div>
        </Container>
      </main>
    );
  }

  if (user.role !== UserRole.SELLER && user.role !== UserRole.ADMIN) {
    return (
      <main className="bg-slate-50 py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <PublicPageHeader
              eyebrow="Продавцам"
              title="Подать объявление"
              description="Разместите оптовое предложение на платформе Tutopt."
            />
            <ListingAccessMessage
              title="Создание объявлений доступно только продавцам"
              description="Зарегистрируйтесь с типом аккаунта «Продавец» или обратитесь в поддержку для смены роли."
              actionHref="/register"
              actionLabel="Регистрация"
            />
          </div>
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
    <main className="bg-slate-50 py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-3xl">
          <PublicPageHeader
            eyebrow="Продавцам"
            title="Подать объявление"
            description="Быстрая публикация оптового предложения — всего несколько минут."
          />

          {categories.length === 0 || cities.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
              Для создания объявления нужны категории и города в базе. Запустите{" "}
              <code className="rounded bg-amber-100 px-1">npm run db:seed</code>.
            </div>
          ) : (
            <NewListingForm
              categories={categories}
              cities={cities.map((item) => ({ id: item.id, label: item.name }))}
              brands={brands.map((item) => ({ id: item.id, label: item.name }))}
            />
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link href="/seller/dashboard" className="text-blue-600 hover:text-blue-700">
              Перейти в кабинет продавца
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
