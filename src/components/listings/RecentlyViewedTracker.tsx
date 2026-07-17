"use client";

import { useEffect, useRef } from "react";
import { saveRecentlyViewedListing } from "@/lib/recently-viewed/local-recently-viewed";

type RecentlyViewedTrackerProps = {
  listingId: string;
  title: string;
  vertical: string;
  price: string | null;
  currency: string | null;
  city: string | null;
  imageUrl: string | null;
};

export function RecentlyViewedTracker({
  listingId,
  title,
  vertical,
  price,
  currency,
  city,
  imageUrl,
}: RecentlyViewedTrackerProps) {
  const savedRef = useRef(false);

  useEffect(() => {
    if (savedRef.current) {
      return;
    }

    savedRef.current = true;
    saveRecentlyViewedListing({
      id: listingId,
      title,
      vertical,
      price,
      currency,
      city,
      imageUrl,
    });
  }, [listingId, title, vertical, price, currency, city, imageUrl]);

  return null;
}
