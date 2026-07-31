import type { DictionaryKey } from "@/lib/i18n/dictionaries";

/**
 * Canonical services profession catalog (Phase 71).
 * Slugs match `prisma/seed-data/categories.ts` SERVICES_CATEGORIES.
 * New rows appear in DB after seed; UI falls back to any SERVICES categories present.
 */
export type ServicesProfessionDefinition = {
  key: string;
  /** DB category slug */
  slug: string;
  labelKey: DictionaryKey;
  order: number;
};

export const SERVICES_PROFESSIONS: ServicesProfessionDefinition[] = [
  {
    key: "repairConstruction",
    slug: "services-remont-i-stroitelstvo",
    labelKey: "services.categories.repairConstruction",
    order: 1,
  },
  {
    key: "electricians",
    slug: "services-elektriki",
    labelKey: "services.categories.electricians",
    order: 2,
  },
  {
    key: "plumbers",
    slug: "services-santehniki",
    labelKey: "services.categories.plumbers",
    order: 3,
  },
  {
    key: "furniture",
    slug: "services-mebelshhiki",
    labelKey: "services.categories.furniture",
    order: 4,
  },
  {
    key: "movers",
    slug: "services-perevozki-i-gruzchiki",
    labelKey: "services.categories.movers",
    order: 5,
  },
  {
    key: "cleaning",
    slug: "services-kliningovye-uslugi",
    labelKey: "services.categories.cleaning",
    order: 6,
  },
  {
    key: "autoServices",
    slug: "services-avtouslugi",
    labelKey: "services.categories.autoServices",
    order: 7,
  },
  {
    key: "beautyHealth",
    slug: "services-krasota-i-zdorove",
    labelKey: "services.categories.beautyHealth",
    order: 8,
  },
  {
    key: "education",
    slug: "services-obuchenie",
    labelKey: "services.categories.education",
    order: 9,
  },
  {
    key: "accounting",
    slug: "services-buhgalteriya",
    labelKey: "services.categories.accounting",
    order: 10,
  },
  {
    key: "lawyers",
    slug: "services-yuridicheskie-uslugi",
    labelKey: "services.categories.lawyers",
    order: 11,
  },
  {
    key: "itDigital",
    slug: "services-it-i-digital",
    labelKey: "services.categories.itDigital",
    order: 12,
  },
  {
    key: "design",
    slug: "services-dizajn",
    labelKey: "services.categories.design",
    order: 13,
  },
  {
    key: "photoVideo",
    slug: "services-foto-i-video",
    labelKey: "services.categories.photoVideo",
    order: 14,
  },
  {
    key: "handyman",
    slug: "services-mastera-na-chas",
    labelKey: "services.categories.handyman",
    order: 15,
  },
  {
    key: "other",
    slug: "services-drugoe",
    labelKey: "services.categories.other",
    order: 16,
  },
];

export function getServicesProfessionBySlug(
  slug: string,
): ServicesProfessionDefinition | undefined {
  return SERVICES_PROFESSIONS.find((item) => item.slug === slug);
}
