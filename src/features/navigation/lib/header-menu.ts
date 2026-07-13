import type { UserRole } from "@prisma/client";
import {
  Heart,
  Inbox,
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

const buyerDashboardItem: HeaderMenuItem = {
  label: "Кабинет покупателя",
  href: "/buyer/dashboard",
  icon: User,
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
        buyerDashboardItem,
        { label: "Избранное", href: "/favorites", icon: Heart },
        { label: "Уведомления", href: "/notifications", icon: Inbox },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "SELLER":
      return [
        { label: "Кабинет продавца", href: "/seller/dashboard", icon: LayoutDashboard },
        { label: "Заявки", href: "/seller/leads", icon: Inbox },
        { label: "Подать объявление", href: "/listings/new", icon: PlusCircle },
        { label: "Уведомления", href: "/notifications", icon: Inbox },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "MODERATOR":
      return [
        {
          label: "Модерация",
          href: "/admin/moderation/listings",
          icon: Shield,
        },
        { label: "Уведомления", href: "/notifications", icon: Inbox },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "ADMIN":
      return [
        { label: "Пользователи", href: "/admin/users", icon: User },
        {
          label: "Модерация",
          href: "/admin/moderation/listings",
          icon: Shield,
        },
        { label: "Уведомления", href: "/notifications", icon: Inbox },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    default:
      return [buyerDashboardItem, { label: "Выйти", icon: LogOut, action: "logout" }];
  }
}
