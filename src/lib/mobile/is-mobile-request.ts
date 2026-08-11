import { headers } from "next/headers";

/** Best-effort mobile detection for SSR data trimming (Capacitor WebView, phones). */
export async function isMobileUserAgentRequest(): Promise<boolean> {
  const headerList = await headers();
  const mobileHint = headerList.get("sec-ch-ua-mobile");
  if (mobileHint === "?1") {
    return true;
  }

  const userAgent = headerList.get("user-agent") ?? "";
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    userAgent,
  );
}
