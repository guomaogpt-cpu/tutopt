"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  HelpCircle,
  LogOut,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";
import { logoutRequest } from "@/features/auth/lib/auth-client";
import {
  buildLoginUrl,
  buildRegisterUrl,
  getCreateListingHref,
} from "@/features/auth/lib/login-redirect";
import {
  getAccountHomeHref,
  getRoleLabel,
} from "@/features/navigation/lib/account-home";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import {
  HEADER_PRIMARY_LINKS,
  isNavLinkActive,
} from "@/features/navigation/lib/header-nav";
import type { PreferredLocale } from "@/features/preferences/locale-preference";
import type { PreferredTheme } from "@/features/preferences/theme-preference";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type SettingsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: HeaderUser | null;
};

const LOCALE_OPTIONS: { id: PreferredLocale; label: string }[] = [
  { id: "ru", label: "RU" },
  { id: "kg", label: "KG" },
  { id: "en", label: "EN" },
];

const THEME_OPTIONS: {
  id: PreferredTheme;
  labelKey: DictionaryKey;
  icon: typeof Sun;
}[] = [
  { id: "light", labelKey: "settings.themeLight", icon: Sun },
  { id: "dark", labelKey: "settings.themeDark", icon: Moon },
  { id: "system", labelKey: "settings.themeSystem", icon: Monitor },
];

const SECTION_LINKS: { labelKey: DictionaryKey; href: string }[] = [
  ...HEADER_PRIMARY_LINKS,
  { labelKey: "vertical.allListings", href: "/listings" },
];

export function SettingsDrawer({
  open,
  onOpenChange,
  user,
}: SettingsDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const loginHref = buildLoginUrl(pathname);
  const registerHref = buildRegisterUrl({ returnPath: pathname });

  useEffect(() => {
    setMounted(true);
  }, []);

  useBodyScrollLock(open);

  function handleLocaleSelect(next: PreferredLocale) {
    setLocale(next);
  }

  function handleThemeSelect(next: PreferredTheme) {
    setTheme(next);
  }

  function closeDrawer() {
    onOpenChange(false);
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutRequest();
      closeDrawer();
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <DrawerContent
        id="settings-drawer-menu"
        side="right"
        belowHeader
        className="w-[min(100vw,23.75rem)] max-w-[23.75rem] gap-0 border-slate-200 bg-background p-0 dark:border-slate-800 dark:bg-slate-950 sm:w-[min(85vw,23.75rem)]"
      >
        <DrawerHeader className="flex shrink-0 flex-row items-center gap-3 border-b border-slate-100 px-4 py-3 pr-12 text-left dark:border-slate-800">
          <BrandLogo variant="default" className="h-9 max-w-[36px]" />
          <div className="min-w-0">
            <DrawerTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t("settings.brand")}
            </DrawerTitle>
            <DrawerDescription className="text-xs text-slate-500 dark:text-slate-400">
              {t("settings.subtitle")}
            </DrawerDescription>
          </div>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t("settings.account")}
            </p>
            {user ? (
              <div className="space-y-2">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/80">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
                <SettingsLink
                  href={getAccountHomeHref(user.role)}
                  label={t("settings.dashboard")}
                  isActive={isNavLinkActive(
                    pathname,
                    getAccountHomeHref(user.role),
                  )}
                  onNavigate={closeDrawer}
                />
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoggingOut}
                  onClick={() => void handleLogout()}
                  className="h-11 w-full justify-start gap-2 rounded-xl px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-4 shrink-0" aria-hidden="true" />
                  {t("auth.signOut")}
                </Button>
              </div>
            ) : (
              <div className="grid gap-2">
                <Button
                  className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
                  asChild
                >
                  <Link href={loginHref} onClick={closeDrawer}>
                    {t("auth.signIn")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200 dark:border-slate-700"
                  asChild
                >
                  <Link href={registerHref} onClick={closeDrawer}>
                    {t("auth.register")}
                  </Link>
                </Button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t("settings.city")}
            </p>
            <button
              type="button"
              disabled
              className="flex h-11 w-full cursor-not-allowed items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 text-left text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
            >
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">
                {t("settings.cityValue")}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {t("settings.soon")}
              </span>
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t("settings.language")}
            </p>
            <div className="flex flex-wrap gap-2">
              {LOCALE_OPTIONS.map((option) => {
                const active = locale === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleLocaleSelect(option.id)}
                    className={cn(
                      "inline-flex h-9 min-w-12 items-center justify-center rounded-full border px-3 text-sm font-semibold transition",
                      active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:bg-slate-800",
                    )}
                    aria-pressed={active}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 px-1 text-xs text-slate-400">
              {t("settings.languageHint")}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t("settings.theme")}
            </p>
            <div className="flex flex-wrap gap-2">
              {THEME_OPTIONS.map((option) => {
                const active = mounted && theme === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleThemeSelect(option.id)}
                    className={cn(
                      "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition",
                      active
                        ? "border-slate-800 bg-slate-800 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800",
                    )}
                    aria-pressed={active}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                    {t(option.labelKey)}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 px-1 text-xs text-slate-400">
              {t("settings.themeHint")}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t("settings.sections")}
            </p>
            <ul className="space-y-0.5">
              {SECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <SettingsLink
                    href={link.href}
                    label={t(link.labelKey)}
                    isActive={isNavLinkActive(pathname, link.href)}
                    onNavigate={closeDrawer}
                  />
                </li>
              ))}
              <li>
                <SettingsLink
                  href={getCreateListingHref(user)}
                  label={t("vertical.postListing")}
                  isActive={pathname === "/listings/new"}
                  onNavigate={closeDrawer}
                />
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {t("settings.support")}
            </p>
            <ul className="space-y-0.5">
              <li>
                <SettingsLink
                  href="/help"
                  label={t("settings.help")}
                  icon={HelpCircle}
                  isActive={pathname === "/help"}
                  onNavigate={closeDrawer}
                />
              </li>
              <li>
                <SettingsLink
                  href="/contacts"
                  label={t("settings.contacts")}
                  icon={Mail}
                  isActive={pathname === "/contacts"}
                  onNavigate={closeDrawer}
                />
              </li>
            </ul>
            <p className="mt-2 px-1 text-xs text-slate-400">
              {t("settings.whatsappHint")}
            </p>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

type SettingsLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate: () => void;
  icon?: typeof HelpCircle;
};

function SettingsLink({
  href,
  label,
  isActive,
  onNavigate,
  icon: Icon,
}: SettingsLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium transition",
        isActive
          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
          : "text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800",
      )}
    >
      {Icon ? (
        <Icon
          className="size-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <ChevronRight
        className="size-4 shrink-0 text-slate-300 dark:text-slate-600"
        aria-hidden="true"
      />
    </Link>
  );
}
