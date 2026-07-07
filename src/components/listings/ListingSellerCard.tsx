import Link from "next/link";
import { BadgeCheck, Building2 } from "lucide-react";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type ListingSellerCardProps = {
  sellerName: string;
  companyName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  sellerCity: string | null;
  sellerSince: Date;
  publishedListingCount: number;
  sellerId: string;
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

export function ListingSellerCard({
  sellerName,
  companyName,
  avatarUrl,
  isVerified,
  sellerCity,
  sellerSince,
  publishedListingCount,
  sellerId,
}: ListingSellerCardProps) {
  const showCompany = companyName.trim().length > 0 && companyName !== sellerName;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-6 pb-0">
        <Avatar className="size-14">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={sellerName} /> : null}
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(sellerName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground">{sellerName}</h2>
          {showCompany ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{companyName}</span>
            </p>
          ) : null}
          {isVerified ? (
            <Badge variant="secondary" className="mt-2 gap-1">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Проверен
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <dl className="space-y-3 border-t pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Объявлений</dt>
            <dd className="font-medium text-foreground">{publishedListingCount}</dd>
          </div>
          {sellerCity ? (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Город</dt>
              <dd className="font-medium text-foreground">{sellerCity}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">На платформе с</dt>
            <dd className="font-medium text-foreground">{formatListingDate(sellerSince)}</dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/seller/${sellerId}`}>Все объявления продавца</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
