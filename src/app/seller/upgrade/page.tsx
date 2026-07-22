import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SellerUpgradeForm } from "@/components/seller/SellerUpgradeForm";
import { getCurrentUser } from "@/features/auth/lib/session";
import { hasVerifiedSellerPhone } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl, isSafeInternalPath } from "@/features/auth/lib/login-redirect";
import { getEnv } from "@/shared/config/env";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Стать продавцом",
  "Подключение профиля продавца на ВсеТут.",
);

type SellerUpgradePageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SellerUpgradePage({ searchParams }: SellerUpgradePageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const nextPath =
    params.next && isSafeInternalPath(params.next) ? params.next : "/listings/new";

  if (!user) {
    redirect(buildLoginUrl(`/seller/upgrade?next=${encodeURIComponent(nextPath)}`));
  }

  if (user.role === UserRole.SELLER) {
    redirect(nextPath === "/seller/upgrade" ? "/seller/dashboard" : nextPath);
  }

  if (user.role !== UserRole.BUYER) {
    redirect("/");
  }

  const phoneVerified = hasVerifiedSellerPhone({
    phone: user.phone,
    phone_verified_at: user.phone_verified_at,
  });

  return (
    <AuthLayout>
      <SellerUpgradeForm
        currentName={user.name}
        currentPhone={user.phone}
        phoneVerified={phoneVerified}
        nextPath={nextPath}
        isDev={getEnv().NODE_ENV !== "production"}
      />
    </AuthLayout>
  );
}
