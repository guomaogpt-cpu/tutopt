import { AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type SellerAccountStatusCardProps = {
  labels: string[];
  hasRestrictions: boolean;
};

export function SellerAccountStatusCard({
  labels,
  hasRestrictions,
}: SellerAccountStatusCardProps) {
  return (
    <section
      aria-labelledby="seller-account-status-title"
      className={cn(
        "rounded-3xl border p-5 sm:p-6",
        hasRestrictions
          ? "border-[rgba(220,38,38,0.2)] bg-[#FEF2F2]"
          : "border-[rgba(5,150,105,0.18)] bg-[#F0FDF4]",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            hasRestrictions ? "bg-white text-[#DC2626]" : "bg-white text-[#059669]",
          )}
        >
          {hasRestrictions ? (
            <AlertTriangle className="size-5" aria-hidden="true" />
          ) : (
            <ShieldCheck className="size-5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <h2 id="seller-account-status-title" className="text-lg font-bold text-[#0F172A]">
            Статус аккаунта
          </h2>
          {hasRestrictions ? (
            <p className="text-sm text-[#B91C1C]">
              Аккаунт ограничен. Некоторые действия недоступны.
            </p>
          ) : (
            <p className="text-sm text-[#475569]">Все функции продавца доступны</p>
          )}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {labels.map((label) => (
          <li
            key={label}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              label === "Активен"
                ? "bg-white text-[#059669] ring-1 ring-[rgba(5,150,105,0.25)]"
                : "bg-white text-[#B91C1C] ring-1 ring-[rgba(220,38,38,0.25)]",
            )}
          >
            {label}
          </li>
        ))}
      </ul>

      {hasRestrictions ? (
        <p className="mt-3 text-xs text-[#64748B]">
          Если вы считаете, что это ошибка, обратитесь в поддержку.
        </p>
      ) : null}
    </section>
  );
}
