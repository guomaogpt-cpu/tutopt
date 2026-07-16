import {
  calculateListingQuality,
  getListingQualityLevelLabel,
  getVerticalQualityTips,
  type ListingQualityInput,
  type QualityLevel,
} from "@/lib/moderation/listing-quality";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<
  QualityLevel,
  { badge: string; bar: string; panel: string }
> = {
  good: {
    badge: "bg-[#ECFDF5] text-[#059669]",
    bar: "bg-[#059669]",
    panel: "border-[rgba(5,150,105,0.2)] bg-[#F0FDF4]",
  },
  warning: {
    badge: "bg-[#FFFBEB] text-[#D97706]",
    bar: "bg-[#D97706]",
    panel: "border-[rgba(217,119,6,0.2)] bg-[#FFFBEB]",
  },
  bad: {
    badge: "bg-[#FEF2F2] text-[#DC2626]",
    bar: "bg-[#DC2626]",
    panel: "border-[rgba(220,38,38,0.2)] bg-[#FEF2F2]",
  },
};

type ListingQualityHintsProps = {
  input: ListingQualityInput;
  className?: string;
};

export function ListingQualityHints({ input, className }: ListingQualityHintsProps) {
  const quality = calculateListingQuality(input);
  const styles = LEVEL_STYLES[quality.level];
  const topWarnings = quality.warnings.slice(0, 3);
  const tips = quality.tips.length > 0 ? quality.tips : getVerticalQualityTips(input.vertical);

  return (
    <div
      className={cn(
        "rounded-[18px] border p-4",
        styles.panel,
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[#0F172A]">Качество объявления</p>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            styles.badge,
          )}
        >
          {getListingQualityLevelLabel(quality.level)} · {quality.score}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className={cn("h-full rounded-full transition-all", styles.bar)}
          style={{ width: `${quality.score}%` }}
        />
      </div>

      {topWarnings.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-[#475569]">
          {topWarnings.map((warning) => (
            <li key={warning.code}>• {warning.label}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-[#475569]">
          Хорошее заполнение — объявление легче пройдёт модерацию.
        </p>
      )}

      <ul className="mt-3 space-y-1 border-t border-[rgba(148,163,184,0.2)] pt-3 text-xs text-[#64748B]">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}

type ListingQualityBadgeProps = {
  level: QualityLevel;
  warnings?: { label: string }[];
  className?: string;
};

export function ListingQualityBadge({
  level,
  warnings = [],
  className,
}: ListingQualityBadgeProps) {
  const styles = LEVEL_STYLES[level];
  const topWarnings = warnings.slice(0, 2);

  return (
    <div className={cn("space-y-1", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
          styles.badge,
        )}
      >
        {getListingQualityLevelLabel(level)}
      </span>
      {topWarnings.length > 0 ? (
        <p className="text-[11px] leading-snug text-[#64748B]">
          {topWarnings.map((item) => item.label).join(" · ")}
        </p>
      ) : null}
    </div>
  );
}

type ListingRiskBadgeProps = {
  risk: "low" | "medium" | "high";
  label: string;
  className?: string;
};

const RISK_STYLES = {
  low: "bg-[#ECFDF5] text-[#059669]",
  medium: "bg-[#FFFBEB] text-[#D97706]",
  high: "bg-[#FEF2F2] text-[#DC2626]",
} as const;

export function ListingRiskBadge({ risk, label, className }: ListingRiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        RISK_STYLES[risk],
        className,
      )}
    >
      {label}
    </span>
  );
}
