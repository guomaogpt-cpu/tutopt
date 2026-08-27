export const MIN_RENDER_NODE_MAJOR = 20;

export const IMPORT_RENDER_TIMEOUT_MS = 25_000;
export const IMPORT_RENDER_NAVIGATION_TIMEOUT_MS = 25_000;

export function getNodeMajorVersion(): number {
  const major = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10);
  return Number.isFinite(major) ? major : 0;
}

export function isNodeVersionSupportedForRender(): boolean {
  return getNodeMajorVersion() >= MIN_RENDER_NODE_MAJOR;
}

export function isRenderFallbackEnabled(): boolean {
  return process.env.IMPORT_RENDER_FALLBACK_ENABLED === "true";
}

/** Render may run only when env flag is on and Node is 20+. */
export function canAttemptRenderFallback(): boolean {
  return isRenderFallbackEnabled() && isNodeVersionSupportedForRender();
}

export function getRenderFallbackUnavailableMessage(): string {
  return "Lalafo заблокировал серверный запрос. Включите render fallback или заполните вручную.";
}

export function getRenderFallbackUnavailableReason(): string | null {
  if (!isRenderFallbackEnabled()) {
    return "Браузерный режим импорта отключён.";
  }
  if (!isNodeVersionSupportedForRender()) {
    return `Browser render требует Node.js ${MIN_RENDER_NODE_MAJOR}+ (сейчас ${process.versions.node}).`;
  }
  return null;
}
