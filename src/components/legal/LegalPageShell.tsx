import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { PublicPageHeader } from "@/components/public/PublicPageHeader";
import { cn } from "@/lib/utils";

type LegalPageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function LegalPageShell({
  eyebrow,
  title,
  description,
  children,
  className,
}: LegalPageShellProps) {
  return (
    <main className={cn("min-w-0 overflow-x-clip bg-white py-8 dark:bg-slate-950 sm:py-14", className)}>
      <Container>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          ← На главную
        </Link>

        <div className="mt-4">
          <PublicPageHeader eyebrow={eyebrow} title={title} description={description} />
        </div>

        <div className="mt-8 max-w-3xl space-y-8">{children}</div>

        <nav
          aria-label="Правовая информация"
          className="mt-10 max-w-3xl border-t border-slate-200 pt-6 dark:border-slate-800"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Связанные страницы
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <Link href="/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Политика конфиденциальности
              </Link>
            </li>
            <li>
              <Link href="/terms" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Пользовательское соглашение
              </Link>
            </li>
            <li>
              <Link href="/support" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Поддержка
              </Link>
            </li>
            <li>
              <Link href="/delete-account" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Удаление аккаунта
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </main>
  );
}
