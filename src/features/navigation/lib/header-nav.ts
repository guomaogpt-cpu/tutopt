import type { HeaderUser } from "@/features/navigation/lib/header-menu";

export type NavLinkItem = {
  label: string;
  href: string;
};

export const HEADER_PRIMARY_LINKS: NavLinkItem[] = [
  { label: "Каталог", href: "/listings" },
  { label: "Опт", href: "/opt" },
  { label: "Маркет", href: "/market" },
  { label: "Услуги", href: "/services" },
  { label: "Карго", href: "/cargo" },
  { label: "Продавцы", href: "/sellers" },
];

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/listings") {
    return (
      pathname === "/listings" ||
      (pathname.startsWith("/listings/") && pathname !== "/listings/new")
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getMobileDrawerLinks(user: HeaderUser | null): NavLinkItem[] {
  const links: NavLinkItem[] = [
    ...HEADER_PRIMARY_LINKS,
    { label: "Категории", href: "/categories" },
  ];

  if (!user) {
    return links;
  }

  switch (user.role) {
    case "BUYER":
      links.push({ label: "Кабинет покупателя", href: "/buyer/dashboard" });
      links.push({ label: "Избранное", href: "/favorites" });
      links.push({ label: "Уведомления", href: "/notifications" });
      break;
    case "SELLER":
      links.push({ label: "Кабинет продавца", href: "/seller/dashboard" });
      links.push({ label: "Заявки", href: "/seller/leads" });
      links.push({ label: "Подать объявление", href: "/listings/new" });
      links.push({ label: "Избранное", href: "/favorites" });
      links.push({ label: "Уведомления", href: "/notifications" });
      break;
    case "MODERATOR":
      links.push({ label: "Обзор админки", href: "/admin" });
      links.push({ label: "Модерация", href: "/admin/moderation/listings" });
      links.push({ label: "Уведомления", href: "/notifications" });
      break;
    case "ADMIN":
      links.push({ label: "Обзор админки", href: "/admin" });
      links.push({ label: "Пользователи", href: "/admin/users" });
      links.push({ label: "Модерация", href: "/admin/moderation/listings" });
      links.push({ label: "Уведомления", href: "/notifications" });
      break;
    default:
      break;
  }

  return links;
}
