import type { Prisma } from "@prisma/client";

export function formatListingPrice(price: Prisma.Decimal, currency: string): string {
  const amount = Number(price.toString());
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);

  if (currency === "KGS") {
    return `${formatted} сом`;
  }

  return `${formatted} ${currency}`;
}

export function formatListingDate(date: Date): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
