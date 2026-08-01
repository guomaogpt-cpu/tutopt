import type { UserRole } from "@prisma/client";
import {
  Heart,
  Inbox,
  LayoutDashboard,
  List,
  LogOut,
  PlusCircle,
  Settings2,
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

const accountDashboardItem: HeaderMenuItem = {
  label: "Личный кабинет",
  href: "/account",
  icon: User,
};

export function getHeaderMenuItems(user: HeaderUser | null): HeaderMenuItem[] {
  if (!user) {
    return [
      { label: "Войти", href: "/login", icon: User },
      { label: "Создать аккаунт", href: "/register", icon: User },
    ];
  }

  switch (user.role) {
    case "BUYER":
    case "SELLER":
      return [
        accountDashboardItem,
        { label: "Подать объявление", href: "/listings/new", icon: PlusCircle },
        { label: "Профиль компании", href: "/account/company", icon: LayoutDashboard },
        { label: "Мои объявления", href: "/account/listings", icon: List },
        { label: "Мои заявки", href: "/account/requests", icon: Inbox },
        { label: "Избранное", href: "/favorites", icon: Heart },
        { label: "Уведомления", href: "/notifications", icon: Inbox },
        { label: "Карго-настройки", href: "/seller/cargo-settings", icon: Settings2 },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "MODERATOR":
      return [
        { label: "Обзор админки", href: "/admin", icon: LayoutDashboard },
        {
          label: "Модерация",
          href: "/admin/moderation/listings",
          icon: Shield,
        },
        { label: "Жалобы", href: "/admin/reports", icon: Inbox },
        { label: "Уведомления", href: "/notifications", icon: Inbox },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    case "ADMIN":
      return [
        { label: "Обзор админки", href: "/admin", icon: LayoutDashboard },
        { label: "Пользователи", href: "/admin/users", icon: User },
        {
          label: "Модерация",
          href: "/admin/moderation/listings",
          icon: Shield,
        },
        { label: "Жалобы", href: "/admin/reports", icon: Inbox },
        { label: "Уведомления", href: "/notifications", icon: Inbox },
        { label: "Выйти", icon: LogOut, action: "logout" },
      ];
    default:
      return [accountDashboardItem, { label: "Выйти", icon: LogOut, action: "logout" }];
  }
}
