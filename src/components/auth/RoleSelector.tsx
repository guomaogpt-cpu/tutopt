"use client";

import { Check, ShoppingBag, Store } from "lucide-react";
import { cn } from "@/lib/utils";

type RegisterRole = "BUYER" | "SELLER";

type RoleSelectorProps = {
  value: RegisterRole;
  onChange: (role: RegisterRole) => void;
  disabled?: boolean;
  error?: string;
};

const roleOptions: Array<{
  value: RegisterRole;
  title: string;
  description: string;
  icon: typeof ShoppingBag;
}> = [
  {
    value: "BUYER",
    title: "Покупатель",
    description: "Ищу товары и отправляю заявки поставщикам",
    icon: ShoppingBag,
  },
  {
    value: "SELLER",
    title: "Продавец",
    description: "Публикую товары и получаю заявки от покупателей",
    icon: Store,
  },
];

export function RoleSelector({ value, onChange, disabled = false, error }: RoleSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-[#0F172A]">Тип аккаунта</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {roleOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={cn(
                "relative flex w-full flex-col items-start rounded-2xl border p-4 text-left transition",
                isSelected
                  ? "border-[#2563EB] bg-[#EFF6FF] shadow-[0_4px_16px_rgba(37,99,235,0.12)]"
                  : "border-[rgba(148,163,184,0.25)] bg-white hover:border-[rgba(37,99,235,0.25)]",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {isSelected ? (
                <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#2563EB] text-white">
                  <Check className="size-3" aria-hidden="true" />
                </span>
              ) : null}

              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  isSelected ? "bg-white text-[#2563EB]" : "bg-[#F8FAFC] text-[#64748B]",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <span className="mt-3 font-semibold text-[#0F172A]">{option.title}</span>
              <span className="mt-1 text-xs leading-relaxed text-[#64748B] sm:text-sm">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      {error ? <p className="text-sm text-[#DC2626]">{error}</p> : null}
    </fieldset>
  );
}
