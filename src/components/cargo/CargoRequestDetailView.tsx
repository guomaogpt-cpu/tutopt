"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Phone } from "lucide-react";
import { CargoRespondModal } from "@/components/seller/CargoRespondModal";
import { CargoRequestStatusBadge } from "@/components/seller/SellerCargoRequestsList";
import type { CargoRequestDetailData } from "@/features/cargo/lib/cargo-requests-data";
import { normalizeListingImageUrl } from "@/features/listings/lib/listing-image-url";
import { buildLoginUrl, buildRegisterUrl } from "@/features/auth/lib/login-redirect";
import { Button } from "@/components/ui/button";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type CargoRequestDetailViewProps = {
  detail: CargoRequestDetailData;
  isAuthenticated: boolean;
};

function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function responseStatusKey(
  status: CargoRequestDetailData["responses"][number]["status"],
): DictionaryKey {
  switch (status) {
    case "ACCEPTED":
      return "accountRequests.responseStatus.accepted";
    case "REJECTED":
      return "accountRequests.responseStatus.rejected";
    case "WITHDRAWN":
      return "accountRequests.responseStatus.withdrawn";
    case "NEW":
    default:
      return "accountRequests.responseStatus.new";
  }
}

export function CargoRequestDetailView({
  detail,
  isAuthenticated,
}: CargoRequestDetailViewProps) {
  const { t } = useTranslation();
  const [respondOpen, setRespondOpen] = useState(false);
  const returnPath = `/cargo/requests/${detail.id}`;
  const photoUrl = detail.item_photo_url
    ? normalizeListingImageUrl(detail.item_photo_url)
    : null;
  const meta = [detail.weight, detail.dimensions, detail.quantity, detail.urgency]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="h-10 rounded-xl dark:border-slate-700">
          <Link href="/cargo">{t("cargoRequest.backToCargo")}</Link>
        </Button>
        {detail.isOwner ? (
          <Button asChild variant="outline" className="h-10 rounded-xl dark:border-slate-700">
            <Link href="/account/requests?tab=cargoRequests">
              {t("cargoRequest.backToRequests")}
            </Link>
          </Button>
        ) : null}
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDateTime(detail.created_at)}
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
              {detail.item_name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              {detail.from_location}
              <span className="mx-1.5 text-slate-400" aria-hidden="true">
                →
              </span>
              {detail.to_location}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CargoRequestStatusBadge status={detail.status} />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("cargo.admin.responsesCount").replace(
                "{count}",
                String(detail.responseCount),
              )}
            </span>
          </div>
        </div>

        {photoUrl ? (
          <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={photoUrl}
              alt={detail.item_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        ) : null}

        {meta ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{meta}</p>
        ) : null}

        {detail.description ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {detail.description}
          </p>
        ) : null}

        {detail.comment ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {detail.comment}
          </p>
        ) : null}

        {(detail.clientName || detail.clientPhone) && (
          <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/80 px-3 py-2.5 text-sm dark:border-orange-900/40 dark:bg-orange-950/30">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-300">
              {t("cargoRequest.ownerContacts")}
            </p>
            {detail.clientName ? (
              <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                {detail.clientName}
                {detail.clientCompany ? ` · ${detail.clientCompany}` : ""}
              </p>
            ) : null}
            {detail.clientPhone ? (
              <a
                href={`tel:${detail.clientPhone}`}
                className="mt-1 inline-flex items-center gap-1.5 font-semibold text-orange-700 hover:underline dark:text-orange-300"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                {detail.clientPhone}
              </a>
            ) : null}
          </div>
        )}

        <div className="mt-5 space-y-2">
          {detail.isClosed ? (
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {t("cargoRequest.closedRequest")}
            </p>
          ) : null}

          {detail.isOwner && !detail.isClosed ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("cargoRequest.cannotRespondOwnRequest")}
            </p>
          ) : null}

          {!isAuthenticated ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("cargoRequest.noAccessDescription")}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button asChild className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600">
                  <Link href={buildLoginUrl(returnPath)}>{t("auth.signIn")}</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl dark:border-slate-700">
                  <Link href={buildRegisterUrl({ returnPath })}>{t("auth.register")}</Link>
                </Button>
              </div>
            </div>
          ) : null}

          {detail.canRespond ? (
            <Button
              type="button"
              className="h-11 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
              onClick={() => setRespondOpen(true)}
            >
              {t("cargoRequest.respond")}
            </Button>
          ) : null}

          {detail.ownResponse && !detail.isOwner ? (
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {t("cargoRequest.alreadyResponded")}
            </p>
          ) : null}

          {isAuthenticated &&
          !detail.canRespond &&
          !detail.isOwner &&
          !detail.ownResponse &&
          !detail.isClosed ? (
            <Button asChild variant="outline" className="h-11 rounded-xl dark:border-slate-700">
              <Link href="/listings/new?vertical=cargo">{t("cargo.addCompanyButton")}</Link>
            </Button>
          ) : null}
        </div>
      </article>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">
          {t("cargoRequest.responsesTitle")}
        </h2>

        {detail.responses.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {!detail.isOwner &&
              detail.viewerRole !== "admin" &&
              detail.responseCount > 0
                ? t("cargoRequest.responsesOwnerOnly")
                : t("cargoRequest.noResponsesTitle")}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {!detail.isOwner &&
              detail.viewerRole !== "admin" &&
              detail.responseCount > 0
                ? t("cargoRequest.noAccessDescription")
                : t("cargoRequest.noResponsesDescription")}
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {detail.responses.map((response) => {
              const priceLabel =
                response.price && response.currency
                  ? `${response.price} ${response.currency}`
                  : response.price;
              const showContacts =
                detail.isOwner ||
                detail.viewerRole === "admin" ||
                (detail.ownResponse && detail.ownResponse.id === response.id);

              return (
                <li
                  key={response.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {response.sellerProfile.company_name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(response.created_at)}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
                      {t(responseStatusKey(response.status))}
                    </span>
                  </div>
                  {priceLabel ? (
                    <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                      {priceLabel}
                    </p>
                  ) : null}
                  {response.estimated_time ? (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {response.estimated_time}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {response.comment}
                  </p>
                  {showContacts && (response.contact_phone || response.contact_name) ? (
                    <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                      {response.contact_name ? (
                        <p className="text-sm text-slate-800 dark:text-slate-100">
                          {response.contact_name}
                        </p>
                      ) : null}
                      {response.contact_phone ? (
                        <a
                          href={`tel:${response.contact_phone}`}
                          className={cn(
                            "mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold",
                            "text-orange-700 hover:underline dark:text-orange-300",
                          )}
                        >
                          <Phone className="size-3.5" aria-hidden="true" />
                          {response.contact_phone}
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {respondOpen ? (
        <CargoRespondModal
          requestId={detail.id}
          open={respondOpen}
          onOpenChange={setRespondOpen}
        />
      ) : null}
    </div>
  );
}
