import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Восстановление пароля",
  "Восстановление доступа к аккаунту ВсеТут.",
);

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
