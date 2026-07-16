"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ListingVertical } from "@prisma/client";
import { UserRole } from "@prisma/client";
import { Users } from "lucide-react";
import { UserRoleBadge } from "@/components/admin/UserRoleBadge";
import { VerticalListingBadge } from "@/components/listings/VerticalListingBadge";
import { SellerTrustBadge } from "@/components/seller/SellerTrustBlock";
import type { SellerTrustLevel } from "@/lib/trust/seller-trust";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type AssignableRole = "BUYER" | "MODERATOR";

export type AdminUserRow = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: UserRole;
  is_blocked: boolean;
  created_at: string;
  listingCount: number;
  verticals: ListingVertical[];
  trustLevel?: SellerTrustLevel | null;
};

type AdminUsersTableProps = {
  users: AdminUserRow[];
  currentUserId: string;
};

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

type ApiSuccessBody = {
  data: {
    user: {
      name: string;
      role: UserRole;
    };
  };
};

const roleLabels: Record<UserRole, string> = {
  BUYER: "Покупатель",
  SELLER: "Продавец",
  MODERATOR: "Модератор",
  ADMIN: "Админ",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function UserActions({
  user,
  currentUserId,
  isPending,
  onPromote,
  onDemote,
}: {
  user: AdminUserRow;
  currentUserId: string;
  isPending: boolean;
  onPromote: () => void;
  onDemote: () => void;
}) {
  const isSelf = user.id === currentUserId;
  const canPromote = user.role === UserRole.BUYER && !isSelf;
  const canDemote = user.role === UserRole.MODERATOR && !isSelf;
  const isProtected = user.role === UserRole.ADMIN || user.role === UserRole.SELLER || isSelf;

  if (isProtected) {
    return (
      <p className="text-xs text-[#64748B]">
        {isSelf ? "Нельзя изменить свою роль" : "Роль защищена от изменений"}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {canPromote ? (
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={onPromote}
          className="h-10 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
        >
          Назначить модератором
        </Button>
      ) : null}
      {canDemote ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={onDemote}
          className="h-10 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
        >
          Снять модератора
        </Button>
      ) : null}
    </div>
  );
}

export function AdminUsersTable({ users, currentUserId }: AdminUsersTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const haystack = [user.name, user.email ?? "", user.phone ?? ""].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesRole && matchesQuery;
    });
  }, [users, query, roleFilter]);

  async function changeRole(userId: string, role: AssignableRole) {
    setPendingUserId(userId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const body = (await response.json()) as ApiErrorBody | ApiSuccessBody;

      if (!response.ok) {
        const errorBody = body as ApiErrorBody;
        throw new Error(errorBody.error?.message ?? "Не удалось изменить роль");
      }

      const successBody = body as ApiSuccessBody;
      const updatedUser = successBody.data.user;

      setSuccessMessage(
        `Роль пользователя «${updatedUser.name}» изменена на «${roleLabels[updatedUser.role]}».`,
      );
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось изменить роль");
    } finally {
      setPendingUserId(null);
    }
  }

  if (users.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
          <Users className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-[#0F172A]">Пользователей пока нет</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
          Когда появятся зарегистрированные пользователи, они отобразятся здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {successMessage ? (
        <div
          className="rounded-2xl border border-[#BBF7D0] bg-[#ECFDF5] px-4 py-3 text-sm text-[#047857]"
          role="status"
        >
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div
          className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Поиск по имени или email..."
            containerClassName="min-w-0 flex-1"
            className="h-11 rounded-xl bg-white"
          />

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-white sm:w-[180px]" aria-label="Роль">
              <SelectValue placeholder="Роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все роли</SelectItem>
              <SelectItem value={UserRole.BUYER}>Покупатели</SelectItem>
              <SelectItem value={UserRole.SELLER}>Продавцы</SelectItem>
              <SelectItem value={UserRole.MODERATOR}>Модераторы</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Админы</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-10 text-center">
          <p className="text-sm text-[#64748B]">Пользователи не найдены. Измените поиск или фильтр.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="border-b border-[rgba(148,163,184,0.14)] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Пользователь</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Роль</th>
                    <th className="px-5 py-3 font-medium">Объявления</th>
                    <th className="px-5 py-3 font-medium">Регистрация</th>
                    <th className="px-5 py-3 font-medium">Статус</th>
                    <th className="px-5 py-3 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const isPending = pendingUserId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-[rgba(148,163,184,0.1)] last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-[#0F172A]">{user.name}</p>
                              <p className="truncate text-xs text-[#64748B]">
                                {user.phone ?? "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#334155]">{user.email ?? "—"}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <UserRoleBadge role={user.role} />
                            {user.trustLevel ? <SellerTrustBadge level={user.trustLevel} /> : null}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1.5">
                            <p className="font-medium text-[#0F172A]">{user.listingCount}</p>
                            {user.verticals.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.verticals.map((vertical) => (
                                  <VerticalListingBadge key={vertical} vertical={vertical} />
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-[#94A3B8]">—</p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#334155]">
                          {new Date(user.created_at).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="px-5 py-4">
                          {user.is_blocked ? (
                            <Badge variant="destructive">Заблокирован</Badge>
                          ) : (
                            <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5]">
                              Активен
                            </Badge>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <UserActions
                            user={user}
                            currentUserId={currentUserId}
                            isPending={isPending}
                            onPromote={() => void changeRole(user.id, "MODERATOR")}
                            onDemote={() => void changeRole(user.id, "BUYER")}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4 lg:hidden">
            {filteredUsers.map((user) => {
              const isPending = pendingUserId === user.id;

              return (
                <article
                  key={user.id}
                  className={cn(
                    "rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-sm font-semibold text-[#2563EB]">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0F172A]">{user.name}</p>
                        <p className="truncate text-sm text-[#64748B]">{user.email ?? user.phone ?? "—"}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <UserRoleBadge role={user.role} />
                      {user.trustLevel ? <SellerTrustBadge level={user.trustLevel} /> : null}
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-[#64748B]">Email</dt>
                      <dd className="mt-0.5 break-all font-medium text-[#0F172A]">
                        {user.email ?? "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#64748B]">Регистрация</dt>
                      <dd className="mt-0.5 font-medium text-[#0F172A]">
                        {new Date(user.created_at).toLocaleDateString("ru-RU")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#64748B]">Объявления</dt>
                      <dd className="mt-0.5 font-medium text-[#0F172A]">{user.listingCount}</dd>
                      {user.verticals.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {user.verticals.map((vertical) => (
                            <VerticalListingBadge key={vertical} vertical={vertical} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <dt className="text-xs text-[#64748B]">Статус</dt>
                      <dd className="mt-1">
                        {user.is_blocked ? (
                          <Badge variant="destructive">Заблокирован</Badge>
                        ) : (
                          <Badge className="bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5]">
                            Активен
                          </Badge>
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 border-t border-[rgba(148,163,184,0.14)] pt-4">
                    <UserActions
                      user={user}
                      currentUserId={currentUserId}
                      isPending={isPending}
                      onPromote={() => void changeRole(user.id, "MODERATOR")}
                      onDemote={() => void changeRole(user.id, "BUYER")}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
