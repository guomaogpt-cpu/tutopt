type UnreadCountListener = (count: number) => void;

let unreadCount = 0;
let mutationGeneration = 0;
const listeners = new Set<UnreadCountListener>();

function emit(): void {
  for (const listener of listeners) {
    listener(unreadCount);
  }
}

export function getUnreadNotificationCountSnapshot(): number {
  return unreadCount;
}

export function getUnreadMutationGeneration(): number {
  return mutationGeneration;
}

export function subscribeUnreadNotificationCount(listener: UnreadCountListener): () => void {
  listeners.add(listener);
  listener(unreadCount);

  return () => {
    listeners.delete(listener);
  };
}

export function setUnreadNotificationCount(count: number): void {
  unreadCount = Math.max(0, count);
  mutationGeneration += 1;
  emit();
}

export function decrementUnreadNotificationCount(by = 1): void {
  setUnreadNotificationCount(unreadCount - by);
}

export function applyPolledUnreadNotificationCount(
  serverCount: number,
  pollStartGeneration: number,
): void {
  if (pollStartGeneration !== mutationGeneration) {
    return;
  }

  unreadCount = Math.max(0, serverCount);
  emit();
}
