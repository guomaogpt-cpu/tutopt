import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SellerOnboardingForm } from "@/components/seller/SellerOnboardingForm";
import { getCurrentUser } from "@/features/auth/lib/session";
import { isSellerPhoneComplete } from "@/features/auth/lib/seller-onboarding";
import { buildLoginUrl, resolveNextParam } from "@/features/auth/lib/login-redirect";
import { getEnv } from "@/shared/config/env";
import { prisma } from "@/shared/lib/prisma";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Контакты для публикации",
  "Заполните контактные данные для публикации на ВсеТут.",
);

type SellerOnboardingPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SellerOnboardingPage({ searchParams }: SellerOnboardingPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const nextPath = resolveNextParam(params.next);
  const onboardingReturn =
    nextPath !== "/"
      ? `/seller/onboarding?next=${encodeURIComponent(nextPath)}`
      : "/seller/onboarding";

  if (!user) {
    redirect(buildLoginUrl(onboardingReturn));
  }

  if (
    user.role !== UserRole.BUYER &&
    user.role !== UserRole.SELLER &&
    user.role !== UserRole.ADMIN
  ) {
    redirect("/");
  }

  if (isSellerPhoneComplete(user.phone)) {
    redirect(nextPath !== "/" ? nextPath : "/listings/new");
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
        nextPath={nextPath !== "/" ? nextPath : "/listings/new"}
        isDev={isDev}
      />
    </AuthLayout>
  );
}
