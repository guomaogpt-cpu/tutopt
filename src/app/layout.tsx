import type { Metadata } from "next";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AppProviders } from "@/components/providers";
import { getSiteBaseUrl } from "@/shared/seo/absolute-url";
import { getSiteVerificationMetadata } from "@/shared/seo/site-verification";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME } from "@/shared/seo/seo.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteBaseUrl()),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "ru_KG",
    type: "website",
  },
  ...getSiteVerificationMetadata(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <AnalyticsScripts />
        <AppProviders>
          <Header />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
