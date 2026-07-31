import Link from "next/link";
import { redirect } from "next/navigation";
import { CargoRequestStatusBadge } from "@/components/seller/SellerCargoRequestsList";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getBuyerCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { buildPrivatePageMetadata } from "@/shared/seo/seo.config";

export const metadata = buildPrivatePageMetadata(
  "Мои карго-заявки",
  "Ваши заявки на перевозку и отклики карго-компаний.",
);

export const dynamic = "force-dynamic";

function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function BuyerCargoRequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/buyer/cargo-requests"));
  }

  const requests = await getBuyerCargoRequests(user.id);

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 dark:bg-slate-950 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-slate-900 sm:text-3xl dark:text-slate-100">
              Мои карго-заявки
            </PageTitle>
            <PageSubtitle className="text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Отклики карго-компаний по вашим заявкам
            </PageSubtitle>
          </PageHeaderContent>
          <PageHeaderActions className="w-full sm:w-auto">
            <Button
              variant="outline"
              asChild
              className="h-11 w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 sm:w-auto"
            >
              <Link href="/cargo">Оставить заявку</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6 space-y-3 lg:mt-8">
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                У вас пока нет карго-заявок. Оставьте заявку на странице Карго.
              </p>
              <Button asChild className="mt-4 h-11 rounded-xl bg-rose-600 text-white hover:bg-rose-700">
                <Link href="/cargo">Перейти к форме</Link>
              </Button>
            </div>
          ) : (
            requests.map((request) => (
              <article
                key={request.id}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(request.created_at)}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {request.item_name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {request.from_location} → {request.to_location}
                    </p>
                  </div>
                  <CargoRequestStatusBadge status={request.status} />
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Отклики ({request.responses.length})
                  </p>
                  {request.responses.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Пока нет откликов. Карго-компании увидят заявку на доске.
                    </p>
                  ) : (
                    request.responses.map((response) => (
                      <div
                        key={response.id}
                        className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-950"
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {response.sellerProfile.company_name}
                        </p>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">{response.comment}</p>
                        {response.price ? (
                          <p className="mt-1 text-slate-700 dark:text-slate-200">
                            {response.price}
                            {response.currency ? ` ${response.currency}` : null}
                            {response.estimated_time ? ` · ${response.estimated_time}` : null}
                          </p>
                        ) : null}
                        {response.contact_phone ? (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {response.contact_name ? `${response.contact_name}: ` : null}
                            {response.contact_phone}
                          </p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </Container>
    </main>
  );
}
