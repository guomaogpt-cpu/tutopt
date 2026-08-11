"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Settings2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  buildLoginUrl,
  buildRegisterUrl,
} from "@/features/auth/lib/login-redirect";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import {
  getHeaderNavActiveClass,
  HEADER_PRIMARY_LINKS,
  isNavLinkActive,
} from "@/features/navigation/lib/header-nav";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { HeaderSearch } from "@/components/layout/header/HeaderSearch";
import { HeaderNotificationsBell } from "@/components/layout/header/HeaderNotificationsBell";
import { SettingsDrawer } from "@/components/layout/header/SettingsDrawer";
import { UserMenu } from "@/components/layout/header/UserMenu";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type HeaderClientProps = {
  user: HeaderUser | null;
};

export function HeaderClient({ user }: HeaderClientProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isHome = pathname === "/";

  const loginHref = buildLoginUrl(pathname);
  const registerHref = buildRegisterUrl({ returnPath: pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 text-slate-900 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <Container>
        <div className="flex h-[56px] min-w-0 items-center gap-1.5 sm:gap-2 lg:h-[96px] lg:gap-3">
          <BrandLogo variant="header" priority />

          <nav
            className="hidden shrink-0 items-center gap-1 lg:flex"
            aria-label={t("nav.main")}
          >
            {HEADER_PRIMARY_LINKS.map((link) => (
              <HeaderNavLink
                key={link.href}
                href={link.href}
                label={t(link.labelKey)}
                isActive={isNavLinkActive(pathname, link.href)}
              />
            ))}
          </nav>

          <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
            <Suspense
              fallback={
                <HeaderSearch className="w-full max-w-[380px]" syncDisabled />
              }
            >
              <HeaderSearch className="w-full max-w-[380px]" />
            </Suspense>
          </div>

          <div className="hidden min-w-0 shrink-0 items-center gap-1.5 lg:flex">
            {user ? <FavoritesButton /> : null}
            {user ? <HeaderNotificationsBell /> : null}

            {!user ? (
              <>
                <Button
                  variant="ghost"
                  className="h-10 shrink-0 font-medium"
                  asChild
                >
                  <Link href={loginHref}>{t("auth.signIn")}</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 shrink-0 border-[#E5E7EB] font-medium"
                  asChild
                >
                  <Link href={registerHref}>{t("auth.register")}</Link>
                </Button>
              </>
            ) : (
              <UserMenu user={user} />
            )}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 border-[#E5E7EB]"
              aria-expanded={settingsOpen}
              aria-controls="settings-drawer-menu"
              aria-label={
                settingsOpen ? t("auth.closeSettings") : t("auth.openSettings")
              }
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 className="size-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:hidden">
            {user ? <HeaderNotificationsBell /> : null}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 border-slate-200 dark:border-slate-700"
              aria-expanded={settingsOpen}
              aria-controls="settings-drawer-menu"
              aria-label={
                settingsOpen ? t("auth.closeMenu") : t("auth.openMenu")
              }
              onClick={() => setSettingsOpen((current) => !current)}
            >
              {settingsOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {!isHome ? (
          <div className="border-t border-slate-100 pb-2 pt-2 lg:hidden dark:border-slate-800">
            <Suspense
              fallback={
                <HeaderSearch
                  id="header-search-mobile"
                  placeholderKey="mobileSearch.placeholder"
                  syncDisabled
                />
              }
            >
              <HeaderSearch
                id="header-search-mobile"
                placeholderKey="mobileSearch.placeholder"
              />
            </Suspense>
          </div>
        ) : null}
      </Container>

      <SettingsDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        user={user}
      />
    </header>
  );
}

type HeaderNavLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

function HeaderNavLink({ href, label, isActive }: HeaderNavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 xl:px-4 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-300",
        isActive && getHeaderNavActiveClass(href),
      )}
    >
      {label}
    </Link>
  );
}

function FavoritesButton() {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 shrink-0 border-[#E5E7EB]"
      asChild
    >
      <Link
        href="/favorites"
        aria-label={t("auth.favorites")}
        title={t("auth.favorites")}
      >
        <Heart className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
