export const HOME_WELCOME_DISMISSED_KEY = "vsetut_home_welcome_dismissed_v1";
export const LISTING_FORM_HINT_DISMISSED_KEY = "listingFormHintDismissed";

export function readOnboardingDismissed(key: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeOnboardingDismissed(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // ignore storage errors (private mode, WebView quirks)
  }
}

/** Skip welcome on very small viewports where the block would crowd the first screen. */
export function isViewportLargeEnoughForWelcome(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return window.innerWidth >= 320 && window.innerHeight >= 520;
}
