"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logoutRequest } from "@/features/auth/lib/auth-client";
import {
  getHeaderMenuItems,
  type HeaderMenuItem,
  type HeaderUser,
} from "@/features/navigation/lib/header-menu";

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

type UserMenuProps = {
  user: HeaderUser | null;
  align?: "left" | "right";
};

export function UserMenu({ user, align = "right" }: UserMenuProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const items = getHeaderMenuItems(user);
  const menuLabel = user ? `Меню пользователя: ${user.name}` : "Меню входа";

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logoutRequest();
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  function handleItemClick(item: HeaderMenuItem) {
    if (item.action === "logout") {
      void handleLogout();
      return;
    }

    if (item.disabled || !item.href) {
      return;
    }

    setOpen(false);
  }

  return (
    <div ref={rootRef} className={`relative shrink-0 ${open ? "z-50" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={menuLabel}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50 ${focusRingClassName}`}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <User className="h-4 w-4" aria-hidden="true" />
        </span>
        {user ? (
          <span className="hidden max-w-[120px] truncate xl:inline">{user.name}</span>
        ) : null}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute z-50 mt-2 max-h-[min(24rem,calc(100vh-6rem))] min-w-[220px] overflow-y-auto rounded-2xl border border-slate-200 bg-white py-2 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {user ? (
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">{getRoleLabel(user.role)}</p>
            </div>
          ) : null}

          <ul className="py-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isLogout = item.action === "logout";

              if (isLogout) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={isLoggingOut}
                      onClick={() => handleItemClick(item)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-60 ${focusRingClassName}`}
                    >
                      <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                    </button>
                  </li>
                );
              }

              if (item.disabled || !item.href) {
                return (
                  <li key={item.label}>
                    <span
                      role="menuitem"
                      aria-disabled="true"
                      className="flex cursor-not-allowed items-center gap-3 px-4 py-2.5 text-sm text-slate-400"
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {item.label}
                      <span className="ml-auto text-xs">скоро</span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 ${focusRingClassName}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function getRoleLabel(role: HeaderUser["role"]): string {
  switch (role) {
    case "BUYER":
      return "Покупатель";
    case "SELLER":
      return "Продавец";
    case "MODERATOR":
      return "Модератор";
    case "ADMIN":
      return "Администратор";
    default:
      return role;
  }
}
