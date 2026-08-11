"use client";

import { useCallback, useRef } from "react";
import { getTouchPoint, isInteractiveGestureTarget } from "@/lib/gestures/swipe-utils";

export type SwipeAxis = "horizontal" | "vertical" | "both";

export type SwipeDragPhase = "move" | "end" | "cancel";

export type UseSwipeGestureOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDrag?: (offset: { x: number; y: number }, phase: SwipeDragPhase) => void;
  threshold?: number;
  axis?: SwipeAxis;
  enabled?: boolean;
  ignoreInteractive?: boolean;
};

export type SwipeGestureHandlers = {
  onTouchStart: (event: React.TouchEvent) => void;
  onTouchMove: (event: React.TouchEvent) => void;
  onTouchEnd: (event: React.TouchEvent) => void;
  onTouchCancel: (event: React.TouchEvent) => void;
};

export function useSwipeGesture(options: UseSwipeGestureOptions): {
  swipeHandlers: SwipeGestureHandlers;
} {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const lockedAxisRef = useRef<"horizontal" | "vertical" | null>(null);

  const resetGesture = useCallback((phase: SwipeDragPhase) => {
    startRef.current = null;
    lockedAxisRef.current = null;
    optionsRef.current.onDrag?.({ x: 0, y: 0 }, phase);
  }, []);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    const opts = optionsRef.current;
    if (opts.enabled === false) {
      return;
    }

    if (opts.ignoreInteractive !== false && isInteractiveGestureTarget(event.target)) {
      return;
    }

    if (event.touches.length !== 1) {
      return;
    }

    startRef.current = getTouchPoint(event.touches[0]!);
    lockedAxisRef.current = null;
  }, []);

  const onTouchMove = useCallback((event: React.TouchEvent) => {
    const start = startRef.current;
    if (!start || event.touches.length !== 1) {
      return;
    }

    const touch = getTouchPoint(event.touches[0]!);
    const dx = touch.x - start.x;
    const dy = touch.y - start.y;

    if (!lockedAxisRef.current) {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX > 10 || absY > 10) {
        lockedAxisRef.current = absX > absY ? "horizontal" : "vertical";
      }
    }

    optionsRef.current.onDrag?.({ x: dx, y: dy }, "move");
  }, []);

  const onTouchEnd = useCallback((event: React.TouchEvent) => {
    const start = startRef.current;
    if (!start) {
      return;
    }

    const touch = getTouchPoint(event.changedTouches[0]!);
    const dx = touch.x - start.x;
    const dy = touch.y - start.y;
    const threshold = optionsRef.current.threshold ?? 48;
    const axis = optionsRef.current.axis ?? "both";
    const lock = lockedAxisRef.current;

    optionsRef.current.onDrag?.({ x: dx, y: dy }, "end");

    if (lock === "horizontal" && axis !== "vertical") {
      if (dx <= -threshold) {
        optionsRef.current.onSwipeLeft?.();
      } else if (dx >= threshold) {
        optionsRef.current.onSwipeRight?.();
      }
    }

    if (lock === "vertical" && axis !== "horizontal") {
      if (dy <= -threshold) {
        optionsRef.current.onSwipeUp?.();
      } else if (dy >= threshold) {
        optionsRef.current.onSwipeDown?.();
      }
    }

    resetGesture("end");
  }, [resetGesture]);

  const onTouchCancel = useCallback(() => {
    resetGesture("cancel");
  }, [resetGesture]);

  return {
    swipeHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
    },
  };
}
