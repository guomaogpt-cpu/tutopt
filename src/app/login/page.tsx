import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { isGoogleAuthConfigured } from "@/shared/config/env";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Вход",
  "Вход в аккаунт ВсеТут.",
);

function LoginFormFallback() {
  return (
    <AuthFormCard title="Вход" description="Загрузка формы...">
      <p className="text-sm text-[#64748B]">Загрузка формы...</p>
    </AuthFormCard>
  );
}

export default function LoginPage() {
  const googleEnabled = isGoogleAuthConfigured();

  return (
    <AuthLayout>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm googleEnabled={googleEnabled} />
      </Suspense>
    </AuthLayout>
  );
}
