const BLOCKED_PATTERNS =
  /captcha|verify you are|access denied|доступ запрещен|robot|cloudflare|security check|проверка|are you a human/i;

export type PageDiagnostics = {
  documentTitle: string | null;
  pageUrl: string;
  bodyTextSample: string | null;
  h1Texts: string[];
  imageCountTotal: number;
  candidateImageCount: number;
  blockedPageDetected: boolean;
  captchaDetected: boolean;
};

export function analyzeBodyTextSample(sample: string | null): {
  blockedPageDetected: boolean;
  captchaDetected: boolean;
} {
  if (!sample) {
    return { blockedPageDetected: false, captchaDetected: false };
  }

  const lower = sample.toLowerCase();
  const captchaDetected = /captcha|verify you are|are you a human|robot check|проверка/i.test(
    lower,
  );
  const blockedPageDetected =
    captchaDetected ||
    BLOCKED_PATTERNS.test(lower) ||
    /access denied|доступ запрещен|cloudflare/i.test(lower);

  return { blockedPageDetected, captchaDetected };
}

export function truncateBodySample(text: string, maxLen = 400): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) {
    return cleaned;
  }
  return `${cleaned.slice(0, maxLen)}…`;
}

export type DomDiagnosticsSnapshot = {
  documentTitle: string | null;
  pageUrl: string;
  bodyTextSample: string | null;
  h1Texts: string[];
  imageCountTotal: number;
  candidateImageCount: number;
};

export function buildPageDiagnostics(snapshot: DomDiagnosticsSnapshot): PageDiagnostics {
  const flags = analyzeBodyTextSample(snapshot.bodyTextSample);
  return {
    ...snapshot,
    ...flags,
  };
}
