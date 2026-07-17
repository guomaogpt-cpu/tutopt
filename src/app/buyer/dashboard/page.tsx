import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Heart,
  Inbox,
  LayoutGrid,
} from "lucide-react";
import type { ListingVertical } from "@prisma/client";
import { LeadStatus } from "@prisma/client";
import { BuyerFavoritesSection } from "@/components/buyer/BuyerFavoritesSection";
import { BuyerLeadsSection } from "@/components/buyer/BuyerLeadsSection";
import { BuyerQuickActions } from "@/components/buyer/BuyerQuickActions";
import { BuyerRecentViewsSection } from "@/components/buyer/BuyerRecentViewsSection";
import { SellerDashboardStatCards } from "@/components/seller/SellerDashboardStatCards";
import { getBuyerDashboardData } from "@/features/buyer/lib/buyer-dashboard-data";
import { getCurrentUser } from "@/features/auth/lib/session";
import { buildLoginUrl } from "@/features/auth/lib/login-redirect";
import { getUnreadNotificationCount } from "@/features/notifications/lib/notifications-data";
import { VERTICAL_LIST, VERTICALS } from "@/features/verticals/verticals";
import {
  canUserSendLeads,
  isUserBlocked,
} from "@/lib/security/user-restrictions";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
} from "@/components/ui/page-header";
import { PageSubtitle, PageTitle } from "@/components/ui/page-title";
import { cn } from "@/lib/utils";

const RECENT_LEADS_LIMIT = 10;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const QUICK_SEARCH_LINKS: Array<{ label: string; href: string; description: string }> = [
  ...VERTICAL_LIST.map((item) => ({
    label: VERTICALS[item.id].label,
    href: item.href,
    description: item.description,
  })),
  { label: "Все объявления", href: "/listings", description: "Общий каталог" },
];

export default async function BuyerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(buildLoginUrl("/buyer/dashboard"));
  }

  const [data, unreadNotificationsCount] = await Promise.all([
    getBuyerDashboardData(user),
    getUnreadNotificationCount(user.id),
  ]);

  const favoritesCount = data.favoriteListingIds.length;
  const leadsCount = data.leads.length;
  const awaitingResponseCount = data.leads.filter((lead) => lead.status === LeadStatus.NEW).length;
  const weekAgo = Date.now() - WEEK_MS;
  const leadsWeekCount = data.leads.filter(
    (lead) => lead.created_at.getTime() >= weekAgo,
  ).length;

  const blocked = isUserBlocked(user);
  const leadsRestricted = !canUserSendLeads(user);

  const interestVerticals = new Set<ListingVertical>(data.favoriteVerticals);
  for (const lead of data.leads) {
    interestVerticals.add(lead.listing.vertical);
  }
  const interestVerticalList = VERTICAL_LIST.filter((item) =>
    interestVerticals.has(item.id),
  );

  const recentLeads = data.leads.slice(0, RECENT_LEADS_LIMIT);

  const memberSinceLabel = user.created_at.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      label: "Избранные объявления",
      value: favoritesCount,
      icon: Heart,
      iconClassName: "bg-[#FEF2F2] text-[#DC2626]",
    },
    {
      label: "Отправленные заявки",
      value: leadsCount,
      icon: Inbox,
      iconClassName: "bg-[#EFF6FF] text-[#2563EB]",
    },
    {
      label: "Заявки за 7 дней",
      value: leadsWeekCount,
      icon: Clock,
      iconClassName: "bg-[#FFFBEB] text-[#D97706]",
    },
    {
      label: "Новые уведомления",
      value: unreadNotificationsCount,
      icon: Bell,
      iconClassName: "bg-[#ECFDF5] text-[#059669]",
    },
  ];

  return (
    <main className="min-w-0 bg-[#F5F7FA] py-6 sm:py-8">
      <Container size="lg" className="max-w-[1280px] min-w-0">
        <PageHeader className="pb-0">
          <PageHeaderContent>
            <PageTitle className="text-2xl text-[#0F172A] sm:text-3xl">{user.name}</PageTitle>
            <PageSubtitle className="text-sm text-[#64748B] sm:text-base">
              Кабинет покупателя — заявки, избранное и поиск
            </PageSubtitle>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#64748B]">
              <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                Покупатель
              </span>
              {user.phone_verified_at ? (
                <span className="inline-flex items-center gap-1 text-[#059669]">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Телефон подтверждён
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                На платформе с {memberSinceLabel}
              </span>
            </div>
          </PageHeaderContent>
          <PageHeaderActions className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="h-11 w-full rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
            >
              <Link href="/listings">Найти объявления</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-11 w-full rounded-xl border-[rgba(148,163,184,0.25)] sm:w-auto"
            >
              <Link href="/favorites">Избранное</Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        <div className="mt-6 space-y-8 lg:mt-8 lg:space-y-10">
          {blocked || leadsRestricted ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-3xl border border-[rgba(220,38,38,0.2)] bg-[#FEF2F2] p-5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#DC2626]">
                <AlertTriangle className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-[#0F172A]">
                  {blocked
                    ? "Аккаунт ограничен. Некоторые действия недоступны."
                    : "Отправка заявок временно ограничена."}
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  Если вы считаете, что это ошибка, обратитесь в поддержку.
                </p>
              </div>
            </div>
          ) : null}

          <SellerDashboardStatCards stats={stats} />

          {interestVerticalList.length > 0 ? (
            <section aria-labelledby="buyer-interests-title">
              <h2
                id="buyer-interests-title"
                className="mb-3 text-lg font-bold text-[#0F172A] sm:text-xl"
              >
                Направления интереса
              </h2>
              <ul className="flex flex-wrap gap-2">
                {interestVerticalList.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#334155] ring-1 ring-slate-200 transition hover:text-[#2563EB] hover:ring-[#2563EB]/40"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="buyer-quick-search-title">
            <h2
              id="buyer-quick-search-title"
              className="mb-4 text-lg font-bold text-[#0F172A] sm:text-xl"
            >
              Быстрый поиск
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {QUICK_SEARCH_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-0 items-center gap-3 rounded-2xl border border-[rgba(148,163,184,0.18)] bg-white p-4",
                    "shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition hover:border-[rgba(37,99,235,0.22)]",
                  )}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <LayoutGrid className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#0F172A]">{item.label}</p>
                    <p className="mt-0.5 truncate text-xs text-[#64748B]">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {awaitingResponseCount > 0 ? (
            <p className="text-sm text-[#64748B]">
              Ожидают ответа продавца:{" "}
              <span className="font-medium text-[#0F172A]">{awaitingResponseCount}</span>
            </p>
          ) : null}

          <BuyerLeadsSection leads={recentLeads} totalCount={leadsCount} />
          <BuyerFavoritesSection
            listings={data.favoriteListings}
            favoriteListingIds={data.favoriteListingIds}
          />
          <BuyerRecentViewsSection
            listings={data.recentViewedListings}
            favoriteListingIds={data.favoriteListingIds}
          />
          <BuyerQuickActions />
        </div>
      </Container>
    </main>
  );
}
