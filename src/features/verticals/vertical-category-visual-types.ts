import type { LucideIcon } from "lucide-react";

export type VerticalCategoryVisual = {
  icon: LucideIcon;
  chipClassName: string;
  iconClassName: string;
  featured: boolean;
  featuredOrder: number;
};

export type VerticalCategoryAccent = "violet" | "blue";

export type VerticalCategoryAccentTheme = {
  buttonBorder: string;
  buttonText: string;
  buttonHover: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardHoverShadow: string;
  arrow: string;
  arrowHover: string;
  listHover: string;
};
