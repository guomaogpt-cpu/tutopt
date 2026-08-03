"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function AccountMyCargoResponsesLink() {
  const { t } = useTranslation();

  return (
    <Link
      href="/account/requests?tab=cargoResponses"
      className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
    >
      {t("accountRequests.myCargoResponsesTitle")}
    </Link>
  );
}
