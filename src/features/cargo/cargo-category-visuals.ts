import {
  ClipboardCheck,
  Globe2,
  MapPin,
  Package,
  Plane,
  Ship,
  TrainFront,
  Truck,
  Warehouse,
} from "lucide-react";
import type { VerticalCategoryVisual } from "@/features/verticals/vertical-category-visual-types";

/** Visuals keyed by SEO slug from `getCategorySeoSlug` (prefix `cargo-` stripped). */
const BY_SEO_SLUG: Record<string, VerticalCategoryVisual> = {
  // Current seed list (Phase cargo company hotfix)
  "delivery-from-china": {
    icon: Ship,
    chipClassName: "bg-orange-100",
    iconClassName: "text-orange-700",
    featured: true,
    featuredOrder: 1,
  },
  "delivery-kyrgyzstan": {
    icon: MapPin,
    chipClassName: "bg-rose-100",
    iconClassName: "text-rose-700",
    featured: true,
    featuredOrder: 2,
  },
  "international-delivery": {
    icon: Globe2,
    chipClassName: "bg-sky-100",
    iconClassName: "text-sky-700",
    featured: true,
    featuredOrder: 3,
  },
  "road-freight": {
    icon: Truck,
    chipClassName: "bg-amber-100",
    iconClassName: "text-amber-800",
    featured: true,
    featuredOrder: 4,
  },
  "air-freight": {
    icon: Plane,
    chipClassName: "bg-indigo-100",
    iconClassName: "text-indigo-700",
    featured: true,
    featuredOrder: 5,
  },
  "rail-freight": {
    icon: TrainFront,
    chipClassName: "bg-slate-100",
    iconClassName: "text-slate-700",
    featured: true,
    featuredOrder: 6,
  },
  warehousing: {
    icon: Warehouse,
    chipClassName: "bg-emerald-100",
    iconClassName: "text-emerald-700",
    featured: true,
    featuredOrder: 7,
  },
  "customs-clearance": {
    icon: ClipboardCheck,
    chipClassName: "bg-violet-100",
    iconClassName: "text-violet-700",
    featured: true,
    featuredOrder: 8,
  },
  other: {
    icon: Package,
    chipClassName: "bg-rose-50",
    iconClassName: "text-rose-800",
    featured: true,
    featuredOrder: 9,
  },
  // Legacy seed slugs (live DB until re-seed)
  "gruzoperevozki-po-kyrgyzstanu": {
    icon: MapPin,
    chipClassName: "bg-rose-100",
    iconClassName: "text-rose-700",
    featured: true,
    featuredOrder: 1,
  },
  "dostavka-kitay-kyrgyzstan": {
    icon: Ship,
    chipClassName: "bg-orange-100",
    iconClassName: "text-orange-700",
    featured: true,
    featuredOrder: 2,
  },
  "mezhdunarodnaya-logistika": {
    icon: Globe2,
    chipClassName: "bg-sky-100",
    iconClassName: "text-sky-700",
    featured: true,
    featuredOrder: 3,
  },
  "sklady-i-hranenie": {
    icon: Warehouse,
    chipClassName: "bg-emerald-100",
    iconClassName: "text-emerald-700",
    featured: true,
    featuredOrder: 7,
  },
  "tamozhennoe-oformlenie": {
    icon: ClipboardCheck,
    chipClassName: "bg-violet-100",
    iconClassName: "text-violet-700",
    featured: true,
    featuredOrder: 8,
  },
};

const FALLBACK: VerticalCategoryVisual = {
  icon: Truck,
  chipClassName: "bg-rose-100",
  iconClassName: "text-rose-700",
  featured: false,
  featuredOrder: 100,
};

export function getCargoCategoryVisual(
  seoSlug: string,
  _dbSlug?: string,
): VerticalCategoryVisual {
  return BY_SEO_SLUG[seoSlug] ?? FALLBACK;
}
