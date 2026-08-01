"use client";

import Link from "next/link";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Container } from "./Container";
import { BrandLogo } from "./BrandLogo";

type FooterLink = {
  labelKey: DictionaryKey;
  href: string;
};

type FooterColumn = {
  titleKey: DictionaryKey;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    titleKey: "footer.buyersTitle",
    links: [
      { labelKey: "footer.catalog", href: "/listings" },
      { labelKey: "footer.favorites", href: "/favorites" },
      { labelKey: "footer.buyerDashboard", href: "/account" },
    ],
  },
  {
    titleKey: "footer.sellersTitle",
    links: [
      { labelKey: "footer.postListing", href: "/listings/new" },
      { labelKey: "footer.sellerDashboard", href: "/account" },
      { labelKey: "footer.leads", href: "/seller/leads" },
    ],
  },
  {
    titleKey: "footer.platformTitle",
    links: [
      { labelKey: "footer.sellers", href: "/sellers" },
      { labelKey: "footer.notifications", href: "/notifications" },
      { labelKey: "footer.signIn", href: "/login" },
      { labelKey: "footer.register", href: "/register" },
    ],
  },
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <Container>
        <div className="grid grid-cols-1 gap-6 py-10 sm:gap-8 lg:grid-cols-4 lg:gap-10 lg:py-14">
          <div className="min-w-0">
            <BrandLogo variant="footer" />
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("footer.brandTagline")}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-500">
              {t("footer.brandSubline")}
            </p>
          </div>

          {footerColumns.map((column) => (
            <nav key={column.titleKey} className="min-w-0" aria-label={t(column.titleKey)}>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t(column.titleKey)}
              </h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-slate-200 py-6 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">{t("footer.copyright")}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
            {t("footer.bottomTagline")}
          </p>
        </div>
      </Container>
    </footer>
  );
}
