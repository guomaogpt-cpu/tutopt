"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { CargoSubscriptionSettings } from "@/features/cargo/lib/cargo-subscription-data";
import {
  CARGO_DIRECTION_IDS,
  CARGO_DIRECTION_LABEL_KEY,
  CARGO_SERVICE_TYPE_IDS,
  CARGO_SERVICE_TYPE_LABEL_KEY,
  type CargoDirectionId,
  type CargoServiceTypeId,
} from "@/features/cargo/lib/cargo-subscription-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type CargoSettingsFormProps = {
  initialSettings: CargoSubscriptionSettings | null;
};

function toggleId<T extends string>(list: T[], id: T): T[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

function locationsToText(items: string[]): string {
  return items.join(", ");
}

function textToLocations(value: string): string[] {
  return value
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 30);
}

const sectionClassName =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5";

const checkboxRowClassName =
  "flex min-h-11 items-start gap-3 rounded-xl border border-transparent px-1 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60";

export function CargoSettingsForm({ initialSettings }: CargoSettingsFormProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [enabled, setEnabled] = useState(initialSettings?.enabled ?? true);
  const [notifyInApp, setNotifyInApp] = useState(initialSettings?.notifyInApp ?? true);
  const [serviceTypes, setServiceTypes] = useState<CargoServiceTypeId[]>(
    (initialSettings?.serviceTypes ?? []) as CargoServiceTypeId[],
  );
  const [directions, setDirections] = useState<CargoDirectionId[]>(
    (initialSettings?.directions ?? []) as CargoDirectionId[],
  );
  const [fromLocationsText, setFromLocationsText] = useState(
    locationsToText(initialSettings?.fromLocations ?? []),
  );
  const [toLocationsText, setToLocationsText] = useState(
    locationsToText(initialSettings?.toLocations ?? []),
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsPending(true);

    try {
      const response = await fetch("/api/seller/cargo-subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          serviceTypes,
          directions,
          fromLocations: textToLocations(fromLocationsText),
          toLocations: textToLocations(toLocationsText),
          notifyInApp,
          notifyEmail: false,
          notifyTelegram: false,
          notifyWhatsApp: false,
        }),
      });

      const body = (await response.json()) as {
        error?: { message?: string };
      };

      if (!response.ok) {
        throw new Error(body.error?.message ?? t("cargo.settings.saveError"));
      }

      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cargo.settings.saveError"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-24 sm:pb-8">
      <section className={sectionClassName}>
        <label className={checkboxRowClassName}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
            className="mt-1 size-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-950"
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t("cargo.settings.enabled")}
            </span>
          </span>
        </label>

        <label className={cn(checkboxRowClassName, "mt-1")}>
          <input
            type="checkbox"
            checked={notifyInApp}
            onChange={(event) => setNotifyInApp(event.target.checked)}
            className="mt-1 size-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-950"
          />
          <span className="min-w-0 text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("cargo.settings.notifyInApp")}
          </span>
        </label>
      </section>

      <section className={sectionClassName}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t("cargo.settings.serviceTypes")}
        </h2>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {CARGO_SERVICE_TYPE_IDS.map((id) => (
            <label key={id} className={checkboxRowClassName}>
              <input
                type="checkbox"
                checked={serviceTypes.includes(id)}
                onChange={() => setServiceTypes((prev) => toggleId(prev, id))}
                className="mt-1 size-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-950"
              />
              <span className="text-sm text-slate-800 dark:text-slate-200">
                {t(CARGO_SERVICE_TYPE_LABEL_KEY[id])}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className={sectionClassName}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t("cargo.settings.directions")}
        </h2>
        <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
          {CARGO_DIRECTION_IDS.map((id) => (
            <label key={id} className={checkboxRowClassName}>
              <input
                type="checkbox"
                checked={directions.includes(id)}
                onChange={() => setDirections((prev) => toggleId(prev, id))}
                className="mt-1 size-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-950"
              />
              <span className="text-sm text-slate-800 dark:text-slate-200">
                {t(CARGO_DIRECTION_LABEL_KEY[id])}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className={sectionClassName}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="cargo-from-locations"
              className="mb-1.5 block text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              {t("cargo.settings.fromLocations")}
            </label>
            <Input
              id="cargo-from-locations"
              value={fromLocationsText}
              onChange={(event) => setFromLocationsText(event.target.value)}
              placeholder="Guangzhou, Urumqi"
              className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
          <div className="min-w-0">
            <label
              htmlFor="cargo-to-locations"
              className="mb-1.5 block text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              {t("cargo.settings.toLocations")}
            </label>
            <Input
              id="cargo-to-locations"
              value={toLocationsText}
              onChange={(event) => setToLocationsText(event.target.value)}
              placeholder="Bishkek, Osh"
              className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>
        </div>
      </section>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-400" role="status">
          {t("cargo.settings.saved")}
        </p>
      ) : null}

      <div className="sticky bottom-16 z-10 sm:static sm:bottom-auto">
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700 sm:w-auto sm:min-w-[220px]"
        >
          {isPending ? t("cargo.subscription.saving") : t("cargo.settings.save")}
        </Button>
      </div>
    </form>
  );
}
