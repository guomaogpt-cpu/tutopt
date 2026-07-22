import { ListingStatus, UserRole, type Prisma } from "@prisma/client";
import type { UserRestrictionSource } from "@/lib/security/user-restrictions";
import { isUserBlocked } from "@/lib/security/user-restrictions";

export const LISTING_PUBLICATION_DAYS = 30;
export const LISTING_EXPIRING_SOON_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

export type ListingExpirationSource = {
  expires_at: Date | string | null;
};

export type ListingExpirationStatus = "no_expiration" | "active" | "expiring_soon" | "expired";

function parseDate(value: Date | string | null): Date | null {
  if (!value) {
    return null;
  }
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getDefaultListingExpirationDate(now: Date = new Date()): Date {
  return new Date(now.getTime() + LISTING_PUBLICATION_DAYS * DAY_MS);
}

/**
 * Public listing queries must hide expired listings while keeping legacy
 * listings without expires_at visible. Combine with status filters via AND.
 */
export function buildNotExpiredListingFilter(
  now: Date = new Date(),
): Prisma.ListingWhereInput {
  return {
    OR: [{ expires_at: null }, { expires_at: { gt: now } }],
  };
}

/** Shared public catalog/detail filter: published and not expired. */
export function buildPublicListingWhere(
  now: Date = new Date(),
): Prisma.ListingWhereInput {
  return {
    status: ListingStatus.PUBLISHED,
    AND: [buildNotExpiredListingFilter(now)],
  };
}

/** Renewal always counts from "now", not from the previous expiration date. */
export function getRenewedExpirationDate(now: Date = new Date()): Date {
  return getDefaultListingExpirationDate(now);
}

/** Listings without expires_at (created before Phase 33) are treated as not expired. */
export function isListingExpired(
  listing: ListingExpirationSource,
  now: Date = new Date(),
): boolean {
  const expiresAt = parseDate(listing.expires_at);
  if (!expiresAt) {
    return false;
  }
  return expiresAt.getTime() <= now.getTime();
}

export function isListingExpiringSoon(
  listing: ListingExpirationSource,
  now: Date = new Date(),
): boolean {
  const expiresAt = parseDate(listing.expires_at);
  if (!expiresAt) {
    return false;
  }
  const remaining = expiresAt.getTime() - now.getTime();
  return remaining > 0 && remaining <= LISTING_EXPIRING_SOON_DAYS * DAY_MS;
}

export function getListingExpirationStatus(
  listing: ListingExpirationSource,
  now: Date = new Date(),
): ListingExpirationStatus {
  const expiresAt = parseDate(listing.expires_at);
  if (!expiresAt) {
    return "no_expiration";
  }
  if (expiresAt.getTime() <= now.getTime()) {
    return "expired";
  }
  if (isListingExpiringSoon(listing, now)) {
    return "expiring_soon";
  }
  return "active";
}

type RenewUserSource = UserRestrictionSource & {
  id: string;
  role: UserRole;
};

type RenewListingSource = ListingExpirationSource & {
  status: ListingStatus;
  sellerProfile: { user_id: string };
};

/**
 * Owner-only manual renewal. Archived and draft listings must be restored /
 * published through their own flows before they can be renewed.
 */
export function canOwnerRenewListing(
  user: RenewUserSource,
  listing: RenewListingSource,
): boolean {
  if (user.role !== UserRole.SELLER) {
    return false;
  }
  if (isUserBlocked(user)) {
    return false;
  }
  if (listing.sellerProfile.user_id !== user.id) {
    return false;
  }
  return (
    listing.status === ListingStatus.PUBLISHED ||
    listing.status === ListingStatus.PENDING_MODERATION
  );
}
