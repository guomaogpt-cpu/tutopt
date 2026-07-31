"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type CargoSubscriptionToggleProps = {
  initiallyActive: boolean;
};

export function CargoSubscriptionToggle({ initiallyActive }: CargoSubscriptionToggleProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isActive, setIsActive] = useState(initiallyActive);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setError(null);
    setIsPending(true);
    const next = !isActive;

    try {
      const response = await fetch("/api/seller/cargo-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: next }),
      });

      const body = (await response.json()) as {
        data?: { subscription: { isActive: boolean } };
        error?: { message?: string };
      };

      if (!response.ok) {
        throw new Error(body.error?.message ?? t("cargo.subscription.error"));
      }

      setIsActive(body.data?.subscription.isActive ?? next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cargo.subscription.error"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-rose-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t("cargo.subscription.title")}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isActive
              ? t("cargo.subscription.activeDescription")
              : t("cargo.subscription.inactiveDescription")}
          </p>
        </div>

        <Button
          type="button"
          disabled={isPending}
          onClick={handleToggle}
          className={cn(
            "h-11 w-full shrink-0 rounded-xl sm:w-auto",
            isActive
              ? "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              : "bg-rose-600 text-white hover:bg-rose-700",
          )}
          variant={isActive ? "outline" : "default"}
        >
          {isActive ? (
            <>
              <BellOff className="mr-2 size-4" aria-hidden="true" />
              {isPending ? t("cargo.subscription.saving") : t("cargo.subscription.unsubscribe")}
            </>
          ) : (
            <>
              <Bell className="mr-2 size-4" aria-hidden="true" />
              {isPending ? t("cargo.subscription.saving") : t("cargo.subscription.subscribe")}
            </>
          )}
        </Button>
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
