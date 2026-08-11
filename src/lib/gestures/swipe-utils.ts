export function isInteractiveGestureTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, button, a, label, [contenteditable="true"], [role="slider"]',
    ),
  );
}

type TouchLike = {
  clientX: number;
  clientY: number;
};

export function getTouchPoint(touch: TouchLike): { x: number; y: number } {
  return { x: touch.clientX, y: touch.clientY };
}
