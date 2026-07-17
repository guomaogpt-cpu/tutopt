"use client";

import type { ListingVertical } from "@prisma/client";
import { useEffect, useRef } from "react";
import { trackSellerProfileView } from "@/lib/analytics/events";

type SellerProfileViewTrackerProps = {
  sellerHasProfile: boolean;
  primaryVertical: ListingVertical | null;
  listingCountBucket: string;
};

export function SellerProfileViewTracker({
  sellerHasProfile,
  primaryVertical,
  listingCountBucket,
}: SellerProfileViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    trackSellerProfileView({
      sellerHasProfile,
      vertical: primaryVertical,
      listingCountBucket,
    });
  }, [sellerHasProfile, primaryVertical, listingCountBucket]);

  return null;
}
