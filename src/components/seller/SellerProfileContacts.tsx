"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Globe, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { buildLoginUrl, getCurrentPathFromWindow } from "@/features/auth/lib/login-redirect";

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
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    setLoginHref(buildLoginUrl(getCurrentPathFromWindow()));
  }, []);

  if (!isAuthenticated) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Контакты</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Войдите, чтобы увидеть контакты поставщика.
        </p>
        <Link
          href={loginHref}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          Войти
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Контакты</h2>

      <ul className="mt-4 space-y-3">
        <li className="flex items-center gap-3 text-sm">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Phone className="h-4 w-4" aria-hidden="true" />
          </span>
          <a href={`tel:${contactPhone}`} className="font-medium text-slate-900 hover:text-blue-600">
            {contactPhone}
          </a>
        </li>

        {contactEmail ? (
          <li className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Mail className="h-4 w-4" aria-hidden="true" />
            </span>
            <a
              href={`mailto:${contactEmail}`}
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              {contactEmail}
            </a>
          </li>
        ) : null}

        {whatsapp ? (
          <li className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </span>
            <a
              href={buildWhatsAppHref(whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              WhatsApp: {whatsapp}
            </a>
          </li>
        ) : null}

        {telegram ? (
          <li className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Send className="h-4 w-4" aria-hidden="true" />
            </span>
            <a
              href={buildTelegramHref(telegram)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              Telegram: {telegram.replace(/^@/, "")}
            </a>
          </li>
        ) : null}

        {website ? (
          <li className="flex items-center gap-3 text-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Globe className="h-4 w-4" aria-hidden="true" />
            </span>
            <a
              href={normalizeWebsiteUrl(website)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              {website}
            </a>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
