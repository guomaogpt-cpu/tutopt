import type { Metadata } from "next";
import type { ListingVertical } from "@prisma/client";
import { VERTICALS } from "@/features/verticals/verticals";
import { getAbsoluteUrl } from "@/shared/seo/absolute-url";

export const SITE_NAME = "Tutopt";

export const DEFAULT_TITLE = "Tutopt — объявления, товары и услуги Кыргызстана";

export const DEFAULT_DESCRIPTION =
  "Платформа объявлений Кыргызстана: оптовые товары, розничные предложения, услуги и грузоперевозки в одном месте.";

export const VERTICAL_CATALOG_SEO: Record<
  ListingVertical,
  { title: string; description: string }
> = {
  OPT: {
    title: "Оптовые объявления Кыргызстана — ТутОпт",
    description:
      "Оптовые товары, поставщики и предложения для бизнеса в Кыргызстане.",
  },
  MARKET: {
    title: "Розничные объявления Кыргызстана — ТутМаркет",
    description: "Розничные товары, частные объявления и предложения магазинов.",
  },
  SERVICES: {
    title: "Услуги и специалисты Кыргызстана — ТутУслуги",
    description: "Услуги, мастера, ремонт, обучение и бизнес-сервисы.",
  },
  CARGO: {
    title: "Грузоперевозки и логистика Кыргызстана — ТутКарго",
    description: "Грузоперевозки, доставка, склады и логистика в Кыргызстане.",
  },
};

export function getVerticalSeo(vertical: ListingVertical) {
  const config = VERTICALS[vertical];
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    path: config.href,
    label: config.label,
  };
}

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  images?: string[];
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  images,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const url = getAbsoluteUrl(path);
  const absoluteImages = (images ?? [])
    .map((image) => getAbsoluteUrl(image))
    .filter(Boolean);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE_NAME,
      locale: "ru_KG",
      ...(absoluteImages.length > 0
        ? { images: absoluteImages.map((imageUrl) => ({ url: imageUrl })) }
        : {}),
    },
    twitter: {
      card: absoluteImages.length > 0 ? "summary_large_image" : "summary",
      title,
      description,
      ...(absoluteImages.length > 0 ? { images: absoluteImages } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function buildVerticalPageMetadata(vertical: ListingVertical): Metadata {
  const seo = getVerticalSeo(vertical);
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: seo.path,
    type: "website",
  });
}

export function truncateSeoText(text: string, maxLength = 155): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}
