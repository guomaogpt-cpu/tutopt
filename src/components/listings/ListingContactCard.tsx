"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Phone, Send } from "lucide-react";
import { ListingStatus, type ListingStatus as ListingStatusType, type ListingVertical } from "@prisma/client";
import { getLeadFormConfig } from "@/features/leads/lib/lead-form-config";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { listingStatusLabels } from "@/features/listings/lib/listing-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ListingContactCardProps = {
  listingId: string;
  isAuthenticated: boolean;
  isFavorited: boolean;
  priceLabel: string;
  priceCaption?: string;
  moq: number;
  unitLabel: string;
  stockQuantity: number | null;
  cityName: string | null;
  brandName: string | null;
  status: ListingStatusType;
  vertical: ListingVertical;
  showStatusBadge?: boolean;
  showMoq?: boolean;
  moqLabel?: string;
  showBrand?: boolean;
  showStock?: boolean;
  stockLabel?: string;
  contactPhone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  messageSectionId?: string;
};

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

function getStatusBadgeVariant(
  status: ListingStatusType,
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status) {
    case ListingStatus.PUBLISHED:
      return "success";
    case ListingStatus.PENDING_MODERATION:
      return "warning";
    case ListingStatus.REJECTED:
      return "destructive";
    default:
      return "secondary";
  }
}

const cardClassName = cn(
  "rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-6",
);

export function ListingContactCard({
  listingId,
  isAuthenticated,
  isFavorited,
  priceLabel,
  priceCaption = "Цена",
  moq,
  unitLabel,
  stockQuantity,
  cityName,
  brandName,
  status,
  vertical,
  showStatusBadge = false,
  showMoq = true,
  moqLabel = "Мин. партия",
  showBrand = true,
  showStock = true,
  stockLabel = "Остаток",
  contactPhone,
  whatsapp,
  telegram,
  messageSectionId = "listing-seller-message",
}: ListingContactCardProps) {
  const router = useRouter();

  function handleLoginToViewContacts() {
    router.push(buildLoginUrl(getCurrentPathFromWindow()));
  }

  function handleWriteToSeller() {
    const section = document.getElementById(messageSectionId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    const textarea = section?.querySelector("textarea");
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.focus();
    }
  }

  const hasContacts = Boolean(contactPhone || whatsapp || telegram);
  const contactCtaLabel = getLeadFormConfig(vertical).contactCtaLabel;

  return (
    <div className={cardClassName}>
      {showStatusBadge ? (
        <Badge variant={getStatusBadgeVariant(status)} className="mb-3">
          {listingStatusLabels[status]}
        </Badge>
      ) : null}

      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
          {priceCaption}
        </p>
        <p className="text-[28px] font-extrabold leading-none tracking-tight text-[#2563EB] sm:text-[32px]">
          {priceLabel}
        </p>
        <p className="text-sm text-[#64748B]">за {unitLabel.toLowerCase()}</p>
      </div>

      <dl className="mt-5 space-y-2.5 border-b border-[rgba(148,163,184,0.14)] pb-5 text-sm">
        {showMoq ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">{moqLabel}</dt>
            <dd className="font-medium text-[#0F172A]">
              {moq} {unitLabel.toLowerCase()}
            </dd>
          </div>
        ) : null}
        {cityName ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Город</dt>
            <dd className="font-medium text-[#0F172A]">{cityName}</dd>
          </div>
        ) : null}
        {showBrand && brandName ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">Бренд</dt>
            <dd className="font-medium text-[#0F172A]">{brandName}</dd>
          </div>
        ) : null}
        {showStock && stockQuantity != null ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#64748B]">{stockLabel}</dt>
            <dd className="font-medium text-[#0F172A]">{stockQuantity}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-5 flex flex-col gap-3">
        <Button
          type="button"
          className="h-11 w-full gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
          onClick={handleWriteToSeller}
        >
          <MessageSquare className="size-4" aria-hidden="true" />
          {contactCtaLabel}
        </Button>

        <FavoriteButton
          listingId={listingId}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          vertical={vertical}
          variant="button"
          className="h-11 w-full rounded-xl"
        />

        {!isAuthenticated ? (
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)]"
            onClick={handleLoginToViewContacts}
          >
            Войти, чтобы увидеть контакты
          </Button>
        ) : (
          <>
            {contactPhone ? (
              <Button
                variant="outline"
                className="h-11 w-full gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={`tel:${contactPhone}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  {contactPhone}
                </a>
              </Button>
            ) : null}
            {whatsapp ? (
              <Button
                variant="outline"
                className="h-11 w-full gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={buildWhatsAppHref(whatsapp)} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="size-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            ) : null}
            {telegram ? (
              <Button
                variant="outline"
                className="h-11 w-full gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={buildTelegramHref(telegram)} target="_blank" rel="noopener noreferrer">
                  <Send className="size-4" aria-hidden="true" />
                  Telegram
                </a>
              </Button>
            ) : null}
            {isAuthenticated && !hasContacts ? (
              <p className="text-center text-xs text-[#94A3B8]">Продавец не указал контакты</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
