"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Heart, LayoutGrid, LogOut, Menu, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutRequest } from "@/features/auth/lib/auth-client";
import {
  getCreateListingHref,
  shouldShowCreateListingCTA,
} from "@/features/auth/lib/login-redirect";
import {
  getHeaderMenuItems,
  type HeaderUser,
} from "@/features/navigation/lib/header-menu";
import { Logo } from "@/components/layout/Logo";
import { HeaderSearch } from "@/components/layout/header/HeaderSearch";
import { HeaderNotificationsBell } from "@/components/layout/header/HeaderNotificationsBell";
import { UserMenu } from "@/components/layout/header/UserMenu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type HeaderClientProps = {
  user: HeaderUser | null;
};

type MobileNavItem = {
  label: string;
  href?: string;
  disabled?: boolean;
};

function buildMobileNavItems(user: HeaderUser | null): MobileNavItem[] {
  const items: MobileNavItem[] = [
    { label: "Категории", href: "/categories" },
    { label: "Каталог", href: "/listings" },
  ];

  if (shouldShowCreateListingCTA(user)) {
    items.push({ label: "Подать объявление", href: getCreateListingHref(user) });
  }

  const seen = new Set(items.map((item) => `${item.label}:${item.href ?? ""}`));

  for (const item of getHeaderMenuItems(user)) {
    if (item.action === "logout") {
      continue;
    }

    const key = `${item.label}:${item.href ?? ""}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    if (item.disabled || !item.href) {
      items.push({ label: item.label, disabled: true });
      continue;
    }

    items.push({ label: item.label, href: item.href });
  }

  return items;
}

export function HeaderClient({ user }: HeaderClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isHomePage = pathname === "/";

  const mobileItems = buildMobileNavItems(user);
  const createListingHref = getCreateListingHref(user);
  const showCreateListingCTA = shouldShowCreateListingCTA(user);

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
    <header className="relative z-40 border-b border-[#E5E7EB] bg-white shadow-sm">
      <Container>
        <div className="flex h-16 min-w-0 items-center gap-1.5 sm:gap-2 lg:gap-4">
          <div className="shrink-0">
            <Logo />
          </div>

          <div className="hidden min-w-0 flex-1 items-center gap-2 lg:flex">
            <Suspense
              fallback={
                <HeaderSearch className="mx-auto w-full max-w-3xl" syncDisabled />
              }
            >
              <HeaderSearch className="mx-auto w-full max-w-3xl" />
            </Suspense>

            <Button
              variant="outline"
              className="shrink-0 border-[#E5E7EB] bg-white"
              asChild
            >
              <Link href="/categories">
                <LayoutGrid className="size-4" aria-hidden="true" />
                <span className="hidden xl:inline">Категории</span>
              </Link>
            </Button>
          </div>

          <div className="hidden min-w-0 items-center gap-1.5 lg:flex xl:gap-2">
            <FavoritesButton />

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
            ) : null}

            <UserMenu user={user} />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:hidden">
            <Button variant="outline" size="icon" className="shrink-0 border-[#E5E7EB]" asChild>
              <Link href="/categories" aria-label="Категории" title="Категории">
                <LayoutGrid className="size-5" aria-hidden="true" />
              </Link>
            </Button>

            <FavoritesButton />

            {user ? <HeaderNotificationsBell /> : null}

            {showCreateListingCTA ? (
              <Button
                size="icon"
                className="shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8]"
                asChild
              >
                <Link href={createListingHref} aria-label="Подать объявление">
                  <PlusCircle className="size-5" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-[#E5E7EB]"
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

        {!isHomePage ? (
          <div className="min-w-0 pb-3 lg:hidden">
            <Suspense fallback={<HeaderSearch id="header-search-mobile" className="w-full" syncDisabled />}>
              <HeaderSearch id="header-search-mobile" className="w-full" />
            </Suspense>
          </div>
        ) : null}
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

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="flex flex-col gap-1">
              {mobileItems.map((item) => (
                <li key={`${item.label}:${item.href ?? "disabled"}`}>
                  {item.disabled || !item.href ? (
                    <div className="flex items-center rounded-xl px-3 py-3 text-sm text-muted-foreground">
                      {item.label}
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        скоро
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="h-auto w-full justify-start px-3 py-3 font-medium"
                      asChild
                    >
                      <Link href={item.href} onClick={() => setMobileOpen(false)}>
                        {item.label}
                      </Link>
                    </Button>
                  )}
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

function FavoritesButton() {
  return (
    <Button variant="outline" size="icon" className="shrink-0 border-[#E5E7EB]" asChild>
      <Link href="/favorites" aria-label="Избранное" title="Избранное">
        <Heart className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}
