import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/shared/seo/absolute-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/seller/dashboard",
        "/seller/leads",
        "/seller/onboarding",
        "/seller/upgrade",
        "/buyer/dashboard",
        "/favorites",
        "/notifications",
        "/login",
        "/register",
        "/forgot-password",
        "/auth/",
        "/listings/new",
        "/api/",
      ],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
