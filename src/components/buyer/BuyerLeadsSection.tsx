import Link from "next/link";
import { leadStatusBadgeClass, leadStatusLabels } from "@/features/leads/lib/lead-status";
import type { BuyerLeadItem } from "@/features/leads/lib/leads-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";

type BuyerLeadsSectionProps = {
  leads: BuyerLeadItem[];
};

export function BuyerLeadsSection({ leads }: BuyerLeadsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Мои отправленные заявки</h2>

      {leads.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          Вы ещё не отправляли заявки.{" "}
          <Link href="/listings" className="font-medium text-blue-600 hover:text-blue-700">
            Найти товары в каталоге
          </Link>
        </p>
      ) : (
        <div className="mt-5 overflow-hidden rounded-xl border border-slate-100">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Объявление
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Продавец
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Количество
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Сообщение
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Дата
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="align-top">
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/listings/${lead.listing.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {lead.listing.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/seller/${lead.sellerProfile.id}`}
                        className="text-slate-700 hover:text-blue-600"
                      >
                        {lead.sellerProfile.company_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{lead.quantity}</td>
                    <td className="max-w-xs px-4 py-3 text-sm text-slate-600">
                      <p className="line-clamp-3 whitespace-pre-wrap">{lead.message ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatListingDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${leadStatusBadgeClass[lead.status]}`}
                      >
                        {leadStatusLabels[lead.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {leads.map((lead) => (
              <article key={lead.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/listings/${lead.listing.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {lead.listing.title}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${leadStatusBadgeClass[lead.status]}`}
                  >
                    {leadStatusLabels[lead.status]}
                  </span>
                </div>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500">Продавец</dt>
                    <dd className="mt-0.5">
                      <Link
                        href={`/seller/${lead.sellerProfile.id}`}
                        className="font-medium text-slate-900 hover:text-blue-600"
                      >
                        {lead.sellerProfile.company_name}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Количество</dt>
                    <dd className="mt-0.5 font-medium text-slate-900">{lead.quantity}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Дата</dt>
                    <dd className="mt-0.5 text-slate-700">{formatListingDate(lead.created_at)}</dd>
                  </div>
                  {lead.message ? (
                    <div>
                      <dt className="text-slate-500">Сообщение</dt>
                      <dd className="mt-0.5 whitespace-pre-wrap text-slate-700">{lead.message}</dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
