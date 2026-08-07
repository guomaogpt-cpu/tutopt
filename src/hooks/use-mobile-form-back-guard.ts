"use client";

import { useEffect, useRef } from "react";

type UseMobileFormBackGuardOptions = {
  enabled: boolean;
  message: string;
};

export function useMobileFormBackGuard({
  enabled,
  message,
}: UseMobileFormBackGuardOptions): void {
  const armedRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      armedRef.current = false;
      return;
    }

    if (!armedRef.current) {
      window.history.pushState({ mobileFormGuard: true }, "", window.location.href);
      armedRef.current = true;
    }

    function handlePopState() {
      const shouldLeave = window.confirm(message);
      if (shouldLeave) {
        armedRef.current = false;
        window.history.back();
        return;
      }

      window.history.pushState({ mobileFormGuard: true }, "", window.location.href);
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      armedRef.current = false;
    };
  }, [enabled, message]);
}
