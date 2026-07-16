import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function OptLayout({ children }: { children: ReactNode }) {
  return children;
}
