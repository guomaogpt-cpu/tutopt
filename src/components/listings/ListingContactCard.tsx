"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Phone, Send } from "lucide-react";
import { ListingStatus, type ListingStatus as ListingStatusType } from "@prisma/client";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import {
  listingStatusLabels,
} from "@/features/listings/lib/listing-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type ListingContactCardProps = {
  listingId: string;
  isAuthenticated: boolean;
  isFavorited: boolean;
  priceLabel: string;
  moq: number;
  unitLabel: string;
  stockQuantity: number | null;
  cityName: string | null;
  brandName: string | null;
  status: ListingStatusType;
  publishedAtLabel: string;
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

export function ListingContactCard({
  listingId,
  isAuthenticated,
  isFavorited,
  priceLabel,
  moq,
  unitLabel,
  stockQuantity,
  cityName,
  brandName,
  status,
  publishedAtLabel,
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

  return (
    <Card>
      <CardHeader className="space-y-4 p-6 pb-0">
        {status === ListingStatus.PENDING_MODERATION ? (
          <Badge variant="warning">На модерации</Badge>
        ) : null}

        <p className="text-3xl font-bold tracking-tight text-foreground">{priceLabel}</p>
      </CardHeader>

      <CardContent className="space-y-3 p-6 pt-5">
        <dl className="space-y-3 border-b pb-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">MOQ</dt>
            <dd className="font-medium text-foreground">
              {moq} {unitLabel.toLowerCase()}
            </dd>
          </div>
          {cityName ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Город</dt>
              <dd className="font-medium text-foreground">{cityName}</dd>
            </div>
          ) : null}
          {brandName ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Бренд</dt>
              <dd className="font-medium text-foreground">{brandName}</dd>
            </div>
          ) : null}
          {stockQuantity != null ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Остаток</dt>
              <dd className="font-medium text-foreground">{stockQuantity}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Статус</dt>
            <dd>
              <Badge variant={getStatusBadgeVariant(status)}>
                {listingStatusLabels[status]}
              </Badge>
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Дата публикации</dt>
            <dd className="font-medium text-foreground">{publishedAtLabel}</dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-6 pt-0">
        <Button type="button" className="w-full gap-2" onClick={handleWriteToSeller}>
          <MessageSquare className="size-4" aria-hidden="true" />
          Отправить заявку
        </Button>

        <FavoriteButton
          listingId={listingId}
          isAuthenticated={isAuthenticated}
          initialIsFavorited={isFavorited}
          variant="button"
        />

        {!isAuthenticated ? (
          <Button variant="outline" className="w-full" onClick={handleLoginToViewContacts}>
            Войти, чтобы увидеть контакты
          </Button>
        ) : (
          <>
            {contactPhone ? (
              <Button variant="outline" className="w-full gap-2" asChild>
                <a href={`tel:${contactPhone}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  {contactPhone}
                </a>
              </Button>
            ) : null}
            {whatsapp ? (
              <Button variant="outline" className="w-full gap-2" asChild>
                <a href={buildWhatsAppHref(whatsapp)} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="size-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            ) : null}
            {telegram ? (
              <Button variant="outline" className="w-full gap-2" asChild>
                <a href={buildTelegramHref(telegram)} target="_blank" rel="noopener noreferrer">
                  <Send className="size-4" aria-hidden="true" />
                  Telegram
                </a>
              </Button>
            ) : null}
            {isAuthenticated && !hasContacts ? (
              <p className="text-center text-xs text-muted-foreground">
                Продавец не указал контакты
              </p>
            ) : null}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
