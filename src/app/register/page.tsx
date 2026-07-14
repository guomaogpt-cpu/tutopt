import { Suspense } from "react";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/features/auth/lib/session";
import {
  buildSellerUpgradeUrl,
  isSafeInternalPath,
  resolveNextParam,
} from "@/features/auth/lib/login-redirect";
import { getEnv, isGoogleAuthConfigured } from "@/shared/config/env";

function RegisterFormFallback() {
  return (
    <AuthFormCard title="Регистрация" description="Загрузка формы...">
      <p className="text-sm text-[#64748B]">Загрузка формы...</p>
    </AuthFormCard>
  );
}

type RegisterPageProps = {
  searchParams: Promise<{ role?: string; next?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const nextPath = resolveNextParam(params.next);
  const wantsSeller = params.role === "SELLER";

  if (user) {
    if (user.role === UserRole.BUYER && wantsSeller) {
      redirect(
        buildSellerUpgradeUrl(
          nextPath !== "/" && isSafeInternalPath(nextPath) ? nextPath : "/listings/new",
        ),
      );
    }

    if (user.role === UserRole.SELLER) {
      redirect(nextPath !== "/" ? nextPath : "/seller/dashboard");
    }

    redirect(nextPath !== "/" ? nextPath : "/");
  }

  const googleEnabled = isGoogleAuthConfigured();
  const isDev = getEnv().NODE_ENV !== "production";

  return (
    <AuthLayout>
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm googleEnabled={googleEnabled} isDev={isDev} />
      </Suspense>
    </AuthLayout>
  );
}
