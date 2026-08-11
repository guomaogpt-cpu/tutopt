import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ListingNotFound() {
  return (
    <main className="flex flex-1 items-center py-16">
      <Container size="sm" className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-slate-100">
          Объявление не найдено
        </h1>
        <p className="mt-3 text-sm text-[#64748B] sm:text-base dark:text-slate-400">
          Оно могло быть удалено, скрыто или ещё не опубликовано.
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button className="h-11 rounded-xl" asChild>
            <Link href="/listings">Вернуться к поиску</Link>
          </Button>
          <Button variant="outline" className="h-11 rounded-xl" asChild>
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
