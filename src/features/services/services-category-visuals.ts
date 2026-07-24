import {
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  GraduationCap,
  Laptop,
  Scale,
  Sparkles,
  SprayCan,
  Truck,
  Wrench,
} from "lucide-react";
import type { VerticalCategoryVisual } from "@/features/verticals/vertical-category-visual-types";

/** Visuals keyed by SEO slug from `getCategorySeoSlug` (prefix `services-` stripped). */
const BY_SEO_SLUG: Record<string, VerticalCategoryVisual> = {
  "remont-i-stroitelstvo": {
    icon: Wrench,
    chipClassName: "bg-teal-100",
    iconClassName: "text-teal-700",
    featured: true,
    featuredOrder: 1,
  },
  "krasota-i-zdorove": {
    icon: Sparkles,
    chipClassName: "bg-pink-100",
    iconClassName: "text-pink-700",
    featured: true,
    featuredOrder: 2,
  },
  obuchenie: {
    icon: GraduationCap,
    chipClassName: "bg-amber-100",
    iconClassName: "text-amber-800",
    featured: true,
    featuredOrder: 3,
  },
  "it-i-digital": {
    icon: Laptop,
    chipClassName: "bg-cyan-100",
    iconClassName: "text-cyan-700",
    featured: true,
    featuredOrder: 4,
  },
  "biznes-uslugi": {
    icon: BriefcaseBusiness,
    chipClassName: "bg-emerald-100",
    iconClassName: "text-emerald-700",
    featured: true,
    featuredOrder: 5,
  },
  "perevozki-i-gruzchiki": {
    icon: Truck,
    chipClassName: "bg-sky-100",
    iconClassName: "text-sky-700",
    featured: true,
    featuredOrder: 6,
  },
  "kliningovye-uslugi": {
    icon: SprayCan,
    chipClassName: "bg-lime-100",
    iconClassName: "text-lime-800",
    featured: true,
    featuredOrder: 7,
  },
  meropriyatiya: {
    icon: CalendarDays,
    chipClassName: "bg-violet-100",
    iconClassName: "text-violet-700",
    featured: true,
    featuredOrder: 8,
  },
  "yuridicheskie-uslugi": {
    icon: Scale,
    chipClassName: "bg-slate-100",
    iconClassName: "text-slate-700",
    featured: false,
    featuredOrder: 9,
  },
  "foto-i-video": {
    icon: Camera,
    chipClassName: "bg-orange-100",
    iconClassName: "text-orange-700",
    featured: false,
    featuredOrder: 10,
  },
};

const FALLBACK: VerticalCategoryVisual = {
  icon: Wrench,
  chipClassName: "bg-teal-100",
  iconClassName: "text-teal-700",
  featured: false,
  featuredOrder: 100,
};

export function getServicesCategoryVisual(
  seoSlug: string,
  _dbSlug?: string,
): VerticalCategoryVisual {
  return BY_SEO_SLUG[seoSlug] ?? FALLBACK;
}
