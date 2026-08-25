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

const VERTICAL_BUTTON_TONES = [
  "border-purple-200/80 bg-purple-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-200",
  "border-green-200/80 bg-green-50 text-green-800 hover:border-green-300 hover:bg-green-100 dark:border-green-900 dark:bg-green-950/50 dark:text-green-200",
  "border-blue-200/80 bg-blue-50 text-blue-800 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200",
  "border-orange-200/80 bg-orange-50 text-orange-800 hover:border-orange-300 hover:bg-orange-100 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-200",
] as const;

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
        className="flex h-full w-[min(100vw-2rem,380px)] max-w-[380px] flex-col gap-0 border-r border-slate-200 bg-[#F8FAFC] p-0 dark:border-slate-800 dark:bg-slate-950"
      >
        <DrawerHeader className="shrink-0 border-b border-slate-200 bg-white px-4 pb-3 pt-5 dark:border-slate-800 dark:bg-slate-900">
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
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
              Разделы
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {CATEGORY_DRAWER_VERTICALS.map((link, index) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNavigate(link.href)}
                    className={cn(
                      "flex h-10 w-full items-center justify-center rounded-xl border px-2 text-sm font-semibold transition",
                      VERTICAL_BUTTON_TONES[index] ?? VERTICAL_BUTTON_TONES[0],
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {CATEGORY_DRAWER_SECTIONS.map((section) => (
            <section
              key={section.title}
              className="mt-4 border-t border-slate-200/80 pt-4 dark:border-slate-800"
              aria-label={section.title}
            >
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {section.title}
              </p>
              <ul className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
                {section.links.map((link) => (
                  <li
                    key={`${section.title}-${link.href}`}
                    className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
                  >
                    <Link
                      href={link.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "flex min-h-10 items-center px-3 py-2.5 text-sm font-medium text-slate-700 transition",
                        "hover:bg-slate-50 active:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
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
