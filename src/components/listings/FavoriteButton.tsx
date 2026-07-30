"use client";

import type { ListingVertical } from "@prisma/client";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addFavoriteRequest,
  removeFavoriteRequest,
} from "@/features/favorites/lib/favorites-client";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { trackFavoriteToggle } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  listingId: string;
  isAuthenticated: boolean;
  initialIsFavorited?: boolean;
  vertical?: ListingVertical | null;
  variant?: "icon" | "button";
  className?: string;
  onFavoriteChange?: (isFavorited: boolean) => void;
};

export function FavoriteButton({
  listingId,
  isAuthenticated,
  initialIsFavorited = false,
  vertical = null,
  variant = "icon",
  className = "",
  onFavoriteChange,
}: FavoriteButtonProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isPending, setIsPending] = useState(false);

  async function handleToggle() {
    if (!isAuthenticated) {
      router.push(buildLoginUrl(getCurrentPathFromWindow()));
      return;
    }

    if (isPending) {
      return;
    }

    setIsPending(true);
    const nextValue = !isFavorited;

    setIsFavorited(nextValue);

    try {
      if (nextValue) {
        await addFavoriteRequest(listingId);
      } else {
        await removeFavoriteRequest(listingId);
      }
      trackFavoriteToggle(listingId, vertical, nextValue);
      onFavoriteChange?.(nextValue);
      router.refresh();
    } catch {
      setIsFavorited(!nextValue);
    } finally {
      setIsPending(false);
    }
  }

  const label = isFavorited
    ? t("listings.removeFromFavorites")
    : t("listings.addToFavorites");

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => void handleToggle()}
        disabled={isPending}
        aria-pressed={isFavorited}
        aria-label={label}
        className={cn(
          "w-full",
          isFavorited &&
            "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300",
          className,
        )}
      >
        <Heart className={cn("size-4", isFavorited && "fill-current")} aria-hidden="true" />
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void handleToggle();
      }}
      disabled={isPending}
      aria-pressed={isFavorited}
      aria-label={label}
      className={cn(
        "size-9 rounded-full border-border bg-background/95 shadow-sm backdrop-blur",
        isFavorited && "border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:text-rose-600",
        className,
      )}
    >
      <Heart className={cn("size-4", isFavorited && "fill-current")} aria-hidden="true" />
    </Button>
  );
}
