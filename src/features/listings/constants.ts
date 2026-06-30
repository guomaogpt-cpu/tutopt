import { ListingUnit } from "@prisma/client";

export const listingUnitOptions: { value: ListingUnit; label: string }[] = [
  { value: ListingUnit.PIECE, label: "Штука" },
  { value: ListingUnit.PACK, label: "Упаковка" },
  { value: ListingUnit.BOX, label: "Короб" },
  { value: ListingUnit.KG, label: "Килограмм" },
  { value: ListingUnit.LITER, label: "Литр" },
  { value: ListingUnit.PALLET, label: "Паллета" },
];

export const currencyOptions = [
  { value: "KGS", label: "KGS (сом)" },
  { value: "USD", label: "USD" },
];

export type SelectOption = {
  id: string;
  label: string;
};
