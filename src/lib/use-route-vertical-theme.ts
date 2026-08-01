"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  getVerticalTheme,
  resolveThemeVertical,
  type VerticalTheme,
} from "@/lib/vertical-theme";
import type { ListingVertical } from "@prisma/client";

export function useRouteVerticalTheme(): {
  vertical: ListingVertical | null;
  theme: VerticalTheme;
} {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const vertical = resolveThemeVertical(pathname, searchParams);
  return {
    vertical,
    theme: getVerticalTheme(vertical),
  };
}
