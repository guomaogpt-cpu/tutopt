"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

const HEADER_HEIGHT_VAR = "--site-header-height";

export type SiteHeaderMetrics = {
  height: number;
};

/** Track fixed header height and expose CSS variable for overlays. */
export function useSiteHeaderHeight(headerRef: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = headerRef.current;
    if (!element) {
      return;
    }

    function updateHeight() {
      const current = headerRef.current;
      if (!current) {
        return;
      }

      const nextHeight = Math.ceil(current.getBoundingClientRect().height);
      setHeight(nextHeight);
      document.documentElement.style.setProperty(HEADER_HEIGHT_VAR, `${nextHeight}px`);
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
      document.documentElement.style.removeProperty(HEADER_HEIGHT_VAR);
    };
  }, [headerRef]);

  return height;
}

export { HEADER_HEIGHT_VAR };
