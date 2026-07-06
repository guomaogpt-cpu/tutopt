import Link from "next/link";
import { leadStatusBadgeClass, leadStatusLabels } from "@/features/leads/lib/lead-status";
import type { SellerLeadItem } from "@/features/leads/lib/leads-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";

type SellerLeadsTableProps = {
  leads: SellerLeadItem[];
};

export function SellerLeadsTable({ leads }: SellerLeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
        <p className="text-base font-medium text-slate-900">Входящих заявок пока нет</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          Когда покупатели отправят заявки по вашим объявлениям, они появятся здесь.
        </p>
        <Link
          href="/seller/dashboard"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          К моим объявлениям
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Товар
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Покупатель
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Количество
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Сообщение
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Дата
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="align-top">
                <td className="px-5 py-4 text-sm">
                  <Link
                    href={`/listings/${lead.listing.id}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {lead.listing.title}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">{lead.buyer.name}</p>
                  {lead.buyer.phone ? <p className="mt-1 text-slate-600">{lead.buyer.phone}</p> : null}
                  {lead.buyer.email ? <p className="mt-1 text-slate-600">{lead.buyer.email}</p> : null}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-slate-900">{lead.quantity}</td>
                <td className="max-w-xs px-5 py-4 text-sm text-slate-600">
                  <p className="whitespace-pre-wrap">{lead.message ?? "—"}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatListingDate(lead.created_at)}
                </td>
                <td className="px-5 py-4 text-sm">
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
          <article key={lead.id} className="p-5">
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

            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Покупатель</dt>
                <dd className="mt-0.5 font-medium text-slate-900">{lead.buyer.name}</dd>
                {lead.buyer.phone ? <dd className="text-slate-600">{lead.buyer.phone}</dd> : null}
                {lead.buyer.email ? <dd className="text-slate-600">{lead.buyer.email}</dd> : null}
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
  );
}
