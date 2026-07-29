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
        <Card className="overflow-hidden border-[#E5E7EB] bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight text-[#111827] sm:text-2xl dark:text-slate-100">
                {t("cta.sellQuestion")}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-[#6B7280] sm:text-base dark:text-slate-400">
                {t("cta.sellDescription")}
              </p>
            </div>
            <Button
              className="w-full shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
              asChild
            >
              <Link href={createListingHref}>{t("cta.postListing")}</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
