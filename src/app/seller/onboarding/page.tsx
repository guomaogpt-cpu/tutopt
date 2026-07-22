import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SellerOnboardingForm } from "@/components/seller/SellerOnboardingForm";
import { getCurrentUser } from "@/features/auth/lib/session";
import { needsSellerOnboarding } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getEnv } from "@/shared/config/env";
import { prisma } from "@/shared/lib/prisma";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Онбординг продавца",
  "Заполнение профиля продавца на ВсеТут.",
);

type SellerOnboardingPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SellerOnboardingPage({ searchParams }: SellerOnboardingPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;

  if (!user) {
    redirect(buildLoginUrl("/seller/onboarding"));
  }

  if (user.role === UserRole.BUYER) {
    redirect("/buyer/dashboard");
  }

  if (user.role !== UserRole.SELLER) {
    redirect("/");
  }

  if (!needsSellerOnboarding({ role: user.role, phone: user.phone })) {
    redirect("/seller/dashboard");
  }

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { user_id: user.id },
    select: { company_name: true },
  });

  const isDev = getEnv().NODE_ENV !== "production";

  return (
    <AuthLayout>
      <SellerOnboardingForm
        initialCompanyName={sellerProfile?.company_name ?? user.name}
        email={user.email}
        nextPath={params.next}
        isDev={isDev}
      />
    </AuthLayout>
  );
}
