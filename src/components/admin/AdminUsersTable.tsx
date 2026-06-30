"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@prisma/client";

type AssignableRole = "BUYER" | "MODERATOR";

export type AdminUserRow = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  role: UserRole;
  is_blocked: boolean;
  created_at: string;
};

type AdminUsersTableProps = {
  users: AdminUserRow[];
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

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const router = useRouter();
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {successMessage ? (
        <div
          role="status"
          className="border-b border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Имя</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Телефон</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Роль</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Статус</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Дата регистрации</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isPending = pendingUserId === user.id;
              const canPromote = user.role === "BUYER";
              const canDemote = user.role === "MODERATOR";
              const isProtected = user.role === "ADMIN" || user.role === "SELLER";

              return (
                <tr key={user.id} className="align-top">
                  <td className="px-4 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-4 py-4 text-slate-700">{user.email ?? "—"}</td>
                  <td className="px-4 py-4 text-slate-700">{user.phone ?? "—"}</td>
                  <td className="px-4 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-4">
                    {user.is_blocked ? (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                        Заблокирован
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        Активен
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {new Date(user.created_at).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-4 py-4">
                    {isProtected ? (
                      <span className="text-xs text-slate-400">—</span>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {canPromote ? (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => changeRole(user.id, "MODERATOR")}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                          >
                            Назначить модератором
                          </button>
                        ) : null}
                        {canDemote ? (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => changeRole(user.id, "BUYER")}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                          >
                            Снять модератора
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    BUYER: "bg-slate-100 text-slate-700",
    SELLER: "bg-purple-50 text-purple-700",
    MODERATOR: "bg-amber-50 text-amber-800",
    ADMIN: "bg-blue-50 text-blue-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[role]}`}>
      {roleLabels[role]}
    </span>
  );
}
