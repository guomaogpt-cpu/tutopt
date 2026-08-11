import { Capacitor } from "@capacitor/core";

/** True when running inside Capacitor Android/iOS wrapper (not mobile browser). */
export function isNativeApp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Capacitor.isNativePlatform();
}
