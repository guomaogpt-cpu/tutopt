"use client";

import Link from "next/link";
import { ChevronRight, FileText, LifeBuoy, Shield, Trash2 } from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type ServiceLink = {
  href: string;
  labelKey: DictionaryKey;
  icon: typeof LifeBuoy;
};

const LINKS: ServiceLink[] = [
  { href: "/support", labelKey: "account.serviceSupport", icon: LifeBuoy },
  { href: "/privacy", labelKey: "account.servicePrivacy", icon: Shield },
  { href: "/terms", labelKey: "account.serviceTerms", icon: FileText },
  { href: "/account/delete", labelKey: "account.deleteAccount", icon: Trash2 },
];

export function AccountServiceLinks() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="account-service-links">
      <h2
        id="account-service-links"
        className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        {t("account.serviceSection")}
      </h2>
      <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {LINKS.map((link, index) => {
          const Icon = link.icon;
          return (
            <li
              key={link.href}
              className={cn(index > 0 && "border-t border-slate-100 dark:border-slate-800")}
            >
              <Link
                href={link.href}
                className="flex min-h-[3rem] items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60"
              >
                <Icon className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="flex-1">{t(link.labelKey)}</span>
                <ChevronRight className="size-4 shrink-0 text-slate-300 dark:text-slate-600" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
