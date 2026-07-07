import Link from "next/link";
import type { LeadStatus } from "@prisma/client";
import { LeadStatus as LeadStatusEnum } from "@prisma/client";
import { Inbox } from "lucide-react";
import { leadStatusLabels } from "@/features/leads/lib/lead-status";
import type { SellerLeadItem } from "@/features/leads/lib/leads-data";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

type SellerLeadsTableProps = {
  leads: SellerLeadItem[];
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

export function SellerLeadsTable({ leads }: SellerLeadsTableProps) {
  if (leads.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Пока нет заявок"
        description="Когда покупатели заинтересуются вашими товарами, заявки появятся здесь."
        action={
          <Button variant="outline" asChild>
            <Link href="/seller/dashboard">К моим объявлениям</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-0 sm:p-6 sm:pb-0">
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

          <CardContent className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Покупатель
              </p>
              <p className="mt-1 font-medium text-foreground">{lead.buyer.name}</p>
              {lead.buyer.phone ? (
                <p className="mt-1 text-sm text-muted-foreground">{lead.buyer.phone}</p>
              ) : null}
              {lead.buyer.email ? (
                <p className="text-sm text-muted-foreground">{lead.buyer.email}</p>
              ) : null}
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
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {lead.message ?? "—"}
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t p-4 sm:px-6 sm:py-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/listings/${lead.listing.id}`}>Открыть товар</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
