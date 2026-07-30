"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { useTranslation } from "@/lib/i18n/useTranslation";

type SellerCtaSectionProps = {
  createListingHref: string;
};

export function SellerCtaSection({ createListingHref }: SellerCtaSectionProps) {
  const { t } = useTranslation();

  return (
    <Section spacing="md" className="bg-[#F5F7FA] dark:bg-slate-950">
      <Container size="xl">
        <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
                {t("home.sellerCtaTitle")}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base dark:text-slate-400">
                {t("home.sellerCtaDescription")}
              </p>
            </div>
            <Button
              className="w-full shrink-0 bg-blue-600 hover:bg-blue-700 sm:w-auto"
              asChild
            >
              <Link href={createListingHref}>{t("home.postListing")}</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
