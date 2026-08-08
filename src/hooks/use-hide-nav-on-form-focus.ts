"use client";

import { useEffect, useState } from "react";

const FORM_FIELD_SELECTOR = "input, textarea, select, [contenteditable='true']";

/**
 * Hides bottom nav while a form field is focused (mobile keyboards).
 * Used on listing creation and other long forms.
 */
export function useHideNavOnFormFocus(enabled: boolean): boolean {
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      setHideNav(false);
      return;
    }

    function isFormField(element: EventTarget | null): boolean {
      if (!(element instanceof HTMLElement)) {
        return false;
      }
      return element.matches(FORM_FIELD_SELECTOR);
    }

    function handleFocusIn(event: FocusEvent) {
      setHideNav(isFormField(event.target));
    }

    function handleFocusOut() {
      window.setTimeout(() => {
        const active = document.activeElement;
        setHideNav(isFormField(active));
      }, 50);
    }

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [enabled]);

  return hideNav;
}
