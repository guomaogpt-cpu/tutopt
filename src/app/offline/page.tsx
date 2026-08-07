import type { Metadata } from "next";
import { OfflinePageContent } from "@/components/pwa/OfflinePageContent";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Нет подключения",
  "Страница недоступна без интернета.",
);

export default function OfflinePage() {
  return <OfflinePageContent />;
}
