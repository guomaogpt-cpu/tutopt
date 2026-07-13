import type { UserRole } from "@prisma/client";
import { cn } from "@/lib/utils";

const roleLabels: Record<UserRole, string> = {
  BUYER: "Покупатель",
  SELLER: "Продавец",
  MODERATOR: "Модератор",
  ADMIN: "Админ",
};

const roleBadgeClass: Record<UserRole, string> = {
  BUYER: "bg-slate-100 text-slate-700",
  SELLER: "bg-[#EFF6FF] text-[#2563EB]",
  MODERATOR: "bg-[#FFFBEB] text-[#D97706]",
  ADMIN: "bg-[#F1F5F9] text-[#0F172A]",
};

type UserRoleBadgeProps = {
  role: UserRole;
  className?: string;
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        roleBadgeClass[role],
        className,
      )}
    >
      {roleLabels[role]}
    </span>
  );
}
