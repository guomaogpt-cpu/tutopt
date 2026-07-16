import Link from "next/link";
import {
  getSellerTrustBadgeLabel,
  type SellerTrustLevel,
} from "@/lib/trust/seller-trust";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<
  SellerTrustLevel,
  { badge: string; bar: string; panel: string }
> = {
  trusted: {
    badge: "bg-[#ECFDF5] text-[#059669]",
    bar: "bg-[#059669]",
    panel: "border-[rgba(5,150,105,0.18)] bg-[#F0FDF4]",
  },
  normal: {
    badge: "bg-[#EFF6FF] text-[#2563EB]",
    bar: "bg-[#2563EB]",
    panel: "border-[rgba(37,99,235,0.18)] bg-[#EFF6FF]",
  },
  incomplete: {
    badge: "bg-[#FFFBEB] text-[#D97706]",
    bar: "bg-[#D97706]",
    panel: "border-[rgba(217,119,6,0.18)] bg-[#FFFBEB]",
  },
};

type SellerProfileCompletenessCardProps = {
  score: number;
  level: SellerTrustLevel;
  levelLabel: string;
  improvements: string[];
  publicProfileHref: string | null;
};

export function SellerProfileCompletenessCard({
  score,
  level,
  levelLabel,
  improvements,
  publicProfileHref,
}: SellerProfileCompletenessCardProps) {
  const styles = LEVEL_STYLES[level];

  return (
    <section
      aria-labelledby="seller-profile-completeness-title"
      className={cn("rounded-3xl border p-5 sm:p-6", styles.panel)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="seller-profile-completeness-title"
          className="text-lg font-bold text-[#0F172A]"
        >
          Заполненность профиля
        </h2>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
            styles.badge,
          )}
        >
          {getSellerTrustBadgeLabel(level)} · {score}
        </span>
      </div>

      <p className="mt-1 text-sm text-[#475569]">{levelLabel}</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/70">
        <div
          className={cn("h-full rounded-full transition-all", styles.bar)}
          style={{ width: `${score}%` }}
        />
      </div>

      {improvements.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-sm text-[#475569]">
          {improvements.slice(0, 4).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-[#475569]">
          Профиль заполнен хорошо. Покупатели видят больше сигналов доверия.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          asChild
          className="h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] sm:w-auto"
        >
          <Link href="/listings/new">Подать объявление</Link>
        </Button>
        {publicProfileHref ? (
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-[rgba(148,163,184,0.3)] bg-white sm:w-auto"
          >
            <Link href={publicProfileHref}>Открыть публичный профиль</Link>
          </Button>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-[#64748B]">
        Редактирование профиля (описание, город) появится в настройках позже.
      </p>
    </section>
  );
}
