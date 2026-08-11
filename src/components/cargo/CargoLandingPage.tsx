"use client";

import { useState } from "react";
import { CargoActiveRequests } from "@/components/cargo/CargoActiveRequests";
import { CargoCompactHero } from "@/components/cargo/CargoCompactHero";
import { CargoCompaniesSection } from "@/components/cargo/CargoCompaniesSection";
import { CargoDirectionsSection } from "@/components/cargo/CargoDirectionsSection";
import { CargoDualCta } from "@/components/cargo/CargoDualCta";
import { CargoFeedbackCta } from "@/components/cargo/CargoFeedbackCta";
import { CargoHowItWorks } from "@/components/cargo/CargoHowItWorks";
import { CargoQuickGuide } from "@/components/cargo/CargoQuickGuide";
import { CargoLandingSearch } from "@/components/cargo/CargoLandingSearch";
import { CargoRequestModal } from "@/components/cargo/CargoRequestModal";
import { Container } from "@/components/ui/container";
import type { PublicCargoRequestCard } from "@/features/cargo/lib/cargo-requests-data";
import type { ListingCardData } from "@/features/listings/lib/listings-catalog";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { cn } from "@/lib/utils";

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
    <main className={cn("min-w-0 overflow-x-clip bg-gradient-to-b md:pb-8", getVerticalTheme("CARGO").pageWash)}>
      <CargoCompactHero onCreateRequest={() => setRequestOpen(true)} />

      <Container size="lg" className="py-5 sm:py-7">
        <CargoQuickGuide
          className="mb-4 sm:mb-5"
          onCreateRequest={() => setRequestOpen(true)}
        />
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
          onCreateRequest={() => setRequestOpen(true)}
        />
        <CargoDualCta onCreateRequest={() => setRequestOpen(true)} />
        <CargoHowItWorks />
        <CargoFeedbackCta className="mt-8 sm:mt-10" />
      </Container>

      <CargoRequestModal
        open={requestOpen}
        onOpenChange={setRequestOpen}
        isAuthenticated={isAuthenticated}
      />
    </main>
  );
}
