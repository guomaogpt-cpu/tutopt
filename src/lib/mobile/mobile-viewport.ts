const KEYBOARD_INSET_VAR = "--keyboard-inset";

export function syncMobileKeyboardInset(): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const viewport = window.visualViewport;
  if (!viewport) {
    return () => undefined;
  }

  const update = () => {
    const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    document.documentElement.style.setProperty(KEYBOARD_INSET_VAR, `${Math.round(inset)}px`);
  };

  update();
  viewport.addEventListener("resize", update);
  viewport.addEventListener("scroll", update);

  return () => {
    viewport.removeEventListener("resize", update);
    viewport.removeEventListener("scroll", update);
    document.documentElement.style.setProperty(KEYBOARD_INSET_VAR, "0px");
  };
}

export function mobileStickyBottomOffset(baseRem = 5): string {
  return `calc(${baseRem}rem + env(safe-area-inset-bottom) + var(--keyboard-inset, 0px))`;
}

export function closeTopmostOverlay(): boolean {
  const fullscreenGallery = document.querySelector<HTMLElement>(
    '[data-listing-fullscreen-gallery][data-state="open"]',
  );
  if (fullscreenGallery) {
    fullscreenGallery.querySelector<HTMLElement>("[data-gallery-close]")?.click();
    return true;
  }

  const openDialog = document.querySelector('[role="dialog"][data-state="open"]');
  if (!openDialog) {
    return false;
  }

  const closeButton =
    openDialog.querySelector<HTMLElement>("button.absolute") ??
    openDialog.querySelector<HTMLElement>('button:has(span.sr-only)');
  if (closeButton) {
    closeButton.click();
    return true;
  }

  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  return true;
}

export function blurActiveField(): boolean {
  const active = document.activeElement;
  if (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement ||
    active instanceof HTMLSelectElement
  ) {
    active.blur();
    return true;
  }
  return false;
}
