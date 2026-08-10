"use client";

import Link from "next/link";
import { MessageSquare, Pencil, Phone, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ListingVertical } from "@prisma/client";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { useListingLeadContactOptional } from "@/components/listings/ListingLeadContactProvider";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { getLeadFormConfig } from "@/features/leads/lib/lead-form-config";
import { trackListingDetailAction } from "@/lib/analytics/events";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { getVerticalTheme } from "@/lib/vertical-theme";
import { mobileStickyBottomOffset } from "@/lib/mobile/mobile-viewport";
import { cn } from "@/lib/utils";

type ListingMobileStickyCtaProps = {
  listingId: string;
  isAuthenticated: boolean;
  isFavorited: boolean;
  vertical: ListingVertical;
  hasPrice: boolean;
  isOwnListing: boolean;
  contactPhone?: string | null;
  messageSectionId?: string;
};

export function ListingMobileStickyCta({
  listingId,
  isAuthenticated,
  isFavorited,
  vertical,
  hasPrice,
  isOwnListing,
  contactPhone = null,
  messageSectionId = "listing-seller-message",
}: ListingMobileStickyCtaProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = getVerticalTheme(vertical);
  const leadContact = useListingLeadContactOptional();

  if (isOwnListing) {
    return (
      <div
        className={cn(
          "fixed inset-x-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur md:hidden",
          "supports-[backdrop-filter]:bg-white/90 dark:border-slate-800 dark:bg-slate-950/95",
        )}
        style={{ bottom: mobileStickyBottomOffset(5) }}
      >
        <div className="mx-auto flex max-w-lg gap-2">
          <Button
            asChild
            className={cn("h-12 min-w-0 flex-1 gap-2 rounded-xl text-sm font-semibold", theme.primaryButton)}
          >
            <Link href={`/listings/${listingId}/edit`}>
              <Pencil className="size-4 shrink-0" aria-hidden="true" />
              {t("listing.editListing")}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 min-w-0 flex-1 gap-2 rounded-xl text-sm font-semibold dark:border-slate-700"
          >
            <Link href="/account/requests?tab=received">
              <Inbox className="size-4 shrink-0" aria-hidden="true" />
              {t("form.goToLeads")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const ctaLabel = getLeadFormConfig(vertical).contactCtaLabel;

  function handlePrimaryAction() {
    trackListingDetailAction("contact_cta", {
      vertical,
      hasPrice,
      isOwnListing,
    });

    if (!isAuthenticated) {
      router.push(buildLoginUrl(getCurrentPathFromWindow()));
      return;
    }

    if (leadContact) {
      leadContact.openLeadDrawer();
      return;
    }

    const section = document.getElementById(messageSectionId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur",
        "supports-[backdrop-filter]:bg-white/90 md:hidden",
        "dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/90",
      )}
      style={{
        bottom: mobileStickyBottomOffset(5),
      }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-2">
        {!isAuthenticated ? (
          <p className="sr-only">{t("listing.mobile.signInToRequest")}</p>
        ) : null}

        <Button
          type="button"
          className={cn(
            "h-12 min-w-0 flex-1 gap-2 rounded-xl text-sm font-semibold",
            theme.primaryButton,
          )}
          onClick={handlePrimaryAction}
        >
          <MessageSquare className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{ctaLabel}</span>
        </Button>

        {isAuthenticated && contactPhone ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-12 shrink-0 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900"
            asChild
          >
            <a href={`tel:${contactPhone}`} aria-label={contactPhone}>
              <Phone className="size-5" aria-hidden="true" />
            </a>
          </Button>
        ) : null}

        <FavoriteButton
          listingId={listingId}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          vertical={vertical}
          variant="icon"
          className="size-12 shrink-0 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
        />
      </div>
    </div>
  );
}
