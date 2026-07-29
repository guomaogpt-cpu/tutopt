import type { UserRole } from "@prisma/client";

/** Home dashboard for the settings drawer “Мой кабинет” link. */
export function getAccountHomeHref(role: UserRole): string {
  switch (role) {
    case "SELLER":
      return "/seller/dashboard";
    case "ADMIN":
    case "MODERATOR":
      return "/admin";
    case "BUYER":
    default:
      return "/buyer/dashboard";
  }
}

export function getRoleLabel(role: UserRole): string {
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
