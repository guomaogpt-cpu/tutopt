import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function CompanyNotFound() {
  return (
    <main className="flex flex-1 items-center py-16">
      <Container size="sm" className="text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
          Компания не найдена
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Компания не найдена или больше недоступна.
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
