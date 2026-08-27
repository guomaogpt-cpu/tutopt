export const IMPORT_RENDER_TIMEOUT_MS = 25_000;
export const IMPORT_RENDER_NAVIGATION_TIMEOUT_MS = 25_000;

export function isRenderFallbackEnabled(): boolean {
  return process.env.IMPORT_RENDER_FALLBACK_ENABLED === "true";
}

export function getRenderFallbackUnavailableMessage(): string {
  return "Lalafo заблокировал серверный запрос. Включите render fallback или заполните вручную.";
}
