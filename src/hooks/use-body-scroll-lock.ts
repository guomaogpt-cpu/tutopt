"use client";

import { useEffect, useRef } from "react";

type BodyStyleSnapshot = {
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overflow: string;
  paddingRight: string;
};

/**
 * Locks body scroll while preserving viewport position.
 * Avoids sticky-header breakage from overflow:hidden alone.
 */
export function useBodyScrollLock(locked: boolean): void {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!locked || typeof document === "undefined") {
      return;
    }

    scrollYRef.current = window.scrollY;
    const { style } = document.body;
    const snapshot: BodyStyleSnapshot = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
      paddingRight: style.paddingRight,
    };

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    style.position = "fixed";
    style.top = `-${scrollYRef.current}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      style.position = snapshot.position;
      style.top = snapshot.top;
      style.left = snapshot.left;
      style.right = snapshot.right;
      style.width = snapshot.width;
      style.overflow = snapshot.overflow;
      style.paddingRight = snapshot.paddingRight;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [locked]);
}
