import {
  BadgePercent,
  Box,
  Clock,
  Handshake,
  Heart,
  MapPin,
  Package,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ListingVertical } from "@prisma/client";

export type VerticalHeroBenefit = {
  icon: LucideIcon;
  label: string;
};

export type VerticalHeroContent = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  benefits: VerticalHeroBenefit[];
};

export const VERTICAL_HERO_CONTENT: Record<ListingVertical, VerticalHeroContent> = {
  OPT: {
    title: "Оптовые товары и поставщики Кыргызстана",
    subtitle:
      "Находите поставщиков, партии товаров и предложения для бизнеса напрямую.",
    searchPlaceholder: "Найти оптовый товар или поставщика…",
    benefits: [
      { icon: Truck, label: "Прямые поставщики" },
      { icon: BadgePercent, label: "Оптовые цены" },
      { icon: Package, label: "Партии товаров" },
      { icon: Handshake, label: "Без посредников" },
    ],
  },
  MARKET: {
    title: "Объявления — товары рядом с вами",
    subtitle:
      "Покупайте и продавайте товары рядом с вами: техника, мебель, одежда, товары для дома и многое другое.",
    searchPlaceholder: "Найти товар или объявление…",
    benefits: [
      { icon: Store, label: "Частные объявления" },
      { icon: MapPin, label: "Товары рядом" },
      { icon: Search, label: "Удобный поиск" },
      { icon: Heart, label: "Избранное и сравнение" },
    ],
  },
  SERVICES: {
    title: "ТутУслуги — специалисты и услуги",
    subtitle:
      "Находите мастеров, специалистов и компании для бытовых и бизнес-задач.",
    searchPlaceholder: "Найти услугу или специалиста…",
    benefits: [
      { icon: Wrench, label: "Мастера и специалисты" },
      { icon: MapPin, label: "Услуги рядом" },
      { icon: Clock, label: "Быстрый отклик" },
      { icon: Users, label: "Заявки через объявления" },
    ],
  },
  CARGO: {
    title: "ТутКарго — грузоперевозки и логистика",
    subtitle:
      "Ищите перевозчиков, транспорт, маршруты и логистические услуги по Кыргызстану и за его пределами.",
    searchPlaceholder: "Найти перевозку или маршрут…",
    benefits: [
      { icon: Truck, label: "Грузоперевозки" },
      { icon: Route, label: "Маршруты" },
      { icon: Users, label: "Перевозчики" },
      { icon: Box, label: "Логистика для бизнеса" },
    ],
  },
};

export const PLATFORM_HERO_BENEFITS: VerticalHeroBenefit[] = [
  { icon: Sparkles, label: "Все разделы в одном месте" },
  { icon: Search, label: "Удобный поиск" },
  { icon: MapPin, label: "Объявления по всему Кыргызстану" },
  { icon: ShieldCheck, label: "Бесплатное размещение" },
];

export type PlatformQuickEntry = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  pillClassName: string;
};

export const PLATFORM_QUICK_ENTRIES: PlatformQuickEntry[] = [
  {
    id: "market",
    label: "Объявления",
    href: "/market",
    icon: ShoppingBag,
    pillClassName:
      "bg-indigo-500/20 text-white ring-1 ring-white/25 hover:bg-indigo-400/30 hover:ring-white/40",
  },
  {
    id: "opt",
    label: "Опт",
    href: "/opt",
    icon: Package,
    pillClassName:
      "bg-blue-500/20 text-white ring-1 ring-white/25 hover:bg-blue-400/30 hover:ring-white/40",
  },
  {
    id: "services",
    label: "Услуги",
    href: "/services",
    icon: Wrench,
    pillClassName:
      "bg-teal-500/20 text-white ring-1 ring-white/25 hover:bg-teal-400/30 hover:ring-white/40",
  },
  {
    id: "cargo",
    label: "Карго",
    href: "/cargo",
    icon: Truck,
    pillClassName:
      "bg-rose-500/20 text-white ring-1 ring-white/25 hover:bg-rose-400/30 hover:ring-white/40",
  },
];

/** Compact popular chips under hero search (keep short to avoid competing with quick entries). */
export const PLATFORM_POPULAR_SEARCHES = [
  { label: "iPhone", q: "iPhone" },
  { label: "мебель", q: "мебель" },
  { label: "доставка", q: "доставка" },
  { label: "грузоперевозки", q: "грузоперевозки" },
] as const;

export type HeroPreviewCard = {
  title: string;
  icon: LucideIcon;
};

/** Neat 2×2 decorative preview — same size cards, no floating offsets. */
export const PLATFORM_HERO_PREVIEW_CARDS: HeroPreviewCard[] = [
  { title: "Все разделы", icon: Sparkles },
  { title: "Удобный поиск", icon: Search },
  { title: "По всему Кыргызстану", icon: MapPin },
  { title: "Бесплатное размещение", icon: ShieldCheck },
];
