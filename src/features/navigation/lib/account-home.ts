import type { UserRole } from "@prisma/client";

/** Home dashboard for settings drawer / mobile profile / header cabinet link. */
export function getAccountHomeHref(role: UserRole): string {
  switch (role) {
    case "ADMIN":
    case "MODERATOR":
      return "/admin";
    case "BUYER":
    case "SELLER":
    default:
      return "/account";
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case "BUYER":
      return "Аккаунт";
    case "SELLER":
      return "Аккаунт";
    case "MODERATOR":
      return "Модератор";
    case "ADMIN":
      return "Администратор";
    default:
      return role;
  }
}
