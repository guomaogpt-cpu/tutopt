import { getCurrentUser } from "@/features/auth/lib/session";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import { MobileBottomNav } from "@/components/layout/mobile/MobileBottomNav";

export async function MobileNav() {
  const user = await getCurrentUser();

  const headerUser: HeaderUser | null = user
    ? {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    : null;

  return <MobileBottomNav user={headerUser} />;
}
