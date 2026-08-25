"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Heart, LayoutGrid, Menu, Settings2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  buildLoginUrl,
  buildRegisterUrl,
} from "@/features/auth/lib/login-redirect";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { CategoryDrawer } from "@/components/layout/header/CategoryDrawer";
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
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const loginHref = buildLoginUrl(pathname);
  const registerHref = buildRegisterUrl({ returnPath: pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 text-slate-900 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100 dark:supports-[backdrop-filter]:bg-slate-950/90">
      <Container>
        <div className="flex h-14 min-w-0 items-center gap-1.5 lg:h-[76px] lg:gap-2">
          <div className="flex min-w-0 shrink-0 items-center gap-1.5">
            <BrandLogo variant="header" priority showWordmark />
            <CategoriesButton onClick={() => setCategoriesOpen(true)} />
          </div>

          <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
            <Suspense
              fallback={
                <HeaderSearch
                  className="w-full max-w-[560px]"
                  inputClassName="h-12 text-base"
                  syncDisabled
                />
              }
            >
              <HeaderSearch
                className="w-full max-w-[560px]"
                inputClassName="h-12 text-base placeholder:text-slate-500"
              />
            </Suspense>
          </div>

          <div className="hidden min-w-0 shrink-0 items-center gap-1.5 lg:flex">
            {user ? <FavoritesButton /> : null}
            {user ? <HeaderNotificationsBell /> : null}

            {!user ? (
              <>
                <Button
                  variant="ghost"
                  className="h-11 shrink-0 font-medium"
                  asChild
                >
                  <Link href={loginHref}>{t("auth.signIn")}</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-11 shrink-0 border-[#E5E7EB] font-medium"
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
              className="h-11 w-11 shrink-0 border-[#E5E7EB]"
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

        <div className="border-t border-slate-100 pb-2 pt-2 lg:hidden dark:border-slate-800">
          <Suspense
            fallback={
              <HeaderSearch
                id="header-search-mobile"
                placeholderKey="mobileSearch.placeholder"
                inputClassName="h-11 text-[15px]"
                syncDisabled
              />
            }
          >
            <HeaderSearch
              id="header-search-mobile"
              placeholderKey="mobileSearch.placeholder"
              inputClassName="h-11 text-[15px] placeholder:text-slate-500"
            />
          </Suspense>
        </div>
      </Container>

      <CategoryDrawer open={categoriesOpen} onOpenChange={setCategoriesOpen} />

      <SettingsDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        user={user}
      />
    </header>
  );
}

type CategoriesButtonProps = {
  onClick: () => void;
};

function CategoriesButton({ onClick }: CategoriesButtonProps) {
  const { t } = useTranslation();
  const label = t("vertical.categories");

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-haspopup="dialog"
      className={cn(
        "size-10 shrink-0 rounded-xl border-slate-200/90 bg-slate-50 text-slate-700 shadow-sm",
        "hover:border-slate-300 hover:bg-white hover:text-slate-900",
        "focus-visible:ring-2 focus-visible:ring-blue-500/40",
        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        "sm:size-11",
      )}
    >
      <LayoutGrid className="size-[18px] sm:size-5" aria-hidden="true" />
    </Button>
  );
}

function FavoritesButton() {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-11 w-11 shrink-0 border-[#E5E7EB]"
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
