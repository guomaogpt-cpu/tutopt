import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";

export default function SellersPage() {
  return (
    <main className="bg-white py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <PublicPageHeader
            eyebrow="Продавцы и исполнители"
            title="Каталог продавцов скоро"
            description="Пока вы можете найти поставщиков, продавцов, исполнителей и перевозчиков через объявления в каталоге или открыть профиль со страницы объявления."
          />

          <Link
            href="/listings"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Перейти в каталог
          </Link>
        </div>
      </Container>
    </main>
  );
}
