import {
  ClipboardCheck,
  MapPin,
  Package,
  Plane,
  Ship,
  TrainFront,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

export type CargoLandingDirectionTile = {
  id: string;
  labelKey: DictionaryKey;
  icon: LucideIcon;
  /** Query used for listings filter / search. */
  query: string;
  chipClassName: string;
  iconClassName: string;
};

/** Compact direction/service tiles for /cargo (Phase 84). */
export const CARGO_LANDING_DIRECTION_TILES: CargoLandingDirectionTile[] = [
  {
    id: "chinaKyrgyzstan",
    labelKey: "cargo.directionChinaKyrgyzstan",
    icon: Ship,
    query: "Китай",
    chipClassName: "bg-orange-100 dark:bg-orange-950/50",
    iconClassName: "text-orange-700 dark:text-orange-300",
  },
  {
    id: "guangzhouBishkek",
    labelKey: "cargo.directionGuangzhouBishkek",
    icon: MapPin,
    query: "Гуанчжоу",
    chipClassName: "bg-amber-100 dark:bg-amber-950/40",
    iconClassName: "text-amber-800 dark:text-amber-300",
  },
  {
    id: "yiwuBishkek",
    labelKey: "cargo.directionYiwuBishkek",
    icon: MapPin,
    query: "Иу",
    chipClassName: "bg-sky-100 dark:bg-sky-950/40",
    iconClassName: "text-sky-700 dark:text-sky-300",
  },
  {
    id: "urumqiBishkek",
    labelKey: "cargo.directionUrumqiBishkek",
    icon: MapPin,
    query: "Урумчи",
    chipClassName: "bg-violet-100 dark:bg-violet-950/40",
    iconClassName: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "autoDelivery",
    labelKey: "cargo.autoDelivery",
    icon: Truck,
    query: "Автодоставка",
    chipClassName: "bg-amber-100 dark:bg-amber-950/40",
    iconClassName: "text-amber-800 dark:text-amber-300",
  },
  {
    id: "airDelivery",
    labelKey: "cargo.airDelivery",
    icon: Plane,
    query: "Авиа",
    chipClassName: "bg-indigo-100 dark:bg-indigo-950/40",
    iconClassName: "text-indigo-700 dark:text-indigo-300",
  },
  {
    id: "railDelivery",
    labelKey: "cargo.railDelivery",
    icon: TrainFront,
    query: "ЖД",
    chipClassName: "bg-slate-100 dark:bg-slate-800",
    iconClassName: "text-slate-700 dark:text-slate-300",
  },
  {
    id: "warehouse",
    labelKey: "cargo.warehouse",
    icon: Warehouse,
    query: "Склад",
    chipClassName: "bg-emerald-100 dark:bg-emerald-950/40",
    iconClassName: "text-emerald-700 dark:text-emerald-300",
  },
  {
    id: "customs",
    labelKey: "cargo.customs",
    icon: ClipboardCheck,
    query: "Таможня",
    chipClassName: "bg-violet-100 dark:bg-violet-950/40",
    iconClassName: "text-violet-700 dark:text-violet-300",
  },
  {
    id: "other",
    labelKey: "cargo.other",
    icon: Package,
    query: "Карго",
    chipClassName: "bg-orange-50 dark:bg-orange-950/30",
    iconClassName: "text-orange-800 dark:text-orange-300",
  },
];
