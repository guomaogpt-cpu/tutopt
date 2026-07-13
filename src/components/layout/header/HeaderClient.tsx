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
  getMobileDrawerLinks,
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

function buildMobileNavItems(user: HeaderUser | null): MobileNavItem[] {
  const items = getMobileDrawerLinks(user).map((link) => ({
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

  if (items.some((item) => item.label === createListingItem.label)) {
    return items;
  }

  const catalogIndex = items.findIndex((item) => item.href === "/listings");
  if (catalogIndex === -1) {
    return [...items, createListingItem];
  }

  return [
    ...items.slice(0, catalogIndex + 1),
    createListingItem,
    ...items.slice(catalogIndex + 1),
  ];
}

export function HeaderClient({ user }: HeaderClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mobileItems = buildMobileNavItems(user);

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
        <div className="flex h-16 min-w-0 items-center gap-2 lg:h-[72px] lg:gap-4">
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

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <Suspense
              fallback={
                <HeaderSearch
                  className="w-full max-w-[420px]"
                  syncDisabled
                />
              }
            >
              <HeaderSearch className="w-full max-w-[420px]" />
            </Suspense>
          </div>

          <div className="hidden min-w-0 shrink-0 items-center gap-1.5 lg:flex xl:gap-2">
            {user ? <FavoritesButton /> : null}
            {user ? <HeaderNotificationsBell /> : null}

            {!user ? (
              <>
                <Button variant="ghost" className="shrink-0 font-medium" asChild>
                  <Link href="/login">Войти</Link>
                </Button>
                <Button
                  variant="outline"
                  className="shrink-0 border-[#E5E7EB] font-medium"
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

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0 border-[#E5E7EB]"
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
      </Container>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent
          id="mobile-header-menu"
          side="right"
          className="p-0 [&>button]:right-3 [&>button]:top-3"
        >
          <DrawerHeader className="flex h-16 shrink-0 flex-row items-center border-b px-4 pr-12 text-left">
            <DrawerTitle className="truncate text-sm font-semibold">
              {user ? user.name : "Меню"}
            </DrawerTitle>
          </DrawerHeader>

          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            <ul className="flex flex-col gap-1">
              {mobileItems.map((item) => (
                <li key={`${item.label}:${item.href}`}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-auto w-full justify-start px-3 py-3 font-medium",
                      isNavLinkActive(pathname, item.href) &&
                        "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700",
                    )}
                    asChild
                  >
                    <Link href={item.href} onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>

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
              <div className="mt-4 grid gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Войти
                  </Link>
                </Button>
                <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]" asChild>
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
        "shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        isActive &&
          "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-300",
      )}
    >
      {label}
    </Link>
  );
}

function FavoritesButton() {
  return (
    <Button variant="outline" size="icon" className="shrink-0 border-[#E5E7EB]" asChild>
      <Link href="/favorites" aria-label="Избранное" title="Избранное">
        <Heart className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
