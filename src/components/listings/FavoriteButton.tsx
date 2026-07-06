"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addFavoriteRequest,
  removeFavoriteRequest,
} from "@/features/favorites/lib/favorites-client";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";

type FavoriteButtonProps = {
  listingId: string;
  isAuthenticated: boolean;
  initialIsFavorited?: boolean;
  variant?: "icon" | "button";
  className?: string;
};

const focusRingClassName =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

export function FavoriteButton({
  listingId,
  isAuthenticated,
  initialIsFavorited = false,
  variant = "icon",
  className = "",
}: FavoriteButtonProps) {
  const router = useRouter();
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
      router.refresh();
    } catch {
      setIsFavorited(!nextValue);
    } finally {
      setIsPending(false);
    }
  }

  const label = isFavorited ? "Убрать из избранного" : "Добавить в избранное";

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={() => void handleToggle()}
        disabled={isPending}
        aria-pressed={isFavorited}
        aria-label={label}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60 ${
          isFavorited ? "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-50" : "text-slate-800"
        } ${focusRingClassName} ${className}`.trim()}
      >
        <Heart
          className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
          aria-hidden="true"
        />
        {isFavorited ? "В избранном" : "Добавить в избранное"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void handleToggle();
      }}
      disabled={isPending}
      aria-pressed={isFavorited}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-sm backdrop-blur transition hover:border-rose-200 hover:text-rose-600 disabled:opacity-60 ${
        isFavorited ? "border-rose-200 bg-rose-50 text-rose-600" : ""
      } ${focusRingClassName} ${className}`.trim()}
    >
      <Heart
        className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}
