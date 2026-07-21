"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Heart, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutRequest } from "@/features/auth/lib/auth-client";
import {
  getCreateListingHref,
  shouldShowCreateListingCTA,
} from "@/features/auth/lib/login-redirect";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import {
  getHeaderNavActiveClass,
  getMobileAccountLinks,
  HEADER_PRIMARY_LINKS,
  isNavLinkActive,
} from "@/features/navigation/lib/header-nav";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { HeaderSearch } from "@/components/layout/header/HeaderSearch";
import { HeaderNotificationsBell } from "@/components/layout/header/HeaderNotificationsBell";
import { UserMenu } from "@/components/layout/header/UserMenu";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

type HeaderClientProps = {
  user: HeaderUser | null;
};

type MobileNavItem = {
  label: string;
  href: string;
};

function buildMobileAccountItems(user: HeaderUser | null): MobileNavItem[] {
  const items = getMobileAccountLinks(user).map((link) => ({
    label: link.label,
    href: link.href,
  }));

  if (!shouldShowCreateListingCTA(user)) {
    return items;
  }

  const createListingItem: MobileNavItem = {
    label: "Подать объявление",
    href: getCreateListingHref(user),
  };

  if (items.some((item) => item.href === createListingItem.href)) {
    return items;
  }

  return [...items, createListingItem];
}

export function HeaderClient({ user }: HeaderClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mobileAccountItems = buildMobileAccountItems(user);

  async function handleMobileLogout() {
    setIsLoggingOut(true);

    try {
      await logoutRequest();
      setMobileOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <Container>
        <div className="flex h-14 min-w-0 items-center gap-2 lg:h-[72px] lg:gap-3">
          <BrandLogo variant="header" priority />

          <nav
            className="hidden shrink-0 items-center gap-0.5 lg:flex"
            aria-label="Основная навигация"
          >
            {HEADER_PRIMARY_LINKS.map((link) => (
              <HeaderNavLink
                key={link.href}
                href={link.href}
                label={link.label}
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
                  <Link href="/login">Войти</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-10 shrink-0 border-[#E5E7EB] font-medium"
                  asChild
                >
                  <Link href="/register">Регистрация</Link>
                </Button>
              </>
            ) : (
              <UserMenu user={user} />
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:hidden">
            {user ? <FavoritesButton /> : null}
            {user ? <HeaderNotificationsBell /> : null}

            {!user ? (
              <Button variant="ghost" className="h-10 shrink-0 px-2.5 font-medium" asChild>
                <Link href="/login">Войти</Link>
              </Button>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 border-[#E5E7EB]"
              aria-expanded={mobileOpen}
              aria-controls="mobile-header-menu"
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search — separate row so the top bar stays light */}
        <div className="border-t border-slate-100 pb-2.5 pt-2 lg:hidden">
          <Suspense
            fallback={<HeaderSearch id="header-search-mobile" syncDisabled />}
          >
            <HeaderSearch id="header-search-mobile" />
          </Suspense>
        </div>
      </Container>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent
          id="mobile-header-menu"
          side="right"
          className="p-0 [&>button]:right-3 [&>button]:top-3"
        >
          <DrawerHeader className="flex h-14 shrink-0 flex-row items-center border-b px-4 pr-12 text-left">
            <DrawerTitle className="truncate text-sm font-semibold">
              {user ? user.name : "Меню"}
            </DrawerTitle>
          </DrawerHeader>

          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Направления
            </p>
            <ul className="flex flex-col gap-0.5">
              {HEADER_PRIMARY_LINKS.map((item) => (
                <li key={item.href}>
                  <MobileDrawerLink
                    href={item.href}
                    label={item.label}
                    isActive={isNavLinkActive(pathname, item.href)}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </li>
              ))}
            </ul>

            {mobileAccountItems.length > 0 ? (
              <>
                <p className="mb-1.5 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Аккаунт
                </p>
                <ul className="flex flex-col gap-0.5">
                  {mobileAccountItems.map((item) => (
                    <li key={`${item.label}:${item.href}`}>
                      <MobileDrawerLink
                        href={item.href}
                        label={item.label}
                        isActive={isNavLinkActive(pathname, item.href)}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {user ? (
              <Button
                type="button"
                variant="ghost"
                disabled={isLoggingOut}
                onClick={() => void handleMobileLogout()}
                className="mt-4 h-auto w-full justify-start gap-3 px-3 py-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4 shrink-0" aria-hidden="true" />
                Выйти
              </Button>
            ) : (
              <div className="mt-5 grid gap-2">
                <Button variant="outline" className="h-10" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Войти
                  </Link>
                </Button>
                <Button className="h-10 bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    Регистрация
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </DrawerContent>
      </Drawer>
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
        "shrink-0 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 xl:px-2.5 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        isActive && getHeaderNavActiveClass(href),
      )}
    >
      {label}
    </Link>
  );
}

type MobileDrawerLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
  onNavigate: () => void;
};

function MobileDrawerLink({
  href,
  label,
  isActive,
  onNavigate,
}: MobileDrawerLinkProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto w-full justify-start px-3 py-3 font-medium",
        isActive && getHeaderNavActiveClass(href),
      )}
      asChild
    >
      <Link href={href} onClick={onNavigate}>
        {label}
      </Link>
    </Button>
  );
}

function FavoritesButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 shrink-0 border-[#E5E7EB]"
      asChild
    >
      <Link href="/favorites" aria-label="Избранное" title="Избранное">
        <Heart className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
