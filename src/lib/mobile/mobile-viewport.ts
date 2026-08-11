const KEYBOARD_INSET_VAR = "--keyboard-inset";

export function syncMobileKeyboardInset(): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const viewport = window.visualViewport;
  if (!viewport) {
    return () => undefined;
  }

  let rafId = 0;
  let lastInset = -1;

  const update = () => {
    rafId = 0;
    const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    const rounded = Math.round(inset);
    if (rounded === lastInset) {
      return;
    }
    lastInset = rounded;
    document.documentElement.style.setProperty(KEYBOARD_INSET_VAR, `${rounded}px`);
  };

  const scheduleUpdate = () => {
    if (rafId !== 0) {
      return;
    }
    rafId = window.requestAnimationFrame(update);
  };

  update();
  viewport.addEventListener("resize", scheduleUpdate);
  viewport.addEventListener("scroll", scheduleUpdate);

  return () => {
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
    }
    viewport.removeEventListener("resize", scheduleUpdate);
    viewport.removeEventListener("scroll", scheduleUpdate);
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
