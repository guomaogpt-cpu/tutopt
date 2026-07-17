import type { ListingVertical } from "@prisma/client";
import { Lightbulb } from "lucide-react";

const HINTS: Record<ListingVertical, string> = {
  OPT: "Перед заявкой уточните минимальную партию, наличие и условия отгрузки.",
  MARKET: "Уточните состояние, комплектацию и возможность доставки.",
  SERVICES: "Опишите задачу, сроки и место выполнения.",
  CARGO: "Укажите маршрут, тип груза, вес/объём и желаемые сроки.",
};

type ListingVerticalHintProps = {
  vertical: ListingVertical;
};

export function ListingVerticalHint({ vertical }: ListingVerticalHintProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-[rgba(37,99,235,0.14)] bg-[#EFF6FF] px-4 py-3">
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-[#1E40AF]">{HINTS[vertical]}</p>
    </div>
  );
}
