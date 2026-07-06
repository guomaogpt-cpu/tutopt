"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Heart, LogOut, Menu, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

type HeaderClientProps = {
  user: HeaderUser | null;
};

type MobileNavItem = {
  label: string;
  href?: string;
  disabled?: boolean;
};

function buildMobileNavItems(user: HeaderUser | null): MobileNavItem[] {
  const items: MobileNavItem[] = [{ label: "Каталог", href: "/listings" }];

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mobileItems = buildMobileNavItems(user);
  const createListingHref = getCreateListingHref(user);
  const showCreateListingCTA = shouldShowCreateListingCTA(user);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
    <header className="relative z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] min-w-0 items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="shrink-0">
            <Logo />
          </div>

          <div className="hidden min-w-0 flex-1 lg:block">
            <Suspense
              fallback={
                <HeaderSearch className="mx-auto w-full max-w-2xl" syncDisabled />
              }
            >
              <HeaderSearch className="mx-auto w-full max-w-2xl" />
            </Suspense>
          </div>

          <div className="hidden min-w-0 items-center gap-1.5 lg:flex xl:gap-2">
            <Link
              href="/listings"
              className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 ${focusRingClassName}`}
            >
              Каталог
            </Link>

            {showCreateListingCTA ? (
              <Link
                href={createListingHref}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 xl:px-4 ${focusRingClassName}`}
              >
                <PlusCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden xl:inline">Подать объявление</span>
                <span className="xl:hidden">Подать</span>
              </Link>
            ) : null}

            <FavoritesButton />

            {user ? <HeaderNotificationsBell /> : null}

            {!user ? (
              <>
                <Link
                  href="/login"
                  className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 ${focusRingClassName}`}
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 ${focusRingClassName}`}
                >
                  Регистрация
                </Link>
              </>
            ) : null}

            <UserMenu user={user} />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
            {user ? <HeaderNotificationsBell /> : null}

            {showCreateListingCTA ? (
              <Link
                href={createListingHref}
                aria-label="Подать объявление"
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 ${focusRingClassName}`}
              >
                <PlusCircle className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : null}

            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-header-menu"
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMobileOpen((current) => !current)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 ${focusRingClassName}`}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="min-w-0 pb-3 lg:hidden">
          <Suspense fallback={<HeaderSearch id="header-search-mobile" className="w-full" syncDisabled />}>
            <HeaderSearch id="header-search-mobile" className="w-full" />
          </Suspense>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Закрыть меню"
            className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-header-menu"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-xl lg:hidden"
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-4">
              <p className="truncate pr-3 text-sm font-semibold text-slate-900">
                {user ? user.name : "Меню"}
              </p>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setMobileOpen(false)}
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 ${focusRingClassName}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="flex flex-col gap-1">
                {mobileItems.map((item) => (
                  <li key={`${item.label}:${item.href ?? "disabled"}`}>
                    {item.disabled || !item.href ? (
                      <span className="flex rounded-xl px-3 py-3 text-sm text-slate-400">
                        {item.label}
                        <span className="ml-auto text-xs">скоро</span>
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 ${focusRingClassName}`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {user ? (
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={() => void handleMobileLogout()}
                  className={`mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60 ${focusRingClassName}`}
                >
                  <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Выйти
                </button>
              ) : null}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}

function FavoritesButton() {
  return (
    <Link
      href="/favorites"
      aria-label="Избранное"
      title="Избранное"
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 ${focusRingClassName}`}
    >
      <Heart className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
