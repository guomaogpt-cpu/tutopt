"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";

type AdminNavProps = {
  user: PublicUser;
};

const navItems = [
  {
    label: "Пользователи",
    href: "/admin/users",
    roles: [UserRole.ADMIN],
  },
  {
    label: "Модерация объявлений",
    href: "/admin/moderation/listings",
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
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
      className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
    >
      {visibleItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
