const DISMISS_KEY = "vsetut-pwa-install-dismissed";
const INTERACTION_KEY = "vsetut-pwa-page-views";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function isStandaloneMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function isIosDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function wasInstallPromptDismissed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissInstallPrompt(): void {
  window.localStorage.setItem(DISMISS_KEY, "1");
}

export function trackPwaPageView(): number {
  const current = Number(window.localStorage.getItem(INTERACTION_KEY) ?? "0");
  const next = current + 1;
  window.localStorage.setItem(INTERACTION_KEY, String(next));
  return next;
}

export function getPwaPageViews(): number {
  return Number(window.localStorage.getItem(INTERACTION_KEY) ?? "0");
}

export function shouldOfferInstallPrompt(options?: {
  minPageViews?: number;
  force?: boolean;
}): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (isStandaloneMode()) {
    return false;
  }

  if (!options?.force && wasInstallPromptDismissed()) {
    return false;
  }

  const minPageViews = options?.minPageViews ?? 3;
  return getPwaPageViews() >= minPageViews;
}
