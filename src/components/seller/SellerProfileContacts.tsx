"use client";

import { useRouter } from "next/navigation";
import { Globe, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SellerProfileContactsProps = {
  isAuthenticated: boolean;
  contactPhone: string;
  contactEmail: string | null;
  whatsapp: string | null;
  telegram: string | null;
  website: string | null;
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

function normalizeWebsiteUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function SellerProfileContacts({
  isAuthenticated,
  contactPhone,
  contactEmail,
  whatsapp,
  telegram,
  website,
}: SellerProfileContactsProps) {
  const router = useRouter();

  function handleLoginRedirect() {
    router.push(buildLoginUrl(getCurrentPathFromWindow()));
  }

  const cardClassName = cn(
    "rounded-3xl border border-[rgba(148,163,184,0.18)] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] sm:p-6",
  );

  if (!isAuthenticated) {
    return (
      <section id="seller-contacts" className="mt-6 scroll-mt-24" aria-labelledby="seller-contacts-title">
        <h2 id="seller-contacts-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl">
          Контакты
        </h2>
        <div className={cardClassName}>
          <p className="text-sm leading-relaxed text-[#64748B]">
            Войдите, чтобы увидеть контакты продавца.
          </p>
          <Button
            type="button"
            onClick={handleLoginRedirect}
            className="mt-4 h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto sm:px-6"
          >
            Войти
          </Button>
        </div>
      </section>
    );
  }

  const hasAnyContact = Boolean(contactPhone || contactEmail || whatsapp || telegram || website);

  return (
    <section id="seller-contacts" className="mt-6 scroll-mt-24" aria-labelledby="seller-contacts-title">
      <h2 id="seller-contacts-title" className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl">
        Контакты
      </h2>

      <div className={cardClassName}>
        {!hasAnyContact ? (
          <p className="text-sm text-[#64748B]">Продавец не указал контакты.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {contactPhone ? (
              <Button
                variant="outline"
                className="h-11 w-full justify-start gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={`tel:${contactPhone}`}>
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  Позвонить: {contactPhone}
                </a>
              </Button>
            ) : null}

            {whatsapp ? (
              <Button
                variant="outline"
                className="h-11 w-full justify-start gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={buildWhatsAppHref(whatsapp)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                  WhatsApp
                </a>
              </Button>
            ) : null}

            {telegram ? (
              <Button
                variant="outline"
                className="h-11 w-full justify-start gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={buildTelegramHref(telegram)} target="_blank" rel="noopener noreferrer">
                  <Send className="size-4 shrink-0" aria-hidden="true" />
                  Telegram
                </a>
              </Button>
            ) : null}

            {contactEmail ? (
              <Button
                variant="outline"
                className="h-11 w-full justify-start gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={`mailto:${contactEmail}`}>
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  {contactEmail}
                </a>
              </Button>
            ) : null}

            {website ? (
              <Button
                variant="outline"
                className="h-11 w-full justify-start gap-2 rounded-xl border-[rgba(148,163,184,0.25)]"
                asChild
              >
                <a href={normalizeWebsiteUrl(website)} target="_blank" rel="noopener noreferrer">
                  <Globe className="size-4 shrink-0" aria-hidden="true" />
                  {website}
                </a>
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
