"use client";

import type { ListingVertical } from "@prisma/client";
import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trackListingRenew } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RenewSuccessBody = {
  data: {
    listing: { status: string };
    wasExpired: boolean;
    statusBefore: string;
  };
};

type RenewErrorBody = {
  error?: { message?: string };
};

type RenewListingButtonProps = {
  listingId: string;
  vertical: ListingVertical;
  className?: string;
};

export function RenewListingButton({
  listingId,
  vertical,
  className,
}: RenewListingButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  async function handleRenew() {
    if (isSubmitting || isDone) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/listings/${listingId}/renew`, {
        method: "POST",
      });
      const body = (await response.json()) as RenewSuccessBody & RenewErrorBody;

      if (!response.ok) {
        setError(body.error?.message ?? "Не удалось продлить объявление.");
        setIsSubmitting(false);
        return;
      }

      trackListingRenew({
        vertical,
        wasExpired: body.data.wasExpired,
        statusBefore: body.data.statusBefore,
        statusAfter: body.data.listing.status,
      });
      setIsDone(true);
      router.refresh();
    } catch {
      setError("Не удалось продлить объявление. Попробуйте позже.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("min-w-0", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={() => void handleRenew()}
        disabled={isSubmitting || isDone}
        className="h-11 w-full gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw className="size-4" aria-hidden="true" />
        )}
        {isDone ? "Продлено" : "Продлить"}
      </Button>
      {error ? <p className="mt-1.5 text-xs text-[#DC2626]">{error}</p> : null}
    </div>
  );
}
