"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { CompanyType, CompanyVerificationStatus } from "@prisma/client";
import { CompanyVerificationBadge } from "@/components/company/CompanyVerificationBadge";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Button } from "@/components/ui/button";

type AdminCompanyRow = {
  id: string;
  companyName: string;
  companyType: CompanyType;
  cityName: string | null;
  ownerName: string;
  ownerId: string;
  verificationStatus: CompanyVerificationStatus;
  verificationNote: string | null;
  createdAt: string;
};

type AdminCompaniesTableProps = {
  companies: AdminCompanyRow[];
};

const TYPE_LABEL_KEY: Record<CompanyType, DictionaryKey> = {
  STORE: "company.types.store",
  SUPPLIER: "company.types.supplier",
  SERVICE: "company.types.service",
  CARGO: "company.types.cargo",
  OTHER: "company.types.other",
};

export function AdminCompaniesTable({ companies }: AdminCompaniesTableProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(companies.map((item) => [item.id, item.verificationNote ?? ""])),
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function runAction(
    companyId: string,
    action: "verify" | "reject" | "reset" | "pending",
  ) {
    setBusyId(companyId);
    setError("");
    try {
      const response = await fetch(`/api/admin/companies/${companyId}/verification`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          note: notes[companyId]?.trim() || null,
        }),
      });
      const body = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) {
        throw new Error(body.error?.message ?? "Request failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusyId(null);
    }
  }

  if (companies.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Нет компаний с заполненным профилем.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-3 md:hidden">
        {companies.map((company) => (
          <article
            key={company.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {company.companyName}
              </h2>
              <CompanyVerificationBadge
                status={company.verificationStatus}
                showOwnerStatus
                compact
              />
            </div>
            <dl className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div>
                {t("admin.companies.companyType")}: {t(TYPE_LABEL_KEY[company.companyType])}
              </div>
              <div>
                {t("admin.companies.owner")}: {company.ownerName}
              </div>
              <div>{company.cityName ?? "—"}</div>
              <div>{new Date(company.createdAt).toLocaleDateString("ru-RU")}</div>
            </dl>
            <label className="mt-3 block text-xs font-medium text-slate-600 dark:text-slate-300">
              {t("admin.companies.note")}
              <textarea
                value={notes[company.id] ?? ""}
                onChange={(event) =>
                  setNotes((prev) => ({ ...prev, [company.id]: event.target.value }))
                }
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                disabled={busyId === company.id}
                onClick={() => void runAction(company.id, "verify")}
                className="rounded-xl"
              >
                {busyId === company.id ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {t("admin.companies.verify")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busyId === company.id}
                onClick={() => void runAction(company.id, "reject")}
                className="rounded-xl dark:border-slate-700"
              >
                {t("admin.companies.reject")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={busyId === company.id}
                onClick={() => void runAction(company.id, "reset")}
              >
                {t("admin.companies.reset")}
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">{t("company.name")}</th>
              <th className="px-4 py-3">{t("admin.companies.companyType")}</th>
              <th className="px-4 py-3">{t("company.city")}</th>
              <th className="px-4 py-3">{t("admin.companies.owner")}</th>
              <th className="px-4 py-3">{t("admin.companies.verificationStatus")}</th>
              <th className="px-4 py-3">{t("admin.companies.note")}</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                className="border-b border-slate-100 align-top dark:border-slate-800"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {company.companyName}
                  <div className="mt-1 text-xs font-normal text-slate-400">
                    {new Date(company.createdAt).toLocaleDateString("ru-RU")}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {t(TYPE_LABEL_KEY[company.companyType])}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {company.cityName ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  {company.ownerName}
                </td>
                <td className="px-4 py-3">
                  <CompanyVerificationBadge
                    status={company.verificationStatus}
                    showOwnerStatus
                    compact
                  />
                </td>
                <td className="px-4 py-3">
                  <textarea
                    value={notes[company.id] ?? ""}
                    onChange={(event) =>
                      setNotes((prev) => ({ ...prev, [company.id]: event.target.value }))
                    }
                    rows={2}
                    className="w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={busyId === company.id}
                      onClick={() => void runAction(company.id, "verify")}
                      className="rounded-xl"
                    >
                      {t("admin.companies.verify")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyId === company.id}
                      onClick={() => void runAction(company.id, "reject")}
                      className="rounded-xl dark:border-slate-700"
                    >
                      {t("admin.companies.reject")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={busyId === company.id}
                      onClick={() => void runAction(company.id, "reset")}
                    >
                      {t("admin.companies.reset")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
