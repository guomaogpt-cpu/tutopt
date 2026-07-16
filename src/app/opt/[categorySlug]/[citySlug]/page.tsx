import type { Metadata } from "next";
import { ListingVertical } from "@prisma/client";
import {
  generateVerticalCategoryMetadata,
  renderVerticalCategoryPage,
} from "@/features/seo/vertical-category-route";

type PageProps = {
  params: Promise<{ categorySlug: string; citySlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return generateVerticalCategoryMetadata(ListingVertical.OPT, params);
}

export default async function OptCategoryCitySeoPage({ params }: PageProps) {
  return renderVerticalCategoryPage(ListingVertical.OPT, params);
}
