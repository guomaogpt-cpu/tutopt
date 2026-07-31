import type { Metadata, Viewport } from "next";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { AppProviders } from "@/components/providers";
import { getSiteBaseUrl } from "@/shared/seo/absolute-url";
import { getSiteVerificationMetadata } from "@/shared/seo/site-verification";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  TITLE_TEMPLATE,
} from "@/shared/seo/seo.config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteBaseUrl()),
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: [{ url: "/logos/vsetut-logo-new.png", type: "image/png" }],
    apple: [{ url: "/logos/vsetut-logo-new.png" }],
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "ru_KG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  ...getSiteVerificationMetadata(),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <AnalyticsScripts />
        <AppProviders>
          <Header />
          <div className="flex min-h-0 flex-1 flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
            {children}
            <Footer />
          </div>
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
