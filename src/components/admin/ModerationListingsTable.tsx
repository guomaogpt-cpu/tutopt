"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Package } from "lucide-react";
import { formatListingDate } from "@/features/listings/lib/format-listing-price";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";

export type ModerationListingRow = {
  id: string;
  title: string;
  created_at: string;
  imageUrl: string | null;
  categoryName: string;
  cityName: string | null;
  sellerName: string;
};

type ModerationListingsTableProps = {
  listings: ModerationListingRow[];
};

type ApiErrorBody = {
  error?: {
    message?: string;
  };
};

export function ModerationListingsTable({ listings }: ModerationListingsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function moderateListing(listingId: string, action: "approve" | "reject") {
    setPendingId(listingId);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/admin/listings/${listingId}/moderation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorBody;
        throw new Error(body.error?.message ?? "Не удалось обработать объявление");
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Не удалось обработать объявление");
    } finally {
      setPendingId(null);
    }
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Нет объявлений на модерации"
        description="Когда продавцы отправят объявления на проверку, они появятся здесь."
      />
    );
  }

  return (
    <Section spacing="none" className="space-y-4">
      {errorMessage ? (
        <Card className="border-destructive/30 bg-destructive/5" role="alert">
          <CardContent className="p-4 text-sm text-destructive">{errorMessage}</CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        {listings.map((listing) => {
          const isPending = pendingId === listing.id;

          return (
            <Card key={listing.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border bg-muted">
                  {listing.imageUrl ? (
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Нет фото
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">{listing.title}</CardTitle>
                    <Badge variant="warning">На модерации</Badge>
                  </div>

                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Продавец</dt>
                      <dd className="font-medium text-foreground">{listing.sellerName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Город</dt>
                      <dd className="font-medium text-foreground">{listing.cityName ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Категория</dt>
                      <dd className="font-medium text-foreground">{listing.categoryName}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Дата</dt>
                      <dd className="font-medium text-foreground">
                        {formatListingDate(new Date(listing.created_at))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2 border-t p-4 sm:px-5 sm:py-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/listings/${listing.id}`}>Открыть</Link>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isPending}
                  onClick={() => moderateListing(listing.id, "approve")}
                >
                  Одобрить
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  disabled={isPending}
                  onClick={() => moderateListing(listing.id, "reject")}
                >
                  Отклонить
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
