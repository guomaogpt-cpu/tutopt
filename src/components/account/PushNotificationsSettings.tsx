"use client";

import { Bell, BellOff, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/lib/push/push-notifications-client";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

const cardClassName = cn(
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
  "dark:border-slate-800 dark:bg-slate-900 sm:p-5",
);

export function PushNotificationsSettings() {
  const { t } = useTranslation();
  const { state, enablePush, disablePush, sendTestPush, isNativeAndroid } = usePushNotifications();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const isEnabled = state === "registered" || state === "registering";
  const isDenied = state === "denied";

  if (!isNativeAndroid) {
    return null;
  }

  async function handleEnable() {
    setMessage(null);
    setError(null);
    setIsBusy(true);

    try {
      const result = await enablePush();
      if (result.ok) {
        setMessage(t("push.settings.enabledSuccess"));
        return;
      }
      if (result.reason === "denied") {
        setError(t("push.settings.permissionDenied"));
        return;
      }
      if (result.reason === "unsupported") {
        setError(t("push.settings.unavailableBrowser"));
        return;
      }
      setError(t("push.settings.enableFailed"));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDisable() {
    setMessage(null);
    setError(null);
    setIsBusy(true);

    try {
      const ok = await disablePush();
      if (ok) {
        setMessage(t("push.settings.disabledSuccess"));
        return;
      }
      setError(t("push.settings.disableFailed"));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleTest() {
    setMessage(null);
    setError(null);
    setIsBusy(true);

    try {
      const result = await sendTestPush();
      if (result.ok) {
        setMessage(t("push.settings.testSent"));
        return;
      }
      if (result.reason === "no_tokens") {
        setError(t("push.settings.noTokens"));
        return;
      }
      if (result.reason === "missing_firebase_config") {
        setError(t("push.settings.firebaseMissing"));
        return;
      }
      setError(t("push.settings.testFailed"));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section aria-labelledby="push-settings-title" className={cardClassName}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <Bell className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="push-settings-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            {t("push.settings.title")}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t("push.settings.description")}
          </p>

          <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            {isNativeAndroid
              ? isEnabled
                ? t("push.settings.statusEnabled")
                : isDenied
                  ? t("push.settings.statusPermissionRequired")
                  : t("push.settings.statusDisabled")
              : t("push.settings.statusBrowser")}
          </p>

          {isDenied ? (
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
              {t("push.settings.permissionDeniedHint")}
            </p>
          ) : null}

          {message ? (
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
          ) : null}
          {error ? (
            <p className="mt-2 text-sm text-rose-700 dark:text-rose-400">{error}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {!isEnabled ? (
              <Button type="button" size="sm" disabled={isBusy} onClick={() => void handleEnable()}>
                <Bell className="size-4" aria-hidden="true" />
                {t("push.settings.enable")}
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isBusy}
                onClick={() => void handleDisable()}
              >
                <BellOff className="size-4" aria-hidden="true" />
                {t("push.settings.disable")}
              </Button>
            )}

            {isEnabled ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isBusy}
                onClick={() => void handleTest()}
              >
                <Send className="size-4" aria-hidden="true" />
                {t("push.settings.test")}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
