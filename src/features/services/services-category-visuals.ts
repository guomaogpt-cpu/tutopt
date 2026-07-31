import {
  BookOpen,
  Briefcase,
  Calculator,
  Camera,
  Car,
  Hammer,
  HardHat,
  Laptop,
  Paintbrush,
  Scale,
  Sofa,
  Sparkles,
  SprayCan,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import type { VerticalCategoryVisual } from "@/features/verticals/vertical-category-visual-types";

/** Visuals keyed by SEO slug from `getCategorySeoSlug` (prefix `services-` stripped). */
const BY_SEO_SLUG: Record<string, VerticalCategoryVisual> = {
  "remont-i-stroitelstvo": {
    icon: HardHat,
    chipClassName: "bg-teal-100 dark:bg-teal-950/60",
    iconClassName: "text-teal-700 dark:text-teal-300",
    featured: true,
    featuredOrder: 1,
  },
  elektriki: {
    icon: Zap,
    chipClassName: "bg-amber-100 dark:bg-amber-950/60",
    iconClassName: "text-amber-700 dark:text-amber-300",
    featured: true,
    featuredOrder: 2,
  },
  santehniki: {
    icon: Wrench,
    chipClassName: "bg-sky-100 dark:bg-sky-950/60",
    iconClassName: "text-sky-700 dark:text-sky-300",
    featured: true,
    featuredOrder: 3,
  },
  mebelshhiki: {
    icon: Sofa,
    chipClassName: "bg-orange-100 dark:bg-orange-950/60",
    iconClassName: "text-orange-700 dark:text-orange-300",
    featured: true,
    featuredOrder: 4,
  },
  "perevozki-i-gruzchiki": {
    icon: Truck,
    chipClassName: "bg-blue-100 dark:bg-blue-950/60",
    iconClassName: "text-blue-700 dark:text-blue-300",
    featured: true,
    featuredOrder: 5,
  },
  "kliningovye-uslugi": {
    icon: SprayCan,
    chipClassName: "bg-lime-100 dark:bg-lime-950/60",
    iconClassName: "text-lime-800 dark:text-lime-300",
    featured: true,
    featuredOrder: 6,
  },
  avtouslugi: {
    icon: Car,
    chipClassName: "bg-indigo-100 dark:bg-indigo-950/60",
    iconClassName: "text-indigo-700 dark:text-indigo-300",
    featured: true,
    featuredOrder: 7,
  },
  "krasota-i-zdorove": {
    icon: Sparkles,
    chipClassName: "bg-pink-100 dark:bg-pink-950/60",
    iconClassName: "text-pink-700 dark:text-pink-300",
    featured: true,
    featuredOrder: 8,
  },
  obuchenie: {
    icon: BookOpen,
    chipClassName: "bg-yellow-100 dark:bg-yellow-950/60",
    iconClassName: "text-yellow-800 dark:text-yellow-300",
    featured: true,
    featuredOrder: 9,
  },
  buhgalteriya: {
    icon: Calculator,
    chipClassName: "bg-emerald-100 dark:bg-emerald-950/60",
    iconClassName: "text-emerald-700 dark:text-emerald-300",
    featured: true,
    featuredOrder: 10,
  },
  "yuridicheskie-uslugi": {
    icon: Scale,
    chipClassName: "bg-slate-100 dark:bg-slate-800",
    iconClassName: "text-slate-700 dark:text-slate-300",
    featured: true,
    featuredOrder: 11,
  },
  "it-i-digital": {
    icon: Laptop,
    chipClassName: "bg-cyan-100 dark:bg-cyan-950/60",
    iconClassName: "text-cyan-700 dark:text-cyan-300",
    featured: true,
    featuredOrder: 12,
  },
  dizajn: {
    icon: Paintbrush,
    chipClassName: "bg-fuchsia-100 dark:bg-fuchsia-950/60",
    iconClassName: "text-fuchsia-700 dark:text-fuchsia-300",
    featured: true,
    featuredOrder: 13,
  },
  "foto-i-video": {
    icon: Camera,
    chipClassName: "bg-rose-100 dark:bg-rose-950/60",
    iconClassName: "text-rose-700 dark:text-rose-300",
    featured: true,
    featuredOrder: 14,
  },
  "mastera-na-chas": {
    icon: Hammer,
    chipClassName: "bg-orange-100 dark:bg-orange-950/60",
    iconClassName: "text-orange-800 dark:text-orange-300",
    featured: true,
    featuredOrder: 15,
  },
  drugoe: {
    icon: Briefcase,
    chipClassName: "bg-slate-100 dark:bg-slate-800",
    iconClassName: "text-slate-600 dark:text-slate-300",
    featured: true,
    featuredOrder: 16,
  },
  // Legacy seed slugs still in some DBs
  "biznes-uslugi": {
    icon: Briefcase,
    chipClassName: "bg-emerald-100 dark:bg-emerald-950/60",
    iconClassName: "text-emerald-700 dark:text-emerald-300",
    featured: false,
    featuredOrder: 50,
  },
  meropriyatiya: {
    icon: Camera,
    chipClassName: "bg-violet-100 dark:bg-violet-950/60",
    iconClassName: "text-violet-700 dark:text-violet-300",
    featured: false,
    featuredOrder: 51,
  },
};

const FALLBACK: VerticalCategoryVisual = {
  icon: Wrench,
  chipClassName: "bg-teal-100 dark:bg-teal-950/60",
  iconClassName: "text-teal-700 dark:text-teal-300",
  featured: false,
  featuredOrder: 100,
};

export function getServicesCategoryVisual(
  seoSlug: string,
  _dbSlug?: string,
): VerticalCategoryVisual {
  return BY_SEO_SLUG[seoSlug] ?? FALLBACK;
}
