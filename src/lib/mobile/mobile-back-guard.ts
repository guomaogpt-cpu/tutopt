type MobileBackGuard = {
  message: string;
};

let activeGuard: MobileBackGuard | null = null;

export function setMobileBackGuard(guard: MobileBackGuard | null): void {
  activeGuard = guard;
}

export function getMobileBackGuardMessage(): string | null {
  return activeGuard?.message ?? null;
}

export function clearMobileBackGuard(): void {
  activeGuard = null;
}

export function confirmMobileBackGuard(): boolean {
  if (!activeGuard) {
    return true;
  }

  const shouldLeave = window.confirm(activeGuard.message);
  if (shouldLeave) {
    activeGuard = null;
  }
  return shouldLeave;
}
