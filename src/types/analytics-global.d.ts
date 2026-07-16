export {};

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    ym?: (counterId: number, method: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
