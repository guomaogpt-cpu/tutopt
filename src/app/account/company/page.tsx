import { redirect } from "next/navigation";
import Link from "next/link";
import { CompanyStorefrontPreview } from "@/components/company/CompanyStorefrontPreview";
import { CompanyProfileForm } from "@/components/company/CompanyProfileForm";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { needsPhoneForPosting } from "@/features/auth/lib/seller-onboarding";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildSellerOnboardingUrl } from "@/features/auth/validators/seller-onboarding.validators";
import {
  buildCompanyPublicHref,
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
  const isConfigured = Boolean(company?.isConfigured);
  const publicHref =
    company && isConfigured ? buildCompanyPublicHref(company.id) : null;

  return (
    <main className="min-w-0 overflow-x-clip bg-[#F5F7FA] pt-4 dark:bg-slate-950 sm:py-8">
      <Container size="md" className="max-w-2xl min-w-0 pb-24 sm:pb-8">
        <header className="mb-5 sm:mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <Link href="/account" className="hover:text-blue-600 dark:hover:text-blue-400">
              Личный кабинет
            </Link>
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Профиль компании
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {isConfigured
              ? "Редактируйте данные компании, откройте публичную страницу или отправьте профиль на проверку."
              : "Создайте профиль компании, чтобы публиковать объявления от имени бизнеса и показывать клиентам информацию о компании."}
          </p>
        </header>

        <CompanyStorefrontPreview company={company} publicHref={publicHref} />

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
