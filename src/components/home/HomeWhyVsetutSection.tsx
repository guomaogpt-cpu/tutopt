"use client";

import { LayoutGrid, MapPin, MessageSquare, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";

const WHY_ITEMS: Array<{
  icon: typeof Search;
  titleKey: DictionaryKey;
  descriptionKey: DictionaryKey;
}> = [
  {
    icon: LayoutGrid,
    titleKey: "home.why.allInOne.title",
    descriptionKey: "home.why.allInOne.description",
  },
  {
    icon: Search,
    titleKey: "home.why.fastSearch.title",
    descriptionKey: "home.why.fastSearch.description",
  },
  {
    icon: MessageSquare,
    titleKey: "home.why.directRequests.title",
    descriptionKey: "home.why.directRequests.description",
  },
  {
    icon: MapPin,
    titleKey: "home.why.localMarket.title",
    descriptionKey: "home.why.localMarket.description",
  },
];

export function HomeWhyVsetutSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-8 sm:py-10 dark:bg-slate-950">
      <Container size="lg">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">
          {t("home.whyVsetut")}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.titleKey}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm dark:bg-slate-950 dark:text-blue-400">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t(item.titleKey)}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {t(item.descriptionKey)}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
