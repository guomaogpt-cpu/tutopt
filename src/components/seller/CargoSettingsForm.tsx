"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
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

function maskChatId(chatId: string): string {
  const trimmed = chatId.trim();
  if (trimmed.length <= 4) {
    return `…${trimmed}`;
  }
  return `…${trimmed.slice(-4)}`;
}

const sectionClassName =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-5";

const checkboxRowClassName =
  "flex min-h-11 items-start gap-3 rounded-xl border border-transparent px-1 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60";

const fieldClassName =
  "h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

export function CargoSettingsForm({ initialSettings }: CargoSettingsFormProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [enabled, setEnabled] = useState(initialSettings?.enabled ?? true);
  const [notifyInApp, setNotifyInApp] = useState(initialSettings?.notifyInApp ?? true);
  const [notifyTelegram, setNotifyTelegram] = useState(
    initialSettings?.notifyTelegram ?? false,
  );
  const [telegramChatId, setTelegramChatId] = useState(
    initialSettings?.telegramChatId ?? "",
  );
  const [telegramUsername, setTelegramUsername] = useState(
    initialSettings?.telegramUsername ?? "",
  );
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
  const [isTesting, setIsTesting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [waitingForConnect, setWaitingForConnect] = useState(false);
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [connectMessage, setConnectMessage] = useState<string | null>(null);

  useEffect(() => {
    setNotifyTelegram(initialSettings?.notifyTelegram ?? false);
    setTelegramChatId(initialSettings?.telegramChatId ?? "");
    setTelegramUsername(initialSettings?.telegramUsername ?? "");
    if (initialSettings?.telegramChatId) {
      setWaitingForConnect(false);
      setConnectUrl(null);
    }
  }, [initialSettings]);

  useEffect(() => {
    if (!waitingForConnect) {
      return;
    }
    const id = window.setInterval(() => {
      router.refresh();
    }, 4000);
    return () => window.clearInterval(id);
  }, [waitingForConnect, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setTestMessage(null);
    setTestError(null);

    if (notifyTelegram && !telegramChatId.trim()) {
      setError(t("cargo.telegram.chatIdRequired"));
      return;
    }

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
          notifyTelegram,
          notifyWhatsApp: false,
          telegramChatId: telegramChatId.trim() || null,
          telegramUsername: telegramUsername.trim() || null,
        }),
      });

      const body = (await response.json()) as {
        error?: { message?: string; details?: { fieldErrors?: Record<string, string[]> } };
      };

      if (!response.ok) {
        const fieldError =
          body.error?.details?.fieldErrors?.telegramChatId?.[0] ??
          body.error?.message;
        if (fieldError === "CARGO_TELEGRAM_CHAT_ID_REQUIRED") {
          throw new Error(t("cargo.telegram.chatIdRequired"));
        }
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

  async function handleConnectTelegram() {
    setError(null);
    setConnectMessage(null);
    setCopyDone(false);
    setIsConnecting(true);

    try {
      const response = await fetch("/api/cargo/telegram/connect-link", {
        method: "POST",
      });
      const body = (await response.json()) as {
        data?: { link: { url: string; expiresAt: string } };
        error?: { message?: string };
      };

      if (!response.ok) {
        if (body.error?.message === "TELEGRAM_BOT_USERNAME_MISSING") {
          throw new Error(t("cargo.telegram.botUsernameMissing"));
        }
        throw new Error(body.error?.message ?? t("cargo.telegram.connectFailed"));
      }

      const url = body.data?.link.url;
      if (!url) {
        throw new Error(t("cargo.telegram.connectFailed"));
      }

      setConnectUrl(url);
      setWaitingForConnect(true);
      setConnectMessage(t("cargo.telegram.linkCreated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cargo.telegram.connectFailed"));
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleCopyLink() {
    if (!connectUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(connectUrl);
      setCopyDone(true);
    } catch {
      setCopyDone(false);
    }
  }

  async function handleDisconnectTelegram() {
    setError(null);
    setIsDisconnecting(true);
    try {
      const response = await fetch("/api/cargo/telegram/disconnect", {
        method: "POST",
      });
      const body = (await response.json()) as {
        error?: { message?: string };
      };
      if (!response.ok) {
        throw new Error(body.error?.message ?? t("cargo.telegram.connectFailed"));
      }
      setNotifyTelegram(false);
      setConnectUrl(null);
      setWaitingForConnect(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("cargo.telegram.connectFailed"));
    } finally {
      setIsDisconnecting(false);
    }
  }

  async function handleTestTelegram() {
    setTestMessage(null);
    setTestError(null);

    if (!telegramChatId.trim()) {
      setTestError(t("cargo.telegram.chatIdRequired"));
      return;
    }

    setIsTesting(true);

    try {
      const response = await fetch("/api/seller/cargo-subscriptions/telegram-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: telegramChatId.trim() }),
      });

      const body = (await response.json()) as {
        data?: {
          result: {
            status: "sent" | "skipped" | "failed";
            reason?: string;
          };
        };
        error?: { message?: string };
      };

      if (!response.ok) {
        if (body.error?.message === "CARGO_TELEGRAM_CHAT_ID_REQUIRED") {
          throw new Error(t("cargo.telegram.chatIdRequired"));
        }
        throw new Error(body.error?.message ?? t("cargo.telegram.testFailed"));
      }

      const result = body.data?.result;
      if (result?.status === "sent") {
        setTestMessage(t("cargo.telegram.testSent"));
        return;
      }
      if (result?.status === "skipped" && result.reason === "missing_token") {
        setTestError(t("cargo.telegram.tokenMissing"));
        return;
      }
      setTestError(t("cargo.telegram.testFailed"));
    } catch (err) {
      setTestError(err instanceof Error ? err.message : t("cargo.telegram.testFailed"));
    } finally {
      setIsTesting(false);
    }
  }

  const hasChatId = Boolean(telegramChatId.trim());
  const telegramLinked = hasChatId;

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
          {t("cargo.telegram.title")}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("cargo.telegram.description")}
        </p>

        {telegramLinked ? (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                  notifyTelegram
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                {notifyTelegram
                  ? t("cargo.telegram.statusEnabled")
                  : t("cargo.telegram.statusDisabled")}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {telegramUsername
                  ? `@${telegramUsername.replace(/^@+/, "")}`
                  : maskChatId(telegramChatId)}
              </span>
            </div>

            <label className={checkboxRowClassName}>
              <input
                type="checkbox"
                checked={notifyTelegram}
                onChange={(event) => setNotifyTelegram(event.target.checked)}
                className="mt-1 size-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-950"
              />
              <span className="min-w-0 text-sm font-medium text-slate-800 dark:text-slate-200">
                {t("cargo.telegram.enable")}
              </span>
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                disabled={isTesting || isPending}
                onClick={handleTestTelegram}
                className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
              >
                {isTesting ? t("cargo.telegram.testSending") : t("cargo.telegram.testButton")}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isDisconnecting || isPending}
                onClick={handleDisconnectTelegram}
                className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
              >
                {t("cargo.telegram.disconnect")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {t("cargo.telegram.notConnected")}
            </p>
            <Button
              type="button"
              disabled={isConnecting || isPending}
              onClick={handleConnectTelegram}
              className="h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700"
            >
              {isConnecting ? t("cargo.subscription.saving") : t("cargo.telegram.connectButton")}
            </Button>

            {connectUrl ? (
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                {connectMessage ? (
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">{connectMessage}</p>
                ) : null}
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("cargo.telegram.connectInstruction")}
                </p>
                <a
                  href={connectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block break-all text-sm font-medium text-rose-700 underline-offset-2 hover:underline dark:text-rose-300"
                >
                  {t("cargo.telegram.openBot")}
                </a>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="h-10 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:w-auto"
                >
                  {copyDone ? t("cargo.telegram.linkCopied") : t("cargo.telegram.copyLink")}
                </Button>
              </div>
            ) : null}
          </div>
        )}

        {testMessage ? (
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400" role="status">
            {testMessage}
          </p>
        ) : null}
        {testError ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {testError}
          </p>
        ) : null}

        <details className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <summary className="cursor-pointer select-none px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">
            {t("cargo.telegram.manualMode")}
          </summary>
          <div className="space-y-3 border-t border-slate-200 px-3 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("cargo.telegram.saveHint")}
            </p>
            <div className="min-w-0">
              <label
                htmlFor="cargo-telegram-chat-id"
                className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t("cargo.telegram.chatId")}
              </label>
              <Input
                id="cargo-telegram-chat-id"
                value={telegramChatId}
                onChange={(event) => setTelegramChatId(event.target.value)}
                inputMode="numeric"
                autoComplete="off"
                className={fieldClassName}
                placeholder="123456789"
              />
            </div>
            <div className="min-w-0">
              <label
                htmlFor="cargo-telegram-username"
                className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t("cargo.telegram.username")}
              </label>
              <Input
                id="cargo-telegram-username"
                value={telegramUsername}
                onChange={(event) => setTelegramUsername(event.target.value)}
                autoComplete="off"
                className={fieldClassName}
                placeholder="@username"
              />
            </div>
            {!telegramLinked ? (
              <label className={checkboxRowClassName}>
                <input
                  type="checkbox"
                  checked={notifyTelegram}
                  onChange={(event) => setNotifyTelegram(event.target.checked)}
                  className="mt-1 size-4 shrink-0 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-950"
                />
                <span className="min-w-0 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {t("cargo.telegram.enable")}
                </span>
              </label>
            ) : null}
          </div>
        </details>
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
              className={fieldClassName}
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
              className={fieldClassName}
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
