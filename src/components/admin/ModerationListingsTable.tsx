"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ModerationListingRow = {
  id: string;
  title: string;
  created_at: string;
  imageUrl: string | null;
  categoryName: string;
  cityName: string | null;
  sellerName: string;
};

type ModerationListingsTableProps = {
  listings: ModerationListingRow[];
};

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

export function ModerationListingsTable({ listings }: ModerationListingsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function moderateListing(listingId: string, action: "approve" | "reject") {
    setPendingId(listingId);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/listings/${listingId}/moderation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorBody;
        throw new Error(body.error?.message ?? "Не удалось обработать объявление");
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось обработать объявление");
    } finally {
      setPendingId(null);
    }
  }

  if (listings.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm text-slate-600">Нет объявлений на модерации.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {errorMessage ? (
        <div
          role="alert"
          className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      ) : null}

      <ul className="divide-y divide-slate-100">
        {listings.map((listing) => {
          const isPending = pendingId === listing.id;

          return (
            <li
              key={listing.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {listing.imageUrl ? (
                  <Image
                    src={listing.imageUrl}
                    alt={listing.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    Нет фото
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{listing.title}</p>
                <dl className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <dt className="inline text-slate-500">Продавец: </dt>
                    <dd className="inline">{listing.sellerName}</dd>
                  </div>
                  <div>
                    <dt className="inline text-slate-500">Город: </dt>
                    <dd className="inline">{listing.cityName ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="inline text-slate-500">Категория: </dt>
                    <dd className="inline">{listing.categoryName}</dd>
                  </div>
                  <div>
                    <dt className="inline text-slate-500">Создано: </dt>
                    <dd className="inline">
                      {new Date(listing.created_at).toLocaleDateString("ru-RU")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => moderateListing(listing.id, "approve")}
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  Одобрить
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => moderateListing(listing.id, "reject")}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                >
                  Отклонить
                </button>
                <Link
                  href={`/listings/${listing.id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Открыть
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
