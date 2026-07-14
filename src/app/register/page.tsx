import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getEnv, isGoogleAuthConfigured } from "@/shared/config/env";

function RegisterFormFallback() {
  return (
    <AuthFormCard title="Регистрация" description="Загрузка формы...">
      <p className="text-sm text-[#64748B]">Загрузка формы...</p>
    </AuthFormCard>
  );
}

export default function RegisterPage() {
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
