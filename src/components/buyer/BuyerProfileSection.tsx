import Image from "next/image";
import type { PublicUser } from "@/features/auth/lib/session";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";

type BuyerProfileSectionProps = {
  user: PublicUser;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

const roleLabels: Record<PublicUser["role"], string> = {
  BUYER: "Покупатель",
  SELLER: "Продавец",
  MODERATOR: "Модератор",
  ADMIN: "Администратор",
};

export function BuyerProfileSection({ user }: BuyerProfileSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Профиль</h2>

      <div className="mt-5 flex items-start gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              fill
              unoptimized
              className="object-cover"
              sizes="56px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50 text-sm font-semibold text-blue-700">
              {getInitials(user.name)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-slate-900">{user.name}</p>
          <p className="mt-1 text-sm text-slate-600">{roleLabels[user.role]}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
        {user.email ? (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{user.email}</dd>
          </div>
        ) : null}
        {user.phone ? (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Телефон</dt>
            <dd className="font-medium text-slate-900">{user.phone}</dd>
          </div>
        ) : null}
        {user.city ? (
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Город</dt>
            <dd className="font-medium text-slate-900">{user.city}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-slate-500">На платформе с</dt>
          <dd className="font-medium text-slate-900">{formatListingDate(user.created_at)}</dd>
        </div>
      </dl>
    </section>
  );
}
