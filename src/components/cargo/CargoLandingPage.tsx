"use client";

import { useState } from "react";
import { CargoActiveRequests } from "@/components/cargo/CargoActiveRequests";
import { CargoCompactHero } from "@/components/cargo/CargoCompactHero";
import { CargoCompaniesSection } from "@/components/cargo/CargoCompaniesSection";
import { CargoDirectionsSection } from "@/components/cargo/CargoDirectionsSection";
import { CargoDualCta } from "@/components/cargo/CargoDualCta";
import { CargoLandingSearch } from "@/components/cargo/CargoLandingSearch";
import { CargoRequestModal } from "@/components/cargo/CargoRequestModal";
import { Container } from "@/components/ui/container";
import type { PublicCargoRequestCard } from "@/features/cargo/lib/cargo-requests-data";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";

type CargoLandingPageProps = {
  listings: ListingCardData[];
  recentRequests: PublicCargoRequestCard[];
  isAuthenticated: boolean;
  canRespond: boolean;
};

export function CargoLandingPage({
  listings,
  recentRequests,
  isAuthenticated,
  canRespond,
}: CargoLandingPageProps) {
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <main className="min-w-0 overflow-x-clip bg-gradient-to-b from-orange-50/40 to-slate-50 pb-[calc(5rem+env(safe-area-inset-bottom))] dark:from-slate-950 dark:to-slate-950 md:pb-8">
      <CargoCompactHero onCreateRequest={() => setRequestOpen(true)} />

      <Container size="lg" className="py-5 sm:py-7">
        <CargoLandingSearch isAuthenticated={isAuthenticated} />
        <CargoDirectionsSection />
        <CargoCompaniesSection
          listings={listings}
          onCreateRequest={() => setRequestOpen(true)}
        />
        <CargoActiveRequests
          requests={recentRequests}
          isAuthenticated={isAuthenticated}
          canRespond={canRespond}
        />
        <CargoDualCta onCreateRequest={() => setRequestOpen(true)} />
      </Container>

      <CargoRequestModal open={requestOpen} onOpenChange={setRequestOpen} />
    </main>
  );
}
