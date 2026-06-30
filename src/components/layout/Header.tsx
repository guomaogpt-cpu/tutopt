import { getCurrentUser } from "@/features/auth/lib/session";
import type { HeaderUser } from "@/features/navigation/lib/header-menu";
import { HeaderClient } from "@/components/layout/header/HeaderClient";

export async function Header() {
  const user = await getCurrentUser();

  const headerUser: HeaderUser | null = user
    ? {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    : null;

  return <HeaderClient user={headerUser} />;
}
