"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { ChevronRight, X } from "lucide-react";
import {
  CATEGORY_MEGA_MENU,
  CATEGORY_MEGA_MENU_DEFAULT_ID,
  type CategoryMegaItem,
} from "@/features/navigation/lib/category-mega-menu-data";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const ACCENT_ACTIVE: Record<CategoryMegaItem["accent"], string> = {
  purple: "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-900",
  green: "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-200 dark:border-green-900",
  blue: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900",
  orange: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-900",
  slate: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800/60 dark:text-slate-100 dark:border-slate-700",
};

const ANIMATION_MS = 200;

type CategoryMegaDropdownProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headerHeight: number;
};

export function CategoryMegaDropdown({
  open,
  onOpenChange,
  headerHeight,
}: CategoryMegaDropdownProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(CATEGORY_MEGA_MENU_DEFAULT_ID);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeCategory =
    CATEGORY_MEGA_MENU.find((item) => item.id === activeId) ?? CATEGORY_MEGA_MENU[0];

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = window.requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
    }, ANIMATION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveId(CATEGORY_MEGA_MENU_DEFAULT_ID);
    }
  }, [open]);

  function handleNavigate(href: string, event?: MouseEvent) {
    event?.preventDefault();
    close();
    router.push(href);
  }

  function handlePanelClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const maxPanelHeight = `min(78vh, calc(100dvh - ${headerHeight}px))`;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[55] bg-slate-900/45 transition-opacity duration-200 ease-out",
          visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ top: headerHeight }}
        onClick={close}
      />

      <div
        ref={panelRef}
        id="category-mega-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Категории"
        className={cn(
          "fixed inset-x-0 z-[55] transition-[opacity,transform] duration-200 ease-out",
          visible
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0",
        )}
        style={{ top: headerHeight, maxHeight: maxPanelHeight }}
        onClick={handlePanelClick}
      >
        <Container className="h-full max-h-[inherit] px-3 sm:px-5 lg:px-6">
          <div className="flex h-full max-h-[inherit] flex-col overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] dark:border-slate-800 dark:bg-slate-950">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5 lg:hidden dark:border-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Категории</p>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Закрыть категории"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <aside
                className="shrink-0 border-b border-slate-100 lg:w-[min(100%,320px)] lg:border-b-0 lg:border-r dark:border-slate-800"
                aria-label="Основные категории"
              >
                <ul className="flex gap-1 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:block lg:gap-0 lg:overflow-y-auto lg:overscroll-contain lg:p-2 lg:[scrollbar-width:thin] [&::-webkit-scrollbar]:hidden lg:[&::-webkit-scrollbar]:block">
                  {CATEGORY_MEGA_MENU.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                      <li key={item.id} className="shrink-0 lg:shrink">
                        <button
                          type="button"
                          onMouseEnter={() => {
                            if (window.matchMedia("(min-width: 1024px)").matches) {
                              setActiveId(item.id);
                            }
                          }}
                          onFocus={() => setActiveId(item.id)}
                          onClick={() => setActiveId(item.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-left text-sm font-medium transition",
                            "whitespace-nowrap lg:whitespace-normal",
                            isActive
                              ? ACCENT_ACTIVE[item.accent]
                              : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900",
                          )}
                          aria-current={isActive ? "true" : undefined}
                        >
                          <span className="text-base leading-none" aria-hidden="true">
                            {item.emoji}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          <ChevronRight
                            className={cn(
                              "size-4 shrink-0 opacity-50",
                              isActive && "opacity-80",
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 lg:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {activeCategory.label}
                  </h2>
                  <Link
                    href={activeCategory.href}
                    onClick={(event) => handleNavigate(activeCategory.href, event)}
                    className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Смотреть всё
                  </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {activeCategory.groups.map((group) => (
                    <section key={`${activeCategory.id}-${group.title}`}>
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {group.title}
                      </h3>
                      <ul className="space-y-0.5">
                        {group.links.map((link) => (
                          <li key={`${group.title}-${link.label}`}>
                            <Link
                              href={link.href}
                              onClick={(event) => handleNavigate(link.href, event)}
                              className="block rounded-lg px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>,
    document.body,
  );
}

/** Measure sticky header height for mega menu positioning. */
export function useSiteHeaderHeight(headerRef: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = headerRef.current;
    if (!element) {
      return;
    }

    function updateHeight() {
      const current = headerRef.current;
      if (!current) {
        return;
      }
      setHeight(Math.ceil(current.getBoundingClientRect().height));
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [headerRef]);

  return height;
}
