"use client";

import { ChevronDown, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownContent,
  DropdownLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  DEFAULT_DISPLAY_PREFERENCES,
  readDisplayPreferences,
  writeDisplayPreferences,
  type DisplayCurrency,
  type DisplayPreferences,
  type DisplayRegion,
} from "@/lib/preferences/display-preferences";
import { cn } from "@/lib/utils";

const REGION_OPTIONS: Array<{ id: DisplayRegion; labelKey: DictionaryKey }> = [
  { id: "KG", labelKey: "preferences.regionKG" },
  { id: "KZ", labelKey: "preferences.regionKZ" },
  { id: "RU", labelKey: "preferences.regionRU" },
  { id: "OTHER", labelKey: "preferences.regionOther" },
];

const CURRENCY_OPTIONS: Array<{ id: DisplayCurrency; labelKey: DictionaryKey }> = [
  { id: "KGS", labelKey: "preferences.currencyKGS" },
  { id: "KZT", labelKey: "preferences.currencyKZT" },
  { id: "RUB", labelKey: "preferences.currencyRUB" },
  { id: "USD", labelKey: "preferences.currencyUSD" },
];

type CurrencyRegionIndicatorProps = {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CurrencyRegionIndicator({
  className,
  open,
  onOpenChange,
}: CurrencyRegionIndicatorProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const [preferences, setPreferences] = useState<DisplayPreferences>(
    DEFAULT_DISPLAY_PREFERENCES,
  );
  const isControlled = open !== undefined;
  const menuOpen = isControlled ? open : internalOpen;

  function setMenuOpen(next: boolean) {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  }

  useEffect(() => {
    setPreferences(readDisplayPreferences());
  }, []);

  function updatePreferences(next: Partial<DisplayPreferences>) {
    const merged = { ...preferences, ...next };
    setPreferences(merged);
    writeDisplayPreferences(merged);
  }

  const regionLabel = REGION_OPTIONS.find((option) => option.id === preferences.region);
  const shortLabel = preferences.currency;
  const fullLabel = regionLabel
    ? `${t(regionLabel.labelKey)} · ${preferences.currency}`
    : preferences.currency;

  return (
    <Dropdown open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
      <DropdownTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "relative z-[1] h-9 shrink-0 gap-1 border-slate-200/80 bg-white/60 px-2 text-xs font-semibold text-slate-700 backdrop-blur-sm",
            "hover:bg-white/90 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
            "lg:h-10 lg:px-2.5",
            className,
          )}
          aria-label={t("preferences.regionCurrency")}
          aria-expanded={menuOpen}
        >
          <Globe2 className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
          <span className="hidden sm:inline">{fullLabel}</span>
          <span className="sm:hidden">{shortLabel}</span>
          <ChevronDown className="size-3 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end" className="z-[90] w-64">
        <DropdownLabel>{t("preferences.regionCurrency")}</DropdownLabel>
        <DropdownSeparator />
        <DropdownLabel className="text-[11px] font-medium uppercase tracking-wide">
          {t("preferences.region")}
        </DropdownLabel>
        <DropdownRadioGroup
          value={preferences.region}
          onValueChange={(value) => updatePreferences({ region: value as DisplayRegion })}
        >
          {REGION_OPTIONS.map((option) => (
            <DropdownRadioItem key={option.id} value={option.id}>
              {t(option.labelKey)}
            </DropdownRadioItem>
          ))}
        </DropdownRadioGroup>
        <DropdownSeparator />
        <DropdownLabel className="text-[11px] font-medium uppercase tracking-wide">
          {t("preferences.currency")}
        </DropdownLabel>
        <DropdownRadioGroup
          value={preferences.currency}
          onValueChange={(value) =>
            updatePreferences({ currency: value as DisplayCurrency })
          }
        >
          {CURRENCY_OPTIONS.map((option) => (
            <DropdownRadioItem key={option.id} value={option.id}>
              {t(option.labelKey)}
            </DropdownRadioItem>
          ))}
        </DropdownRadioGroup>
        <DropdownSeparator />
        <p className="px-2 py-1.5 text-[11px] leading-snug text-muted-foreground">
          {t("preferences.conversionNotice")}
        </p>
      </DropdownContent>
    </Dropdown>
  );
}
