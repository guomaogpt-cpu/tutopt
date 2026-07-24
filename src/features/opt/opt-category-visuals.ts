import {
  Car,
  Cog,
  Cpu,
  Hammer,
  Home,
  Layers,
  Package,
  PackageOpen,
  Shirt,
  Sofa,
  SprayCan,
  Wheat,
} from "lucide-react";
import type { VerticalCategoryVisual } from "@/features/verticals/vertical-category-visual-types";

/**
 * Visuals keyed by SEO slug (`getCategorySeoSlug`) and/or raw DB slug.
 * OPT legacy roots have no prefix; newer extras use `opt-`.
 */
const BY_SLUG: Record<string, VerticalCategoryVisual> = {
  // Featured (max 8) — mapped to actual OPT top-level categories
  "opt-oborudovanie": {
    icon: Cog,
    chipClassName: "bg-blue-100",
    iconClassName: "text-blue-700",
    featured: true,
    featuredOrder: 1,
  },
  oborudovanie: {
    icon: Cog,
    chipClassName: "bg-blue-100",
    iconClassName: "text-blue-700",
    featured: true,
    featuredOrder: 1,
  },
  "stroitelnye-materialy": {
    icon: Hammer,
    chipClassName: "bg-sky-100",
    iconClassName: "text-sky-700",
    featured: true,
    featuredOrder: 2,
  },
  "produkty-pitaniya": {
    icon: Package,
    chipClassName: "bg-cyan-100",
    iconClassName: "text-cyan-800",
    featured: true,
    featuredOrder: 3,
  },
  "odezhda-tekstil": {
    icon: Shirt,
    chipClassName: "bg-indigo-100",
    iconClassName: "text-indigo-700",
    featured: true,
    featuredOrder: 4,
  },
  "opt-upakovka-i-tara": {
    icon: PackageOpen,
    chipClassName: "bg-slate-100",
    iconClassName: "text-slate-700",
    featured: true,
    featuredOrder: 5,
  },
  "upakovka-i-tara": {
    icon: PackageOpen,
    chipClassName: "bg-slate-100",
    iconClassName: "text-slate-700",
    featured: true,
    featuredOrder: 5,
  },
  "opt-syrye-i-materialy": {
    icon: Layers,
    chipClassName: "bg-blue-50",
    iconClassName: "text-blue-800",
    featured: true,
    featuredOrder: 6,
  },
  "syrye-i-materialy": {
    icon: Layers,
    chipClassName: "bg-blue-50",
    iconClassName: "text-blue-800",
    featured: true,
    featuredOrder: 6,
  },
  elektronika: {
    icon: Cpu,
    chipClassName: "bg-sky-50",
    iconClassName: "text-sky-800",
    featured: true,
    featuredOrder: 7,
  },
  // Closest to “товары для бизнеса” in current seed catalog
  mebel: {
    icon: Sofa,
    chipClassName: "bg-cyan-50",
    iconClassName: "text-cyan-800",
    featured: true,
    featuredOrder: 8,
  },

  // Drawer-only / remaining top-level
  "avto-zapchasti": {
    icon: Car,
    chipClassName: "bg-slate-100",
    iconClassName: "text-slate-700",
    featured: false,
    featuredOrder: 9,
  },
  "bytovaya-himiya": {
    icon: SprayCan,
    chipClassName: "bg-blue-50",
    iconClassName: "text-blue-700",
    featured: false,
    featuredOrder: 10,
  },
  selhoz: {
    icon: Wheat,
    chipClassName: "bg-sky-50",
    iconClassName: "text-sky-700",
    featured: false,
    featuredOrder: 11,
  },
  "opt-hoztovary": {
    icon: Home,
    chipClassName: "bg-indigo-50",
    iconClassName: "text-indigo-700",
    featured: false,
    featuredOrder: 12,
  },
  hoztovary: {
    icon: Home,
    chipClassName: "bg-indigo-50",
    iconClassName: "text-indigo-700",
    featured: false,
    featuredOrder: 12,
  },
};

const FALLBACK: VerticalCategoryVisual = {
  icon: Package,
  chipClassName: "bg-blue-100",
  iconClassName: "text-blue-700",
  featured: false,
  featuredOrder: 100,
};

export function getOptCategoryVisual(
  seoSlug: string,
  dbSlug?: string,
): VerticalCategoryVisual {
  return BY_SLUG[seoSlug] ?? (dbSlug ? BY_SLUG[dbSlug] : undefined) ?? FALLBACK;
}
