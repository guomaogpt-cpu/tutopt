import {
  getSellerTrustBadgeLabel,
  type SellerTrustLevel,
  type SellerTrustSignal,
} from "@/lib/trust/seller-trust";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<SellerTrustLevel, string> = {
  trusted: "bg-[#ECFDF5] text-[#059669]",
  normal: "bg-[#EFF6FF] text-[#2563EB]",
  incomplete: "bg-[#FFFBEB] text-[#D97706]",
};

type SellerTrustBadgeProps = {
  level: SellerTrustLevel;
  className?: string;
};

export function SellerTrustBadge({ level, className }: SellerTrustBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        LEVEL_STYLES[level],
        className,
      )}
    >
      {getSellerTrustBadgeLabel(level)}
    </span>
  );
}

type SellerTrustSignalsListProps = {
  signals: SellerTrustSignal[];
  maxItems?: number;
  className?: string;
};

export function SellerTrustSignalsList({
  signals,
  maxItems = 4,
  className,
}: SellerTrustSignalsListProps) {
  const items = signals.slice(0, maxItems);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={cn("space-y-1 text-xs leading-relaxed text-[#475569]", className)}>
      {items.map((signal) => (
        <li key={signal.code}>• {signal.label}</li>
      ))}
    </ul>
  );
}

type SellerTrustCompactBlockProps = {
  level: SellerTrustLevel;
  levelLabel: string;
  signals: SellerTrustSignal[];
  className?: string;
};

export function SellerTrustCompactBlock({
  level,
  levelLabel,
  signals,
  className,
}: SellerTrustCompactBlockProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[#F8FAFC] p-3.5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Доверие к продавцу
        </p>
        <SellerTrustBadge level={level} />
      </div>
      <p className="mt-1.5 text-sm font-medium text-[#0F172A]">{levelLabel}</p>
      <SellerTrustSignalsList signals={signals} maxItems={3} className="mt-2" />
    </div>
  );
}
