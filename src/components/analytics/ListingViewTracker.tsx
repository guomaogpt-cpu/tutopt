"use client";

import type { ListingVertical } from "@prisma/client";
import { useEffect, useRef } from "react";
import { trackListingView } from "@/lib/analytics/events";

type ListingViewTrackerProps = {
  listingId: string;
  vertical: ListingVertical;
};

export function ListingViewTracker({ listingId, vertical }: ListingViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) {
      return;
    }

    trackedRef.current = true;
    trackListingView(listingId, vertical);
  }, [listingId, vertical]);

  return null;
}
