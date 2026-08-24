"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CATEGORY_DRAWER_SECTIONS,
  CATEGORY_DRAWER_VERTICALS,
} from "@/features/navigation/lib/category-drawer-links";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type CategoryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryDrawer({ open, onOpenChange }: CategoryDrawerProps) {
  const router = useRouter();
  const { t } = useTranslation();

  function handleNavigate(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="left"
        swipeToDismiss={false}
        className="flex h-full w-[min(100vw-2rem,380px)] max-w-[380px] flex-col gap-0 p-0"
      >
        <DrawerHeader className="shrink-0 border-b border-slate-100 px-4 pb-3 pt-5 dark:border-slate-800">
          <DrawerTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t("vertical.categories")}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Навигация по разделам и категориям
          </DrawerDescription>
        </DrawerHeader>

        <div
          data-drawer-scroll
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-6 pt-3"
        >
          <section aria-label="Разделы">
            <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Разделы
            </p>
            <ul className="grid grid-cols-2 gap-1.5">
              {CATEGORY_DRAWER_VERTICALS.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(link.href)}
                    className={cn(
                      "flex h-10 w-full items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 px-2 text-sm font-semibold text-slate-800 transition",
                      "hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-700",
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {CATEGORY_DRAWER_SECTIONS.map((section) => (
            <section key={section.title} className="mt-4" aria-label={section.title}>
              <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {section.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "flex min-h-10 items-center rounded-lg px-2 py-2 text-sm text-slate-700 transition",
                        "hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
