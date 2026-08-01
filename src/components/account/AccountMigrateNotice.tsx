import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type AccountMigrateNoticeProps = {
  /** Where the primary CTA goes. Defaults to /account. */
  href?: string;
};

/**
 * Soft notice on legacy buyer/seller dashboards (Phase 87).
 * Does not hard-redirect — old routes stay available.
 */
export function AccountMigrateNotice({ href = "/account" }: AccountMigrateNoticeProps) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Новый личный кабинет доступен по адресу{" "}
          <Link href="/account" className="font-semibold underline">
            /account
          </Link>
          . Старая страница пока работает.
        </p>
        <Button
          asChild
          className="h-10 w-full shrink-0 rounded-xl bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
        >
          <Link href={href}>
            Открыть личный кабинет
            <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
