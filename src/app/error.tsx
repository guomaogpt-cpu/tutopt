"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center py-16">
      <Container size="sm" className="text-center">
        <p className="text-sm font-medium text-[#64748B]">Ошибка</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
          Что-то пошло не так
        </h1>
        <p className="mt-3 text-sm text-[#64748B] sm:text-base">
          Попробуйте обновить страницу или вернитесь на главную.
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button className="h-11 rounded-xl" onClick={() => reset()}>
            Попробовать снова
          </Button>
          <Button variant="outline" className="h-11 rounded-xl" asChild>
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </Container>
    </main>
  );
}
