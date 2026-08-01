"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import type { PublicUser } from "@/features/auth/lib/session";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

type AdminNavProps = {
  user: PublicUser;
};

const navItems = [
  {
    labelKey: "admin.overview" as DictionaryKey,
    href: "/admin",
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    match: "exact" as const,
  },
  {
    labelKey: "admin.moderation" as DictionaryKey,
    href: "/admin/moderation/listings",
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    match: "prefix" as const,
    prefix: "/admin/moderation",
  },
  {
    labelKey: "admin.reports" as DictionaryKey,
    href: "/admin/reports",
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    match: "prefix" as const,
    prefix: "/admin/reports",
  },
  {
    labelKey: "admin.cargoRequests" as DictionaryKey,
    href: "/admin/cargo-requests",
    roles: [UserRole.ADMIN],
    match: "prefix" as const,
    prefix: "/admin/cargo-requests",
  },
  {
    labelKey: "admin.users" as DictionaryKey,
    href: "/admin/users",
    roles: [UserRole.ADMIN],
    match: "prefix" as const,
    prefix: "/admin/users",
  },
  {
    labelKey: "admin.companies.title" as DictionaryKey,
    href: "/admin/companies",
    roles: [UserRole.ADMIN],
    match: "prefix" as const,
    prefix: "/admin/companies",
  },
  {
    labelKey: "admin.auditLog" as DictionaryKey,
    href: "/admin/audit",
    roles: [UserRole.ADMIN],
    match: "prefix" as const,
    prefix: "/admin/audit",
  },
] as const;

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const visibleItems = navItems.filter((item) =>
    (item.roles as readonly UserRole[]).includes(user.role),
  );

  return (
    <nav
      aria-label={t("admin.navAriaLabel")}
      className={cn(
        "mb-6 overflow-x-auto rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-white p-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
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
              {t(item.labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
