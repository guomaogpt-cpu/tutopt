import Link from "next/link";
import { getSupportEmail } from "@/shared/config/support";
import { LEGAL_PAGES_LAST_UPDATED } from "@/shared/config/legal";

export function LegalPageUpdateNote() {
  const supportEmail = getSupportEmail();

  return (
    <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
      Последнее обновление: {LEGAL_PAGES_LAST_UPDATED}. По вопросам обращайтесь в{" "}
      <Link href="/support" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
        поддержку
      </Link>{" "}
      или на{" "}
      <a
        href={`mailto:${supportEmail}`}
        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        {supportEmail}
      </a>
      .
    </p>
  );
}
