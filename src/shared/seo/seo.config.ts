import type { Metadata } from "next";
import type { ListingVertical } from "@prisma/client";
import { VERTICALS } from "@/features/verticals/verticals";
import { getAbsoluteUrl } from "@/shared/seo/absolute-url";

export const SITE_NAME = "ВсеТут";

export const DEFAULT_TITLE = "ВсеТут — объявления, услуги, опт и карго";

export const DEFAULT_DESCRIPTION =
  "Объявления, услуги, оптовые товары и карго в Кыргызстане — ищите и размещайте предложения на ВсеТут.";

export const TITLE_TEMPLATE = `%s | ${SITE_NAME}`;

export const VERTICAL_CATALOG_SEO: Record<
  ListingVertical,
  { title: string; description: string }
> = {
  OPT: {
    title: "Опт — ВсеТут",
    description: "Оптовые товары и предложения для бизнеса в Кыргызстане.",
  },
  MARKET: {
    title: "Объявления — ВсеТут",
    description: "Частные и коммерческие объявления в Кыргызстане.",
  },
  SERVICES: {
    title: "Услуги — ВсеТут",
    description: "Услуги для частных лиц и бизнеса в Кыргызстане.",
  },
  CARGO: {
    title: "Карго — ВсеТут",
    description: "Карго, доставка и логистика в Кыргызстане.",
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
    title: {
      absolute: title,
    },
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

/** Metadata for auth / dashboard / admin pages — never indexed. */
export function buildPrivatePageMetadata(
  title: string,
  description = "Личный раздел ВсеТут.",
): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}

export function truncateSeoText(text: string, maxLength = 155): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}
