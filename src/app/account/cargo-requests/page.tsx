import Link from "next/link";
import { redirect } from "next/navigation";
import { CargoRequestStatusBadge } from "@/components/seller/SellerCargoRequestsList";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getBuyerCargoRequests } from "@/features/cargo/lib/cargo-requests-data";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
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

export default async function AccountCargoRequestsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/account/cargo-requests"));
  }

  const requests = await getBuyerCargoRequests(user.id);

  return (
    <main className="min-w-0 bg-[#F5F7FA] pt-4 dark:bg-slate-950 sm:py-8">
      <Container size="lg" className="max-w-[900px] min-w-0">
        <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <Link href="/account" className="hover:text-blue-600 dark:hover:text-blue-400">
                Личный кабинет
              </Link>
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Мои карго-заявки
            </h1>
          </div>
          <Button
            asChild
            className="h-11 w-full rounded-xl bg-rose-600 text-white hover:bg-rose-700 sm:w-auto"
          >
            <Link href="/cargo">Оставить заявку</Link>
          </Button>
        </header>

        <div className="space-y-3">
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                У вас пока нет карго-заявок.
              </p>
              <Button asChild className="mt-4 h-11 rounded-xl bg-rose-600 text-white hover:bg-rose-700">
                <Link href="/cargo">Перейти к форме</Link>
              </Button>
            </div>
          ) : (
            requests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(request.created_at)}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {request.item_name}
                    </h2>
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
                      Пока нет откликов.
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
                          </p>
                        ) : null}
                        {response.contact_phone || response.contact_name ? (
                          <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                            {response.contact_name ? (
                              <p className="text-slate-800 dark:text-slate-100">
                                {response.contact_name}
                              </p>
                            ) : null}
                            {response.contact_phone ? (
                              <a
                                href={`tel:${response.contact_phone}`}
                                className="mt-0.5 inline-block font-semibold text-orange-700 hover:underline dark:text-orange-300"
                              >
                                {response.contact_phone}
                              </a>
                            ) : null}
                          </div>
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
