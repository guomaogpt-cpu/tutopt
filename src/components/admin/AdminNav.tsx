"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { cn } from "@/lib/utils";

type AdminNavProps = {
  user: PublicUser;
};

const navItems = [
  {
    label: "Обзор",
    href: "/admin",
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    match: "exact" as const,
  },
  {
    label: "Модерация",
    href: "/admin/moderation/listings",
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    match: "prefix" as const,
    prefix: "/admin/moderation",
  },
  {
    label: "Жалобы",
    href: "/admin/reports",
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    match: "prefix" as const,
    prefix: "/admin/reports",
  },
  {
    label: "Пользователи",
    href: "/admin/users",
    roles: [UserRole.ADMIN],
    match: "prefix" as const,
    prefix: "/admin/users",
  },
] as const;

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) =>
    (item.roles as readonly UserRole[]).includes(user.role),
  );

  return (
    <nav
      aria-label="Админ-навигация"
      className={cn(
        "mb-6 overflow-x-auto rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]",
        "scrollbar-none",
      )}
    >
      <div className="flex min-w-0 gap-1">
        {visibleItems.map((item) => {
          const isActive =
            item.match === "exact"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.prefix}/`) || pathname === item.prefix;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-[#2563EB] text-white shadow-sm"
                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
