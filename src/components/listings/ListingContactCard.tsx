"use client";

import { MessageSquare, Phone } from "lucide-react";
import { ListingStatus, type ListingStatus as ListingStatusType } from "@prisma/client";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import {
  listingStatusBadgeClass,
  listingStatusLabels,
} from "@/features/listings/lib/listing-status";

type ListingContactCardProps = {
  listingId: string;
  isAuthenticated: boolean;
  isFavorited: boolean;
  priceLabel: string;
  moq: number;
  unitLabel: string;
  stockQuantity: number | null;
  cityName: string | null;
  status: ListingStatusType;
  publishedAtLabel: string;
  messageSectionId?: string;
};

export function ListingContactCard({
  listingId,
  isAuthenticated,
  isFavorited,
  priceLabel,
  moq,
  unitLabel,
  stockQuantity,
  cityName,
  status,
  publishedAtLabel,
  messageSectionId = "listing-seller-message",
}: ListingContactCardProps) {
  function handleWriteToSeller() {
    const section = document.getElementById(messageSectionId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    const textarea = section?.querySelector("textarea");
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      {status === ListingStatus.PENDING_MODERATION ? (
        <span
          className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${listingStatusBadgeClass.PENDING_MODERATION}`}
        >
          На модерации
        </span>
      ) : null}

      <p className="text-3xl font-bold tracking-tight text-slate-900">{priceLabel}</p>

      <dl className="mt-5 space-y-3 border-b border-slate-100 pb-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">MOQ</dt>
          <dd className="font-medium text-slate-900">
            {moq} {unitLabel.toLowerCase()}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Единица</dt>
          <dd className="font-medium text-slate-900">{unitLabel}</dd>
        </div>
        {stockQuantity != null ? (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Остаток</dt>
            <dd className="font-medium text-slate-900">{stockQuantity}</dd>
          </div>
        ) : null}
        {cityName ? (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Город</dt>
            <dd className="font-medium text-slate-900">{cityName}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Статус</dt>
          <dd>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${listingStatusBadgeClass[status]}`}
            >
              {listingStatusLabels[status]}
            </span>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">Дата публикации</dt>
          <dd className="font-medium text-slate-900">{publishedAtLabel}</dd>
        </div>
      </dl>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={handleWriteToSeller}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Отправить заявку
        </button>

        <FavoriteButton
          listingId={listingId}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          variant="button"
        />

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-400"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Позвонить
          </button>
          <p className="mt-1 text-center text-xs text-slate-400">Будет доступен после запуска</p>
        </div>
      </div>
    </article>
  );
}
