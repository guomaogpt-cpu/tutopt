/** Bottom sheet on mobile; centered dialog on md+ viewports. */
export const responsiveModalContentClass =
  "gap-0 overflow-hidden max-h-[min(85dvh,calc(100dvh-env(safe-area-inset-bottom)-var(--keyboard-inset,0px)))] md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[calc(100%-2rem)] md:max-w-[560px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:border md:max-h-[85vh] md:[&_[data-drawer-handle]]:hidden";

export const responsiveModalWideContentClass =
  "gap-0 overflow-hidden max-h-[min(85dvh,calc(100dvh-env(safe-area-inset-bottom)-var(--keyboard-inset,0px)))] md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-[calc(100%-2rem)] md:max-w-[640px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:border md:max-h-[85vh] md:[&_[data-drawer-handle]]:hidden";
