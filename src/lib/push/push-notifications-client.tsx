"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";
import { sanitizePushPath } from "@/lib/push/push-path";

type PushRegistrationState = "idle" | "registering" | "registered" | "denied" | "unsupported";

type PushNotificationsContextValue = {
  state: PushRegistrationState;
  isNativeAndroid: boolean;
  enablePush: () => Promise<{ ok: boolean; reason?: string }>;
  disablePush: () => Promise<boolean>;
  sendTestPush: () => Promise<{ ok: boolean; sent?: number; reason?: string }>;
};

const PushNotificationsContext = createContext<PushNotificationsContextValue | null>(null);

async function registerTokenOnServer(token: string): Promise<boolean> {
  const response = await fetch("/api/push/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      platform: "ANDROID",
    }),
  });

  return response.ok;
}

async function unregisterTokenOnServer(token: string | null): Promise<boolean> {
  const response = await fetch("/api/push/unregister", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  return response.ok;
}

export function PushNotificationsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<PushRegistrationState>("idle");
  const tokenRef = useRef<string | null>(null);
  const isNativeAndroid =
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";

  useEffect(() => {
    if (!isNativeAndroid) {
      setState("unsupported");
      return;
    }

    let cancelled = false;

    async function setupPushListeners() {
      const { PushNotifications } = await import("@capacitor/push-notifications");

      await PushNotifications.addListener("registration", async (event) => {
        if (cancelled) {
          return;
        }

        tokenRef.current = event.value;
        const ok = await registerTokenOnServer(event.value);
        if (!cancelled) {
          setState(ok ? "registered" : "idle");
        }
      });

      await PushNotifications.addListener("registrationError", () => {
        if (!cancelled) {
          setState("idle");
        }
      });

      await PushNotifications.addListener("pushNotificationReceived", () => {
        // In-app unread sync handles badge updates.
      });

      await PushNotifications.addListener("pushNotificationActionPerformed", (event) => {
        const rawUrl =
          typeof event.notification.data?.url === "string"
            ? event.notification.data.url
            : null;
        router.push(sanitizePushPath(rawUrl));
      });
    }

    void setupPushListeners();

    return () => {
      cancelled = true;
    };
  }, [isNativeAndroid, router]);

  const enablePush = useCallback(async (): Promise<{ ok: boolean; reason?: string }> => {
    if (!isNativeAndroid) {
      return { ok: false, reason: "unsupported" };
    }

    setState("registering");

    try {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      const permission = await PushNotifications.requestPermissions();

      if (permission.receive !== "granted") {
        setState("denied");
        return { ok: false, reason: "denied" };
      }

      await PushNotifications.register();
      return { ok: true };
    } catch {
      setState("idle");
      return { ok: false, reason: "error" };
    }
  }, [isNativeAndroid]);

  const disablePush = useCallback(async (): Promise<boolean> => {
    const token = tokenRef.current;
    const ok = await unregisterTokenOnServer(token);
    if (ok) {
      setState("idle");
    }
    return ok;
  }, []);

  const sendTestPush = useCallback(async (): Promise<{
    ok: boolean;
    sent?: number;
    reason?: string;
  }> => {
    const response = await fetch("/api/push/test", { method: "POST" });
    const body = (await response.json()) as {
      data?: {
        sent: number;
        failed: number;
        skipped: boolean;
        reason?: string;
      };
      error?: { message?: string };
    };

    if (!response.ok) {
      return { ok: false, reason: body.error?.message ?? "error" };
    }

    const data = body.data;
    if (data?.skipped) {
      return { ok: false, reason: data.reason ?? "skipped" };
    }

    return { ok: (data?.sent ?? 0) > 0, sent: data?.sent ?? 0 };
  }, []);

  const value = useMemo(
    () => ({
      state,
      isNativeAndroid,
      enablePush,
      disablePush,
      sendTestPush,
    }),
    [state, isNativeAndroid, enablePush, disablePush, sendTestPush],
  );

  return (
    <PushNotificationsContext.Provider value={value}>{children}</PushNotificationsContext.Provider>
  );
}

export function usePushNotifications(): PushNotificationsContextValue {
  const context = useContext(PushNotificationsContext);
  if (!context) {
    throw new Error("usePushNotifications must be used within PushNotificationsProvider");
  }
  return context;
}
