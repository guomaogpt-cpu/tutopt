import {
  isCargoDirectionId,
  isCargoServiceTypeId,
  parseStringArray,
} from "@/features/cargo/lib/cargo-subscription-options";

export type CargoSubscriptionMatchInput = {
  serviceType: string | null;
  direction: string | null;
  fromLocation: string;
  toLocation: string;
};

export type CargoSubscriptionPrefs = {
  enabled: boolean;
  notifyInApp: boolean;
  serviceTypes: string[];
  directions: string[];
  fromLocations: string[];
  toLocations: string[];
};

/**
 * MVP matching: empty preference arrays mean “any”.
 * Missing request fields do not hard-block (notify anyway).
 */
export function matchesCargoSubscriptionFilters(
  prefs: Pick<
    CargoSubscriptionPrefs,
    "serviceTypes" | "directions" | "fromLocations" | "toLocations"
  >,
  request: CargoSubscriptionMatchInput,
): boolean {
  if (prefs.serviceTypes.length > 0 && request.serviceType) {
    if (!prefs.serviceTypes.includes(request.serviceType)) {
      return false;
    }
  }

  if (prefs.directions.length > 0 && request.direction) {
    if (!prefs.directions.includes(request.direction)) {
      return false;
    }
  }

  if (prefs.fromLocations.length > 0) {
    const from = request.fromLocation.toLowerCase();
    const hit = prefs.fromLocations.some((item) => from.includes(item.toLowerCase()));
    if (!hit) {
      return false;
    }
  }

  if (prefs.toLocations.length > 0) {
    const to = request.toLocation.toLowerCase();
    const hit = prefs.toLocations.some((item) => to.includes(item.toLowerCase()));
    if (!hit) {
      return false;
    }
  }

  return true;
}

export function matchesCargoSubscription(
  prefs: CargoSubscriptionPrefs,
  request: CargoSubscriptionMatchInput,
): boolean {
  if (!prefs.enabled || !prefs.notifyInApp) {
    return false;
  }

  return matchesCargoSubscriptionFilters(prefs, request);
}

export function normalizeSubscriptionJsonLists(input: {
  serviceTypes: unknown;
  directions: unknown;
  fromLocations: unknown;
  toLocations: unknown;
}): Pick<
  CargoSubscriptionPrefs,
  "serviceTypes" | "directions" | "fromLocations" | "toLocations"
> {
  return {
    serviceTypes: parseStringArray(input.serviceTypes).filter(isCargoServiceTypeId),
    directions: parseStringArray(input.directions).filter(isCargoDirectionId),
    fromLocations: parseStringArray(input.fromLocations).map((item) => item.trim()).slice(0, 30),
    toLocations: parseStringArray(input.toLocations).map((item) => item.trim()).slice(0, 30),
  };
}
