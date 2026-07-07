"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRole } from "@prisma/client";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";

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

function getRoleBadgeVariant(
  role: UserRole,
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (role) {
    case UserRole.ADMIN:
      return "default";
    case UserRole.MODERATOR:
      return "warning";
    case UserRole.SELLER:
      return "secondary";
    default:
      return "outline";
  }
}

export function AdminUsersTable({ users, currentUserId }: AdminUsersTableProps) {
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

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Пользователей пока нет"
        description="Когда появятся зарегистрированные пользователи, они отобразятся здесь."
      />
    );
  }

  return (
    <Section spacing="none" className="space-y-4">
      {successMessage ? (
        <Card className="border-green-200 bg-green-50" role="status">
          <CardContent className="p-4 text-sm text-green-800">{successMessage}</CardContent>
        </Card>
      ) : null}

      {errorMessage ? (
        <Card className="border-destructive/30 bg-destructive/5" role="alert">
          <CardContent className="p-4 text-sm text-destructive">{errorMessage}</CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {users.map((user) => {
          const isPending = pendingUserId === user.id;
          const isSelf = user.id === currentUserId;
          const canPromote = user.role === "BUYER" && !isSelf;
          const canDemote = user.role === "MODERATOR" && !isSelf;
          const isProtected =
            user.role === "ADMIN" || user.role === "SELLER" || isSelf;

          return (
            <Card key={user.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-0 sm:p-5 sm:pb-0">
                <div className="min-w-0">
                  <CardTitle className="text-base">{user.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {user.email ?? user.phone ?? "—"}
                  </p>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)} className="shrink-0">
                  {roleLabels[user.role]}
                </Badge>
              </CardHeader>

              <CardContent className="grid gap-3 p-4 text-sm sm:grid-cols-2 sm:p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Телефон
                  </p>
                  <p className="mt-1 text-foreground">{user.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-1 text-foreground">{user.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Статус
                  </p>
                  <div className="mt-1">
                    {user.is_blocked ? (
                      <Badge variant="destructive">Заблокирован</Badge>
                    ) : (
                      <Badge variant="success">Активен</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Дата регистрации
                  </p>
                  <p className="mt-1 text-foreground">
                    {new Date(user.created_at).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 border-t p-4 sm:px-5 sm:py-4">
                {isProtected ? (
                  <p className="text-xs text-muted-foreground">
                    {isSelf
                      ? "Нельзя изменить свою роль"
                      : "Роль защищена от изменений"}
                  </p>
                ) : (
                  <>
                    {canPromote ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={isPending}
                        onClick={() => changeRole(user.id, "MODERATOR")}
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
                        onClick={() => changeRole(user.id, "BUYER")}
                      >
                        Снять модератора
                      </Button>
                    ) : null}
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
