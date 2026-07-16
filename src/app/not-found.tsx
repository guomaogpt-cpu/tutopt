import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-16">
      <Container size="sm" className="text-center">
        <p className="text-sm font-medium text-[#64748B]">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          Страница не найдена
        </h1>
        <p className="mt-3 text-sm text-[#64748B] sm:text-base">
          Возможно, ссылка устарела или страница была удалена.
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button className="h-11 rounded-xl" asChild>
            <Link href="/">На главную</Link>
          </Button>
          <Button variant="outline" className="h-11 rounded-xl" asChild>
            <Link href="/listings">К объявлениям</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
