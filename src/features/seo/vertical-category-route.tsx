import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ListingVertical } from "@prisma/client";
import { VerticalCategoryLandingPage } from "@/components/seo/VerticalCategoryLandingPage";
import {
  findCategoryForVerticalSeo,
  findCityForSeoSlug,
  getVerticalCategoryLandingData,
} from "@/features/seo/get-vertical-category-page-data";
import { buildSeoLandingMetadata } from "@/features/seo/vertical-category-seo";

type SeoRouteParams = Promise<{
  categorySlug: string;
  citySlug?: string;
}>;

export async function generateVerticalCategoryMetadata(
  vertical: ListingVertical,
  params: SeoRouteParams,
): Promise<Metadata> {
  try {
    const { categorySlug, citySlug } = await params;
    const category = await findCategoryForVerticalSeo(vertical, categorySlug);

    if (!category) {
      return { title: "Раздел не найден" };
    }

    let city = null;
    if (citySlug) {
      city = await findCityForSeoSlug(citySlug);
      if (!city) {
        return { title: "Город не найден" };
      }
    }

    return buildSeoLandingMetadata(category, city);
  } catch (error) {
    console.error("[seo/metadata] Failed to load category landing metadata", error);
    return {
      title: "Раздел | Tutopt",
      description: "Объявления на платформе Tutopt.",
    };
  }
}

export async function renderVerticalCategoryPage(
  vertical: ListingVertical,
  params: SeoRouteParams,
) {
  const { categorySlug, citySlug } = await params;
  const data = await getVerticalCategoryLandingData({
    vertical,
    categorySlug,
    citySlug,
  });

  if (!data) {
    notFound();
  }

  return (
    <VerticalCategoryLandingPage
      vertical={vertical}
      category={data.category}
      city={data.city}
      listings={data.listings}
      totalCount={data.totalCount}
    />
  );
}
