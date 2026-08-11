"use client";

import Link from "next/link";
import {
  Inbox,
  ListChecks,
  PlusCircle,
  Settings2,
  Truck,
} from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type QuickStartCard = {
  href: string;
  labelKey: DictionaryKey;
  icon: typeof PlusCircle;
  primary?: boolean;
  soft?: boolean;
};

type AccountQuickStartProps = {
  hasListings: boolean;
  hasCompany: boolean;
};

const cardClassName = cn(
  "flex min-h-[4.25rem] flex-col items-start justify-center gap-2 rounded-2xl border p-3.5",
  "shadow-sm transition active:scale-[0.99]",
  "sm:min-h-[5rem] sm:p-4",
);

export function AccountQuickStart({ hasListings, hasCompany }: AccountQuickStartProps) {
  const { t } = useTranslation();

  const postListingCard: QuickStartCard = hasListings
    ? { href: "/listings/new", labelKey: "account.postListing", icon: PlusCircle }
    : {
        href: "/listings/new",
        labelKey: "onboarding.postFirstListing",
        icon: PlusCircle,
        primary: true,
      };

  const companyCard: QuickStartCard = {
    href: "/account/company",
    labelKey: hasCompany ? "onboarding.setupCompany" : "onboarding.addCompany",
    icon: Settings2,
    soft: !hasCompany,
  };

  const cards: QuickStartCard[] = hasListings
    ? [
        { href: "/account/listings", labelKey: "account.myListings", icon: ListChecks, primary: true },
        { href: "/account/requests", labelKey: "account.myRequests", icon: Inbox, primary: true },
        postListingCard,
        companyCard,
        { href: "/cargo", labelKey: "account.submitCargoRequest", icon: Truck },
      ]
    : [
        postListingCard,
        { href: "/account/listings", labelKey: "account.myListings", icon: ListChecks },
        { href: "/account/requests", labelKey: "account.myRequests", icon: Inbox },
        companyCard,
        { href: "/cargo", labelKey: "account.submitCargoRequest", icon: Truck },
      ];

  return (
    <section aria-labelledby="account-quick-start">
      <h2
        id="account-quick-start"
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        {t("onboarding.quickStart")}
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={`${card.href}-${card.labelKey}`}
              href={card.href}
              className={cn(
                cardClassName,
                card.primary
                  ? "border-blue-200 bg-blue-50/80 dark:border-blue-800/60 dark:bg-blue-950/30"
                  : card.soft
                    ? "border-dashed border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50"
                    : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/40",
              )}
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl",
                  card.primary
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : card.soft
                      ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                {t(card.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
