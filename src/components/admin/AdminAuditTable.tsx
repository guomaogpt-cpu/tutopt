"use client";

import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";
import {
  getAuditActionLabel,
  getAuditTargetTypeLabel,
} from "@/features/admin/lib/audit-labels";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AdminAuditRow = {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  actorName: string;
  actorRole: string;
  metadata: Record<string, string | number | boolean | null> | null;
  created_at: string;
};

type AdminAuditTableProps = {
  logs: AdminAuditRow[];
};

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatMetadata(
  metadata: Record<string, string | number | boolean | null> | null,
): string {
  if (!metadata) {
    return "—";
  }

  const parts = Object.entries(metadata)
    .filter(([key, value]) => key !== "actor_role" && value !== null && value !== "")
    .map(([key, value]) => `${key}: ${String(value)}`);

  return parts.length > 0 ? parts.join(" · ") : "—";
}

export function AdminAuditTable({ logs }: AdminAuditTableProps) {
  const [actionFilter, setActionFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [actorQuery, setActorQuery] = useState("");

  const actionOptions = useMemo(
    () => Array.from(new Set(logs.map((log) => log.action))).sort(),
    [logs],
  );

  const targetOptions = useMemo(
    () => Array.from(new Set(logs.map((log) => log.targetType))).sort(),
    [logs],
  );

  const filtered = useMemo(() => {
    const normalizedActor = actorQuery.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      const matchesTarget = targetFilter === "all" || log.targetType === targetFilter;
      const matchesActor =
        !normalizedActor || log.actorName.toLowerCase().includes(normalizedActor);
      return matchesAction && matchesTarget && matchesActor;
    });
  }, [logs, actionFilter, targetFilter, actorQuery]);

  if (logs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[rgba(148,163,184,0.25)] bg-white px-6 py-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
          <ScrollText className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-5 text-base font-semibold text-[#0F172A]">Записей пока нет</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#64748B]">
          Здесь появятся действия администраторов и модераторов: модерация, жалобы,
          блокировки и ограничения.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={actorQuery}
          onChange={(event) => setActorQuery(event.target.value)}
          placeholder="Поиск по имени сотрудника"
          className="sm:max-w-xs"
        />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="h-11 w-full rounded-xl sm:w-64">
            <SelectValue placeholder="Действие" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все действия</SelectItem>
            {actionOptions.map((action) => (
              <SelectItem key={action} value={action}>
                {getAuditActionLabel(action)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={targetFilter} onValueChange={setTargetFilter}>
          <SelectTrigger className="h-11 w-full rounded-xl sm:w-48">
            <SelectValue placeholder="Тип объекта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            {targetOptions.map((target) => (
              <SelectItem key={target} value={target}>
                {getAuditTargetTypeLabel(target)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(148,163,184,0.14)] text-xs uppercase tracking-wide text-[#94A3B8]">
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 font-medium">Сотрудник</th>
              <th className="px-4 py-3 font-medium">Действие</th>
              <th className="px-4 py-3 font-medium">Объект</th>
              <th className="px-4 py-3 font-medium">Детали</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">
                  Нет записей по выбранным фильтрам
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[rgba(148,163,184,0.1)] last:border-b-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-[#64748B]">
                    {dateFormatter.format(new Date(log.created_at))}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0F172A]">{log.actorName}</p>
                    <p className="text-xs text-[#94A3B8]">{log.actorRole}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="rounded-lg bg-[#EFF6FF] font-medium text-[#2563EB]">
                      {getAuditActionLabel(log.action)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[#0F172A]">{getAuditTargetTypeLabel(log.targetType)}</p>
                    <p className="max-w-[180px] truncate font-mono text-xs text-[#94A3B8]">
                      {log.targetId}
                    </p>
                  </td>
                  <td className="max-w-[320px] px-4 py-3 text-xs leading-relaxed text-[#64748B]">
                    {formatMetadata(log.metadata)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
