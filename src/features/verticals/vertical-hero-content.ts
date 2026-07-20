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
    title: "ТутМаркет — товары и объявления",
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
  /** Soft tint classes for pill on dark hero */
  pillClassName: string;
};

export const PLATFORM_QUICK_ENTRIES: PlatformQuickEntry[] = [
  {
    id: "market",
    label: "Товары",
    href: "/listings?vertical=MARKET",
    icon: ShoppingBag,
    pillClassName:
      "bg-indigo-500/25 text-white ring-1 ring-indigo-200/40 hover:bg-indigo-400/40 hover:ring-indigo-100/60",
  },
  {
    id: "opt",
    label: "Опт",
    href: "/opt",
    icon: Package,
    pillClassName:
      "bg-blue-500/25 text-white ring-1 ring-blue-200/40 hover:bg-blue-400/40 hover:ring-blue-100/60",
  },
  {
    id: "services",
    label: "Услуги",
    href: "/services",
    icon: Wrench,
    pillClassName:
      "bg-teal-500/25 text-white ring-1 ring-teal-200/40 hover:bg-teal-400/40 hover:ring-teal-100/60",
  },
  {
    id: "cargo",
    label: "Грузоперевозки",
    href: "/cargo",
    icon: Truck,
    pillClassName:
      "bg-rose-500/25 text-white ring-1 ring-rose-200/40 hover:bg-rose-400/40 hover:ring-rose-100/60",
  },
];

export const PLATFORM_POPULAR_SEARCHES = [
  { label: "iPhone", q: "iPhone" },
  { label: "мебель", q: "мебель" },
  { label: "цемент", q: "цемент" },
  { label: "доставка", q: "доставка" },
  { label: "электрик", q: "электрик" },
  { label: "грузоперевозки", q: "грузоперевозки" },
] as const;

export type HeroPreviewCard = {
  title: string;
  badge: string;
  icon: LucideIcon;
  tintClassName: string;
  badgeClassName: string;
};

export const PLATFORM_HERO_PREVIEW_CARDS: HeroPreviewCard[] = [
  {
    title: "Товары рядом",
    badge: "ТутМаркет",
    icon: ShoppingBag,
    tintClassName: "from-indigo-500/30 to-violet-500/10",
    badgeClassName: "bg-indigo-500/30 text-indigo-50",
  },
  {
    title: "Услуги мастеров",
    badge: "ТутУслуги",
    icon: Wrench,
    tintClassName: "from-teal-500/30 to-emerald-500/10",
    badgeClassName: "bg-teal-500/30 text-teal-50",
  },
  {
    title: "Оптовые партии",
    badge: "ТутОпт",
    icon: Package,
    tintClassName: "from-blue-500/30 to-sky-500/10",
    badgeClassName: "bg-blue-500/30 text-blue-50",
  },
  {
    title: "Грузоперевозки",
    badge: "ТутКарго",
    icon: Truck,
    tintClassName: "from-rose-500/30 to-orange-500/10",
    badgeClassName: "bg-rose-500/30 text-rose-50",
  },
];
