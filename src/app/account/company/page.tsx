import { redirect } from "next/navigation";
import { CompanyProfileForm } from "@/components/company/CompanyProfileForm";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { needsPhoneForPosting } from "@/features/auth/lib/seller-onboarding";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import {
  buildCompanyProfileHref,
  toCompanyProfileSummary,
} from "@/features/company/lib/company-profile";
import { Container } from "@/components/ui/container";
import { prisma } from "@/shared/lib/prisma";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Профиль компании",
  "Создание и редактирование профиля компании на ВсеТут.",
);

export default async function AccountCompanyPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/account/company"));
  }

  if (needsPhoneForPosting(user.phone)) {
    redirect(buildSellerOnboardingUrl("/account/company"));
  }

  const [profile, cities] = await Promise.all([
    prisma.sellerProfile.findUnique({
      where: { user_id: user.id },
      select: {
        id: true,
        slug: true,
        company_name: true,
        company_type: true,
        description: true,
        logo_url: true,
        website: true,
        contact_phone: true,
        city_id: true,
        city: { select: { name: true } },
        verification_status: true,
        verified_at: true,
        created_at: true,
      },
    }),
    prisma.city.findMany({
      where: { is_active: true },
      orderBy: [{ sort_order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  const company = profile ? toCompanyProfileSummary(profile) : null;
  const publicHref =
    company && company.isConfigured
      ? buildCompanyProfileHref(company.slug || company.id)
      : null;

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA] py-4 dark:bg-slate-950 sm:py-8">
      <Container size="md" className="max-w-2xl min-w-0">
        <header className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {company?.isConfigured ? "Профиль компании" : "Создать профиль компании"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Компания — отдельный публичный профиль поверх вашего аккаунта. Можно публиковать
            объявления от личного аккаунта или от компании.
          </p>
        </header>

        <CompanyProfileForm
          initial={company}
          cities={cities.map((city) => ({ id: city.id, label: city.name }))}
          defaultPhone={user.phone ?? ""}
          publicHref={publicHref}
          isCargoType={company?.companyType === "CARGO"}
        />
      </Container>
    </main>
  );
}
