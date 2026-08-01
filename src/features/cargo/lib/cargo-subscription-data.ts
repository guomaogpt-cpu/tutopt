import type { Prisma } from "@prisma/client";
import {
  matchesCargoSubscription,
  matchesCargoSubscriptionFilters,
  normalizeSubscriptionJsonLists,
  type CargoSubscriptionMatchInput,
  type CargoSubscriptionPrefs,
} from "@/features/cargo/lib/cargo-subscription-matching";
import { prisma } from "@/shared/lib/prisma";

export type CargoSubscriptionSettings = CargoSubscriptionPrefs & {
  notifyEmail: boolean;
  notifyTelegram: boolean;
  notifyWhatsApp: boolean;
};

const subscriptionSelect = {
  enabled: true,
  service_types: true,
  directions: true,
  from_locations: true,
  to_locations: true,
  notify_in_app: true,
  notify_email: true,
  notify_telegram: true,
  notify_whatsapp: true,
} as const;

type SubscriptionRow = {
  enabled: boolean;
  service_types: unknown;
  directions: unknown;
  from_locations: unknown;
  to_locations: unknown;
  notify_in_app: boolean;
  notify_email: boolean;
  notify_telegram: boolean;
  notify_whatsapp: boolean;
};

function mapRow(row: SubscriptionRow): CargoSubscriptionSettings {
  const lists = normalizeSubscriptionJsonLists({
    serviceTypes: row.service_types,
    directions: row.directions,
    fromLocations: row.from_locations,
    toLocations: row.to_locations,
  });

  return {
    enabled: row.enabled,
    notifyInApp: row.notify_in_app,
    notifyEmail: row.notify_email,
    notifyTelegram: row.notify_telegram,
    notifyWhatsApp: row.notify_whatsapp,
    ...lists,
  };
}

export async function getCargoSubscriptionForSeller(
  sellerProfileId: string,
): Promise<CargoSubscriptionSettings | null> {
  const row = await prisma.cargoSubscription.findUnique({
    where: { seller_profile_id: sellerProfileId },
    select: subscriptionSelect,
  });

  if (!row) {
    return null;
  }

  return mapRow(row);
}

export async function upsertCargoSubscriptionSettings(input: {
  sellerProfileId: string;
  userId: string;
  settings: CargoSubscriptionSettings;
}): Promise<CargoSubscriptionSettings> {
  const lists = normalizeSubscriptionJsonLists(input.settings);

  const row = await prisma.cargoSubscription.upsert({
    where: { seller_profile_id: input.sellerProfileId },
    create: {
      seller_profile_id: input.sellerProfileId,
      user_id: input.userId,
      enabled: input.settings.enabled,
      service_types: lists.serviceTypes as Prisma.InputJsonValue,
      directions: lists.directions as Prisma.InputJsonValue,
      from_locations: lists.fromLocations as Prisma.InputJsonValue,
      to_locations: lists.toLocations as Prisma.InputJsonValue,
      notify_in_app: input.settings.notifyInApp,
      notify_email: input.settings.notifyEmail,
      notify_telegram: input.settings.notifyTelegram,
      notify_whatsapp: input.settings.notifyWhatsApp,
    },
    update: {
      user_id: input.userId,
      enabled: input.settings.enabled,
      service_types: lists.serviceTypes as Prisma.InputJsonValue,
      directions: lists.directions as Prisma.InputJsonValue,
      from_locations: lists.fromLocations as Prisma.InputJsonValue,
      to_locations: lists.toLocations as Prisma.InputJsonValue,
      notify_in_app: input.settings.notifyInApp,
      notify_email: input.settings.notifyEmail,
      notify_telegram: input.settings.notifyTelegram,
      notify_whatsapp: input.settings.notifyWhatsApp,
    },
    select: subscriptionSelect,
  });

  return mapRow(row);
}

/** Legacy simple on/off used by quick toggle UI */
export async function setCargoSubscription(input: {
  sellerProfileId: string;
  userId: string;
  active: boolean;
}): Promise<{ isActive: boolean }> {
  const existing = await getCargoSubscriptionForSeller(input.sellerProfileId);
  const saved = await upsertCargoSubscriptionSettings({
    sellerProfileId: input.sellerProfileId,
    userId: input.userId,
    settings: {
      enabled: input.active,
      notifyInApp: existing?.notifyInApp ?? true,
      notifyEmail: existing?.notifyEmail ?? false,
      notifyTelegram: existing?.notifyTelegram ?? false,
      notifyWhatsApp: existing?.notifyWhatsApp ?? false,
      serviceTypes: existing?.serviceTypes ?? [],
      directions: existing?.directions ?? [],
      fromLocations: existing?.fromLocations ?? [],
      toLocations: existing?.toLocations ?? [],
    },
  });

  return { isActive: saved.enabled };
}

/**
 * Sellers who should receive in-app NEW_CARGO_REQUEST notifications.
 * Admins are handled separately by the caller.
 */
export async function findCargoNotificationRecipients(
  request: CargoSubscriptionMatchInput,
): Promise<string[]> {
  const recipientIds = new Set<string>();

  const cargoSellers = await prisma.user.findMany({
    where: {
      role: { in: ["SELLER", "ADMIN"] },
      is_blocked: false,
      sellerProfile: {
        listings: {
          some: {
            vertical: "CARGO",
            status: "PUBLISHED",
          },
        },
      },
    },
    select: {
      id: true,
      sellerProfile: {
        select: {
          cargoRequestSubscription: {
            select: subscriptionSelect,
          },
        },
      },
    },
  });

  for (const seller of cargoSellers) {
    const subRow = seller.sellerProfile?.cargoRequestSubscription;
    if (!subRow) {
      // Fallback: published CARGO listing, no subscription prefs yet
      recipientIds.add(seller.id);
      continue;
    }

    const prefs = mapRow(subRow);
    if (matchesCargoSubscription(prefs, request)) {
      recipientIds.add(seller.id);
    }
  }

  // Explicit subscribers without a published cargo listing (opt-in)
  const extraSubscribers = await prisma.cargoSubscription.findMany({
    where: {
      enabled: true,
      notify_in_app: true,
      user: { is_blocked: false },
    },
    select: {
      user_id: true,
      ...subscriptionSelect,
    },
  });

  for (const row of extraSubscribers) {
    if (recipientIds.has(row.user_id)) {
      continue;
    }
    const prefs = mapRow(row);
    if (matchesCargoSubscription(prefs, request)) {
      recipientIds.add(row.user_id);
    }
  }

  return [...recipientIds];
}

export function requestMatchesSellerSubscription(
  settings: CargoSubscriptionSettings | null,
  request: CargoSubscriptionMatchInput,
): boolean {
  if (!settings) {
    return true;
  }
  return matchesCargoSubscriptionFilters(settings, request);
}
