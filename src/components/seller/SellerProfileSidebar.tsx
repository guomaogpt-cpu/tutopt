"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
} from "lucide-react";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import type { SellerProfileData } from "@/features/sellers/lib/seller-profile-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SellerProfileSidebarProps = {
  profile: SellerProfileData;
  publishedListingCount: number;
  isAuthenticated: boolean;
  contactPhone: string;
  contactEmail: string | null;
  whatsapp: string | null;
  telegram: string | null;
  website: string | null;
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

function formatListingCount(count: number): string {
  if (count === 1) {
    return "1 объявление";
  }
  if (count < 5) {
    return `${count} объявления`;
  }
  return `${count} объявлений`;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function buildWhatsAppHref(phone: string): string {
  return `https://wa.me/${digitsOnly(phone)}`;
}

function buildTelegramHref(username: string): string {
  const handle = username.replace(/^@/, "").trim();
  return `https://t.me/${encodeURIComponent(handle)}`;
}

function normalizeWebsiteUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

type ContactRowProps = {
  href: string;
  icon: ReactNode;
  label: string;
  external?: boolean;
};

function ContactRow({ href, icon, label, external }: ContactRowProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex min-w-0 items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-[#334155]",
        "transition hover:bg-slate-50",
      )}
    >
      <span className="shrink-0 text-[#64748B]">{icon}</span>
      <span className="min-w-0 truncate">{label}</span>
    </a>
  );
}

export function SellerProfileSidebar({
  profile,
  publishedListingCount,
  isAuthenticated,
  contactPhone,
  contactEmail,
  whatsapp,
  telegram,
  website,
}: SellerProfileSidebarProps) {
  const router = useRouter();
  const logoUrl = profile.logo_url ?? profile.user.avatar_url;
  const locationLabel = [profile.city?.name, profile.region?.name].filter(Boolean).join(", ");
  const showContactPerson =
    profile.user.name.trim().length > 0 && profile.user.name !== profile.company_name;
  const hasAnyContact = Boolean(contactPhone || contactEmail || whatsapp || telegram || website);

  function handleLoginRedirect() {
    router.push(buildLoginUrl(getCurrentPathFromWindow()));
  }

  return (
    <aside className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-24 lg:self-start">
      <div
        className={cn(
          "overflow-hidden rounded-3xl border border-slate-200 bg-white",
          "shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        )}
      >
        <div className="p-5 lg:p-6">
          <div className="flex items-start gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-[20px] border border-slate-200 bg-[#EFF6FF] lg:size-[72px]">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={profile.company_name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="72px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#2563EB] lg:text-xl">
                  {getInitials(profile.company_name)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-xs font-medium text-[#475569]">
                  Поставщик
                </span>
                {profile.is_verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Проверен
                  </span>
                ) : null}
              </div>

              <h1 className="mt-2 text-xl font-bold tracking-tight text-[#0F172A] lg:text-2xl">
                {profile.company_name}
              </h1>

              {profile.user.name !== profile.company_name ? (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-[#64748B]">
                  <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{profile.user.name}</span>
                </p>
              ) : null}
            </div>
          </div>

          <dl className="mt-4 space-y-1.5 text-sm text-[#64748B]">
            {locationLabel ? (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                <dd>{locationLabel}</dd>
              </div>
            ) : null}
            <div>
              <dd>На сайте с {formatListingDate(profile.created_at)}</dd>
            </div>
            <div>
              <dd className="font-medium text-[#334155]">{formatListingCount(publishedListingCount)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Link
              href="#seller-contacts"
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              Связаться
            </Link>
            <Link
              href="#seller-listings"
              className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#334155] transition hover:border-[#2563EB]/30 hover:text-[#2563EB] lg:hidden"
            >
              Смотреть товары
            </Link>
          </div>
        </div>

        <div className="divide-y divide-slate-200 border-t border-slate-200">
          <section aria-labelledby="seller-about-title" className="p-5 lg:p-6">
            <h2 id="seller-about-title" className="text-sm font-semibold text-[#0F172A]">
              О компании
            </h2>
            {profile.description ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#334155]">
                {profile.description}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                Продавец пока не добавил описание компании.
              </p>
            )}

            {(showContactPerson || locationLabel) && (
              <dl className="mt-3 space-y-2 text-sm">
                {showContactPerson ? (
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 size-3.5 shrink-0 text-[#64748B]" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-xs text-[#64748B]">Контактное лицо</dt>
                      <dd className="font-medium text-[#0F172A]">{profile.user.name}</dd>
                    </div>
                  </div>
                ) : null}
              </dl>
            )}
          </section>

          <section
            id="seller-contacts"
            className="scroll-mt-24 p-5 lg:p-6"
            aria-labelledby="seller-contacts-title"
          >
            <h2 id="seller-contacts-title" className="text-sm font-semibold text-[#0F172A]">
              Контакты
            </h2>

            {!isAuthenticated ? (
              <div className="mt-2">
                <p className="text-sm leading-relaxed text-[#64748B]">
                  Войдите, чтобы увидеть контакты.
                </p>
                <Button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="mt-3 h-10 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
                >
                  Войти
                </Button>
              </div>
            ) : !hasAnyContact ? (
              <p className="mt-2 text-sm text-[#64748B]">Продавец не указал контакты.</p>
            ) : (
              <div className="mt-2 flex flex-col gap-0.5">
                {contactPhone ? (
                  <ContactRow
                    href={`tel:${contactPhone}`}
                    icon={<Phone className="size-4" aria-hidden="true" />}
                    label={contactPhone}
                  />
                ) : null}
                {contactEmail ? (
                  <ContactRow
                    href={`mailto:${contactEmail}`}
                    icon={<Mail className="size-4" aria-hidden="true" />}
                    label={contactEmail}
                  />
                ) : null}
                {whatsapp ? (
                  <ContactRow
                    href={buildWhatsAppHref(whatsapp)}
                    icon={<MessageCircle className="size-4" aria-hidden="true" />}
                    label="WhatsApp"
                    external
                  />
                ) : null}
                {telegram ? (
                  <ContactRow
                    href={buildTelegramHref(telegram)}
                    icon={<Send className="size-4" aria-hidden="true" />}
                    label="Telegram"
                    external
                  />
                ) : null}
                {website ? (
                  <ContactRow
                    href={normalizeWebsiteUrl(website)}
                    icon={<Globe className="size-4" aria-hidden="true" />}
                    label={website}
                    external
                  />
                ) : null}
              </div>
            )}
          </section>
        </div>
      </div>
    </aside>
  );
}
