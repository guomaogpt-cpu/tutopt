import Link from "next/link";
import type { LeadStatus } from "@prisma/client";
import { LeadStatus as LeadStatusEnum } from "@prisma/client";
import { Inbox } from "lucide-react";
import { leadStatusLabels } from "@/features/leads/lib/lead-status";
import type { BuyerLeadItem } from "@/features/leads/lib/leads-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Section, SectionHeader, SectionTitle } from "@/components/ui/section";

type BuyerLeadsSectionProps = {
  leads: BuyerLeadItem[];
  limit?: number;
};

function getLeadBadgeVariant(
  status: LeadStatus,
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status) {
    case LeadStatusEnum.NEW:
      return "default";
    case LeadStatusEnum.VIEWED:
      return "secondary";
    case LeadStatusEnum.CLOSED:
      return "success";
    default:
      return "outline";
  }
}

export function BuyerLeadsSection({ leads, limit }: BuyerLeadsSectionProps) {
  const visibleLeads = limit ? leads.slice(0, limit) : leads;

  return (
    <Section spacing="none" id="buyer-leads" aria-labelledby="buyer-leads-title">
      <Card>
        <CardHeader className="border-b pb-4">
          <SectionHeader className="mb-0">
            <SectionTitle id="buyer-leads-title" className="text-lg">
              {limit ? "Последние заявки" : "Мои отправленные заявки"}
            </SectionTitle>
          </SectionHeader>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {visibleLeads.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Вы ещё не отправляли заявки"
              description="Найдите интересные товары в каталоге и отправьте заявку продавцу."
              className="border-0 bg-transparent py-8"
              action={
                <Button asChild>
                  <Link href="/listings">Перейти в каталог</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {visibleLeads.map((lead) => (
                <Card key={lead.id}>
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-0 sm:p-5 sm:pb-0">
                    <div className="min-w-0">
                      <CardTitle className="text-base">
                        <Link
                          href={`/listings/${lead.listing.id}`}
                          className="transition hover:text-primary"
                        >
                          {lead.listing.title}
                        </Link>
                      </CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatListingDate(lead.created_at)}
                      </p>
                    </div>
                    <Badge variant={getLeadBadgeVariant(lead.status)} className="shrink-0">
                      {leadStatusLabels[lead.status]}
                    </Badge>
                  </CardHeader>

                  <CardContent className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Продавец
                      </p>
                      <Link
                        href={`/seller/${lead.sellerProfile.id}`}
                        className="mt-1 inline-block font-medium text-foreground transition hover:text-primary"
                      >
                        {lead.sellerProfile.company_name}
                      </Link>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Количество
                      </p>
                      <p className="mt-1 font-medium text-foreground">{lead.quantity}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Сообщение
                      </p>
                      <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                        {lead.message ?? "—"}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t p-4 sm:px-5 sm:py-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/listings/${lead.listing.id}`}>Открыть объявление</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
