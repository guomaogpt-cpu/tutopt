import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata: Metadata = buildPrivatePageMetadata(
  "Сброс пароля",
  "Сброс пароля аккаунта ВсеТут.",
);

export default function ResetPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
