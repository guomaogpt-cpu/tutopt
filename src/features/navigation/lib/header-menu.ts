import type { UserRole } from "@prisma/client";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";

export type HeaderUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type HeaderMenuItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  action?: "logout";
  disabled?: boolean;
};

export function getHeaderMenuItems(user: HeaderUser | null): HeaderMenuItem[] {
  if (!user) {
    return [
      { label: "Войти", href: "/login", icon: User },
      { label: "Регистрация", href: "/register", icon: User },
    ];
  }

  switch (user.role) {
    case "BUYER":
      return [
        { label: "Профиль", icon: User, disabled: true },
        { label: "Избранное", icon: Heart, disabled: true },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "SELLER":
      return [
        { label: "Кабинет продавца", href: "/seller/dashboard", icon: LayoutDashboard },
        { label: "Мои объявления", href: "/seller/dashboard", icon: LayoutDashboard },
        { label: "Подать объявление", href: "/listings/new", icon: PlusCircle },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "MODERATOR":
      return [
        {
          label: "Модерация объявлений",
          href: "/admin/moderation/listings",
          icon: Shield,
        },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "ADMIN":
      return [
        { label: "Админка", href: "/admin/users", icon: Shield },
        { label: "Пользователи", href: "/admin/users", icon: User },
        {
          label: "Модерация объявлений",
          href: "/admin/moderation/listings",
          icon: Shield,
        },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    default:
      return [{ label: "Выйти", icon: LogOut, action: "logout" }];
  }
}
