"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { logoutRequest } from "@/features/auth/lib/auth-client";
import {
  getHeaderMenuItems,
  type HeaderMenuItem,
  type HeaderUser,
} from "@/features/navigation/lib/header-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown";

type UserMenuProps = {
  user: HeaderUser | null;
  align?: "start" | "end";
};

export function UserMenu({ user, align = "end" }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const items = getHeaderMenuItems(user);
  const menuLabel = user ? `Меню пользователя: ${user.name}` : "Меню входа";

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logoutRequest();
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  }

  function handleItemSelect(item: HeaderMenuItem) {
    if (item.action === "logout") {
      void handleLogout();
      return;
    }

    if (item.disabled || !item.href) {
      return;
    }

    setOpen(false);
  }

  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger asChild>
        <Button
          variant="outline"
          className="h-10 shrink-0 gap-2 px-2.5"
          aria-label={menuLabel}
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          {user ? (
            <span className="hidden max-w-[120px] truncate font-medium xl:inline">{user.name}</span>
          ) : null}
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </Button>
      </DropdownTrigger>

      <DropdownContent align={align} className="min-w-[220px]">
        {user ? (
          <>
            <DropdownLabel className="px-2 py-2 font-normal">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                {getRoleLabel(user.role)}
              </p>
            </DropdownLabel>
            <DropdownSeparator />
          </>
        ) : null}

        {items.map((item) => {
          const Icon = item.icon;
          const isLogout = item.action === "logout";

          if (isLogout) {
            return (
              <DropdownItem
                key={item.label}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  handleItemSelect(item);
                }}
              >
                <LogOut className="size-4" aria-hidden="true" />
                {item.label}
              </DropdownItem>
            );
          }

          if (item.disabled || !item.href) {
            return (
              <DropdownItem key={item.label} disabled>
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  скоро
                </Badge>
              </DropdownItem>
            );
          }

          return (
            <DropdownItem key={`${item.label}-${item.href}`} asChild>
              <Link
                href={item.href}
                onClick={() => handleItemSelect(item)}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            </DropdownItem>
          );
        })}
      </DropdownContent>
    </Dropdown>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getRoleLabel(role: HeaderUser["role"]): string {
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
