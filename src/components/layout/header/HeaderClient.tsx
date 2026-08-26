"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { ChevronUp, Heart, LayoutGrid, Menu, Plus, Settings2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  buildLoginUrl,
  buildRegisterUrl,
} from "@/features/auth/lib/login-redirect";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import { BrandLogo } from "@/components/layout/BrandLogo";
import {
  CategoryMegaDropdown,
} from "@/components/layout/header/CategoryMegaDropdown";
import { useSiteHeaderHeight } from "@/components/layout/header/use-site-header-height";
import { CurrencyRegionIndicator } from "@/components/layout/header/CurrencyRegionIndicator";
import { HeaderSearch } from "@/components/layout/header/HeaderSearch";
import { HeaderSectionNav } from "@/components/layout/header/HeaderSectionNav";
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

const HEADER_GLASS =
  "fixed inset-x-0 top-0 z-[90] border-b border-slate-200/70 bg-white/88 text-slate-900 shadow-[0_4px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl backdrop-saturate-150 dark:border-slate-800/70 dark:bg-slate-950/88 dark:text-slate-100";

const SECTION_GRADIENT =
  "h-[2px] bg-gradient-to-r from-purple-400/55 via-green-400/50 via-[38%] via-blue-400/50 via-[62%] to-orange-400/55";

export function HeaderClient({ user }: HeaderClientProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const headerRef = useRef<HTMLElement>(null);
  const headerHeight = useSiteHeaderHeight(headerRef);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const loginHref = buildLoginUrl(pathname);
  const registerHref = buildRegisterUrl({ returnPath: pathname });

  function closeCategories() {
    setCategoriesOpen(false);
  }

  function toggleCategories() {
    setProfileOpen(false);
    setCurrencyOpen(false);
    setCategoriesOpen((current) => !current);
  }

  function handleProfileOpenChange(open: boolean) {
    if (open) {
      setCategoriesOpen(false);
      setCurrencyOpen(false);
    }
    setProfileOpen(open);
  }

  function handleCurrencyOpenChange(open: boolean) {
    if (open) {
      setCategoriesOpen(false);
      setProfileOpen(false);
    }
    setCurrencyOpen(open);
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn("relative pointer-events-auto", HEADER_GLASS)}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-purple-50/25 via-transparent via-35% via-green-50/15 via-65% to-orange-50/20 dark:from-purple-950/20 dark:via-transparent dark:to-orange-950/15"
        />

        <Container className="relative z-[1]">
          {/* Row 1 — logo, sections, actions */}
          <div className="flex h-12 min-w-0 items-center gap-2 lg:h-14 lg:gap-3">
            <div className="flex min-w-0 shrink-0 items-center gap-2 lg:gap-3">
              <BrandLogo variant="header" priority showWordmark />
              <Suspense fallback={null}>
                <HeaderSectionNav variant="inline" />
              </Suspense>
            </div>

            <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1 sm:gap-1.5">
              <div className="hidden items-center gap-1.5 lg:flex">
                {user ? <FavoritesButton /> : null}
                {user ? <HeaderNotificationsBell /> : null}
                <CurrencyRegionIndicator
                  open={currencyOpen}
                  onOpenChange={handleCurrencyOpenChange}
                />

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
                      className="h-10 shrink-0 border-slate-200/80 bg-white/60 font-medium backdrop-blur-sm"
                      asChild
                    >
                      <Link href={registerHref}>{t("auth.register")}</Link>
                    </Button>
                  </>
                ) : (
                  <UserMenu
                    user={user}
                    open={profileOpen}
                    onOpenChange={handleProfileOpenChange}
                  />
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0 border-slate-200/80 bg-white/60 backdrop-blur-sm"
                  aria-expanded={settingsOpen}
                  aria-controls="settings-drawer-menu"
                  aria-label={
                    settingsOpen ? t("auth.closeSettings") : t("auth.openSettings")
                  }
                  onClick={() => {
                    setCategoriesOpen(false);
                    setProfileOpen(false);
                    setCurrencyOpen(false);
                    setSettingsOpen(true);
                  }}
                >
                  <Settings2 className="size-5" aria-hidden="true" />
                </Button>

                <PostListingButton />
              </div>

              <div className="flex items-center gap-1 lg:hidden">
                <CurrencyRegionIndicator
                  className="h-9 px-2"
                  open={currencyOpen}
                  onOpenChange={handleCurrencyOpenChange}
                />
                {user ? <HeaderNotificationsBell /> : null}
                <PostListingButton compact />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-slate-200/80 bg-white/60 backdrop-blur-sm dark:border-slate-700"
                  aria-expanded={settingsOpen}
                  aria-controls="settings-drawer-menu"
                  aria-label={
                    settingsOpen ? t("auth.closeMenu") : t("auth.openMenu")
                  }
                  onClick={() => {
                    setCategoriesOpen(false);
                    setProfileOpen(false);
                    setCurrencyOpen(false);
                    setSettingsOpen((current) => !current);
                  }}
                >
                  {settingsOpen ? (
                    <X className="size-5" aria-hidden="true" />
                  ) : (
                    <Menu className="size-5" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile section scroll */}
          <Suspense fallback={null}>
            <HeaderSectionNav variant="scroll" className="lg:hidden" />
          </Suspense>

          <div aria-hidden="true" className={SECTION_GRADIENT} />

          {/* Row 2 — categories + search */}
          <div className="flex min-w-0 items-center gap-2 py-2 lg:gap-3 lg:py-2.5">
            <CategoriesBarButton
              open={categoriesOpen}
              onClick={toggleCategories}
            />

            <div
              className="min-w-0 flex-1"
              onFocusCapture={() => {
                if (categoriesOpen) {
                  closeCategories();
                }
              }}
            >
              <Suspense
                fallback={
                  <HeaderSearch
                    className="min-w-0 flex-1"
                    inputClassName="h-11 rounded-xl bg-white/90 text-[15px] shadow-sm lg:h-12"
                    placeholderKey="search.lalafoPlaceholder"
                    syncDisabled
                  />
                }
              >
                <HeaderSearch
                  className="min-w-0 flex-1"
                  inputClassName="h-11 rounded-xl bg-white/90 text-[15px] placeholder:text-slate-500 shadow-sm lg:h-12 lg:text-base"
                  placeholderKey="search.lalafoPlaceholder"
                />
              </Suspense>
            </div>
          </div>
        </Container>
      </header>

      <div
        aria-hidden="true"
        className="pointer-events-none shrink-0"
        style={{ height: headerHeight > 0 ? headerHeight : 128 }}
      />

      <CategoryMegaDropdown
        open={categoriesOpen}
        onOpenChange={setCategoriesOpen}
        headerHeight={headerHeight > 0 ? headerHeight : 128}
      />

      <SettingsDrawer
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        user={user}
      />
    </>
  );
}

type CategoriesBarButtonProps = {
  open: boolean;
  onClick: () => void;
};

function CategoriesBarButton({ open, onClick }: CategoriesBarButtonProps) {
  const { t } = useTranslation();
  const label = t("vertical.categories");

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      aria-label={open ? "Закрыть категории" : label}
      aria-expanded={open}
      aria-controls="category-mega-menu"
      aria-haspopup="dialog"
      className={cn(
        "h-11 shrink-0 gap-1.5 rounded-xl border-slate-200/90 px-2.5 text-sm font-semibold shadow-sm backdrop-blur-sm",
        "hover:border-slate-300 hover:bg-white",
        "focus-visible:ring-2 focus-visible:ring-blue-500/40",
        "dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
        "sm:px-3.5 lg:h-12 lg:min-w-[8.5rem]",
        open
          ? "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200"
          : "bg-white/80 text-slate-800 dark:bg-slate-900/80",
      )}
    >
      {open ? (
        <ChevronUp className="size-[18px] shrink-0" aria-hidden="true" />
      ) : (
        <LayoutGrid className="size-[18px] shrink-0" aria-hidden="true" />
      )}
      <span className="max-w-[5.5rem] truncate sm:max-w-none">{label}</span>
    </Button>
  );
}

type PostListingButtonProps = {
  compact?: boolean;
};

function PostListingButton({ compact = false }: PostListingButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      asChild
      className={cn(
        "shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-sm",
        "hover:from-blue-700 hover:to-blue-800",
        compact ? "h-9 px-2.5 text-xs sm:px-3" : "h-10 px-3.5 text-sm lg:px-4",
      )}
    >
      <Link href="/listings/new">
        {compact ? (
          <>
            <Plus className="size-3.5 sm:mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">{t("mobileNav.post")}</span>
          </>
        ) : (
          t("vertical.postListing")
        )}
      </Link>
    </Button>
  );
}

function FavoritesButton() {
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10 shrink-0 border-slate-200/80 bg-white/60 backdrop-blur-sm"
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
