import {
  Baby,
  Car,
  Dumbbell,
  HeartPulse,
  Home,
  PawPrint,
  Shirt,
  Smartphone,
  Sofa,
  WashingMachine,
} from "lucide-react";
import type { VerticalCategoryVisual } from "@/features/verticals/vertical-category-visual-types";

const BY_SEO_SLUG: Record<string, VerticalCategoryVisual> = {
  "telefony-i-elektronika": {
    icon: Smartphone,
    chipClassName: "bg-violet-100",
    iconClassName: "text-violet-700",
    featured: true,
    featuredOrder: 1,
  },
  "odezhda-i-obuv": {
    icon: Shirt,
    chipClassName: "bg-fuchsia-100",
    iconClassName: "text-fuchsia-700",
    featured: true,
    featuredOrder: 2,
  },
  "dom-i-sad": {
    icon: Home,
    chipClassName: "bg-indigo-100",
    iconClassName: "text-indigo-700",
    featured: true,
    featuredOrder: 3,
  },
  "avto-i-moto": {
    icon: Car,
    chipClassName: "bg-sky-100",
    iconClassName: "text-sky-700",
    featured: true,
    featuredOrder: 4,
  },
  "detskie-tovary": {
    icon: Baby,
    chipClassName: "bg-rose-100",
    iconClassName: "text-rose-700",
    featured: true,
    featuredOrder: 5,
  },
  mebel: {
    icon: Sofa,
    chipClassName: "bg-amber-100",
    iconClassName: "text-amber-800",
    featured: true,
    featuredOrder: 6,
  },
  "bytovaya-tehnika": {
    icon: WashingMachine,
    chipClassName: "bg-cyan-100",
    iconClassName: "text-cyan-700",
    featured: true,
    featuredOrder: 7,
  },
  "sport-i-otdyh": {
    icon: Dumbbell,
    chipClassName: "bg-emerald-100",
    iconClassName: "text-emerald-700",
    featured: true,
    featuredOrder: 8,
  },
  "krasota-i-zdorove": {
    icon: HeartPulse,
    chipClassName: "bg-pink-100",
    iconClassName: "text-pink-700",
    featured: false,
    featuredOrder: 9,
  },
  zhivotnye: {
    icon: PawPrint,
    chipClassName: "bg-orange-100",
    iconClassName: "text-orange-700",
    featured: false,
    featuredOrder: 10,
  },
};

const FALLBACK: VerticalCategoryVisual = {
  icon: Home,
  chipClassName: "bg-violet-100",
  iconClassName: "text-violet-700",
  featured: false,
  featuredOrder: 100,
};

export function getMarketCategoryVisual(
  seoSlug: string,
  _dbSlug?: string,
): VerticalCategoryVisual {
  return BY_SEO_SLUG[seoSlug] ?? FALLBACK;
}
