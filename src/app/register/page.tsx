import { Suspense } from "react";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/features/auth/lib/session";
import { resolveNextParam } from "@/features/auth/lib/login-redirect";
import { getEnv, isGoogleAuthConfigured } from "@/shared/config/env";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Создать аккаунт",
  "Регистрация на ВсеТут.",
);

function RegisterFormFallback() {
  return (
    <AuthFormCard title="Создать аккаунт" description="Загрузка формы...">
      <p className="text-sm text-[#64748B]">Загрузка формы...</p>
    </AuthFormCard>
  );
}

type RegisterPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const nextPath = resolveNextParam(params.next);

  if (user) {
    if (user.role === UserRole.SELLER) {
      redirect(nextPath !== "/" ? nextPath : "/seller/dashboard");
    }

    redirect(nextPath !== "/" ? nextPath : "/buyer/dashboard");
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
