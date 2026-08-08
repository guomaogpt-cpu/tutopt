import { LEGAL_DRAFT_NOTICE } from "@/shared/config/support";

export function LegalDraftBanner() {
  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
      role="note"
    >
      {LEGAL_DRAFT_NOTICE}
    </div>
  );
}
