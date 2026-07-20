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

export const PLATFORM_QUICK_ENTRIES = [
  { label: "Товары", href: "/listings" },
  { label: "Опт", href: "/opt" },
  { label: "Услуги", href: "/services" },
  { label: "Грузоперевозки", href: "/cargo" },
] as const;
