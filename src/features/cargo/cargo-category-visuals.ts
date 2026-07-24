import {
  Bike,
  Boxes,
  ClipboardCheck,
  Forklift,
  Globe2,
  MapPin,
  Package,
  Ship,
  Truck,
  Warehouse,
} from "lucide-react";
import type { VerticalCategoryVisual } from "@/features/verticals/vertical-category-visual-types";

/** Visuals keyed by SEO slug from `getCategorySeoSlug` (prefix `cargo-` stripped). */
const BY_SEO_SLUG: Record<string, VerticalCategoryVisual> = {
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
  "poputnye-gruzy": {
    icon: Truck,
    chipClassName: "bg-amber-100",
    iconClassName: "text-amber-800",
    featured: true,
    featuredOrder: 4,
  },
  "sklady-i-hranenie": {
    icon: Warehouse,
    chipClassName: "bg-slate-100",
    iconClassName: "text-slate-700",
    featured: true,
    featuredOrder: 5,
  },
  "tamozhennoe-oformlenie": {
    icon: ClipboardCheck,
    chipClassName: "bg-indigo-100",
    iconClassName: "text-indigo-700",
    featured: true,
    featuredOrder: 6,
  },
  spectehnika: {
    icon: Forklift,
    chipClassName: "bg-yellow-100",
    iconClassName: "text-yellow-800",
    featured: true,
    featuredOrder: 7,
  },
  "kurerskaya-dostavka": {
    icon: Bike,
    chipClassName: "bg-emerald-100",
    iconClassName: "text-emerald-700",
    featured: true,
    featuredOrder: 8,
  },
  pereezdy: {
    icon: Package,
    chipClassName: "bg-cyan-100",
    iconClassName: "text-cyan-700",
    featured: false,
    featuredOrder: 9,
  },
  ekspedirovanie: {
    icon: Boxes,
    chipClassName: "bg-rose-50",
    iconClassName: "text-rose-800",
    featured: false,
    featuredOrder: 10,
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
