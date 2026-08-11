"use client";

import { useCallback, useRef, useState } from "react";
import { useSwipeGesture } from "@/hooks/use-swipe-gesture";

type UseDrawerSwipeDismissOptions = {
  enabled?: boolean;
  onDismiss: () => void;
  canDismiss?: () => boolean;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  dismissThreshold?: number;
};

export function useDrawerSwipeDismiss({
  enabled = true,
  onDismiss,
  canDismiss,
  scrollContainerRef,
  dismissThreshold = 96,
}: UseDrawerSwipeDismissOptions) {
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const startScrollTopRef = useRef(0);
  const isDraggingRef = useRef(false);

  const resetDrag = useCallback(() => {
    isDraggingRef.current = false;
    setDragOffsetY(0);
  }, []);

  const handleDismiss = useCallback(() => {
    if (canDismiss && !canDismiss()) {
      resetDrag();
      return;
    }

    resetDrag();
    onDismiss();
  }, [canDismiss, onDismiss, resetDrag]);

  const { swipeHandlers } = useSwipeGesture({
    enabled,
    axis: "vertical",
    threshold: dismissThreshold,
    ignoreInteractive: true,
    onSwipeDown: handleDismiss,
    onDrag: (offset, phase) => {
      const scrollEl = scrollContainerRef?.current;
      const scrollTop = scrollEl?.scrollTop ?? 0;

      if (phase === "move") {
        if (scrollTop > 0 || offset.y <= 0) {
          if (isDraggingRef.current) {
            resetDrag();
          }
          return;
        }

        if (canDismiss && !canDismiss()) {
          return;
        }

        isDraggingRef.current = true;
        setDragOffsetY(Math.min(offset.y, 160));
        return;
      }

      if (phase === "end" || phase === "cancel") {
        if (isDraggingRef.current && offset.y >= dismissThreshold) {
          handleDismiss();
          return;
        }

        resetDrag();
      }
    },
    onSwipeLeft: undefined,
  });

  const onTouchStart = useCallback(
    (event: React.TouchEvent) => {
      const scrollEl = scrollContainerRef?.current;
      startScrollTopRef.current = scrollEl?.scrollTop ?? 0;
      swipeHandlers.onTouchStart(event);
    },
    [scrollContainerRef, swipeHandlers],
  );

  return {
    dragOffsetY,
    swipeHandlers: {
      ...swipeHandlers,
      onTouchStart,
    },
  };
}
