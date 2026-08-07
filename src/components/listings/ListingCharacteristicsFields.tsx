import { useMemo, useState, type ReactNode } from "react";
import {
  CHARACTERISTIC_OTHER_OPTION_ID,
  CHARACTERISTIC_VALUE_MAX,
  type CharacteristicFieldDef,
} from "@/config/listing-characteristics";
import {
  fieldShowsOtherInput,
  type CharacteristicFieldValue,
  type CharacteristicValuesState,
} from "@/features/listings/lib/listing-characteristics";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ListingCharacteristicsFieldsProps = {
  fields: readonly CharacteristicFieldDef[];
  values: CharacteristicValuesState;
  onChange: (
    updater:
      | CharacteristicValuesState
      | ((previous: CharacteristicValuesState) => CharacteristicValuesState),
  ) => void;
  disabled?: boolean;
};

function updateField(
  values: CharacteristicValuesState,
  fieldId: string,
  next: CharacteristicFieldValue,
): CharacteristicValuesState {
  return { ...values, [fieldId]: next };
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{children}</p>
  );
}

function OtherTextInput({
  id,
  value,
  maxLength,
  disabled,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  maxLength: number;
  disabled?: boolean;
  placeholder: string;
  onChange: (text: string) => void;
}) {
  return (
    <Input
      id={id}
      value={value}
      maxLength={maxLength}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
      className="mt-2 h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
    />
  );
}

function ChipField({
  field,
  value,
  disabled,
  otherPlaceholder,
  onChange,
}: {
  field: CharacteristicFieldDef;
  value: CharacteristicFieldValue | undefined;
  disabled?: boolean;
  otherPlaceholder: string;
  onChange: (next: CharacteristicFieldValue) => void;
}) {
  const options = field.options ?? [];
  const multiple = Boolean(field.multiple);
  const current: CharacteristicFieldValue =
    value ??
    (multiple
      ? { kind: "multi", optionIds: [] }
      : { kind: "single", optionId: "" });

  function isSelected(optionId: string): boolean {
    if (current.kind === "multi") {
      return current.optionIds.includes(optionId);
    }
    if (current.kind === "single") {
      return current.optionId === optionId;
    }
    return false;
  }

  function toggle(optionId: string) {
    if (multiple) {
      const prev = current.kind === "multi" ? current.optionIds : [];
      const has = prev.includes(optionId);
      let nextIds = has
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId];

      // "Без комплекта" is exclusive with other kit options.
      if (optionId === "none" && !has) {
        nextIds = ["none"];
      } else if (optionId !== "none" && nextIds.includes("none")) {
        nextIds = nextIds.filter((id) => id !== "none");
      }

      onChange({
        kind: "multi",
        optionIds: nextIds,
        otherText: current.kind === "multi" ? current.otherText : "",
      });
      return;
    }

    const selected = current.kind === "single" && current.optionId === optionId;
    onChange({
      kind: "single",
      optionId: selected ? "" : optionId,
      otherText: current.kind === "single" ? current.otherText : "",
    });
  }

  const showOther = fieldShowsOtherInput(field, current);
  const otherText =
    current.kind === "single" || current.kind === "multi"
      ? (current.otherText ?? "")
      : "";

  return (
    <div className="space-y-2">
      <FieldLabel>{field.label}</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option.id}
            variant={isSelected(option.id) ? "default" : "outline"}
            className={cn(
              "min-h-10 cursor-pointer px-3.5 py-2 text-sm font-medium transition",
              disabled && "pointer-events-none opacity-60",
            )}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && toggle(option.id)}
            onKeyDown={(event) => {
              if (!disabled && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                toggle(option.id);
              }
            }}
          >
            {option.label}
          </Badge>
        ))}
      </div>
      {showOther ? (
        <OtherTextInput
          id={`char-other-${field.id}`}
          value={otherText}
          maxLength={field.maxLength ?? CHARACTERISTIC_VALUE_MAX}
          disabled={disabled}
          placeholder={otherPlaceholder}
          onChange={(text) => {
            if (current.kind === "multi") {
              onChange({ ...current, otherText: text });
            } else {
              onChange({
                kind: "single",
                optionId: CHARACTERISTIC_OTHER_OPTION_ID,
                otherText: text,
              });
            }
          }}
        />
      ) : null}
    </div>
  );
}

function SelectField({
  field,
  value,
  disabled,
  otherPlaceholder,
  onChange,
}: {
  field: CharacteristicFieldDef;
  value: CharacteristicFieldValue | undefined;
  disabled?: boolean;
  otherPlaceholder: string;
  onChange: (next: CharacteristicFieldValue) => void;
}) {
  const current: Extract<CharacteristicFieldValue, { kind: "single" }> =
    value?.kind === "single" ? value : { kind: "single", optionId: "" };
  const showOther = fieldShowsOtherInput(field, current);

  return (
    <div className="space-y-2">
      <FieldLabel>{field.label}</FieldLabel>
      <Select
        value={current.optionId || undefined}
        disabled={disabled}
        onValueChange={(optionId) =>
          onChange({
            kind: "single",
            optionId,
            otherText:
              optionId === CHARACTERISTIC_OTHER_OPTION_ID
                ? (current.otherText ?? "")
                : "",
          })
        }
      >
        <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
          <SelectValue placeholder={field.placeholder ?? "Выберите"} />
        </SelectTrigger>
        <SelectContent>
          {(field.options ?? []).map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showOther ? (
        <OtherTextInput
          id={`char-other-${field.id}`}
          value={current.otherText ?? ""}
          maxLength={field.maxLength ?? CHARACTERISTIC_VALUE_MAX}
          disabled={disabled}
          placeholder={otherPlaceholder}
          onChange={(text) =>
            onChange({
              kind: "single",
              optionId: CHARACTERISTIC_OTHER_OPTION_ID,
              otherText: text,
            })
          }
        />
      ) : null}
    </div>
  );
}

function TextOrNumberField({
  field,
  value,
  disabled,
  onChange,
}: {
  field: CharacteristicFieldDef;
  value: CharacteristicFieldValue | undefined;
  disabled?: boolean;
  onChange: (next: CharacteristicFieldValue) => void;
}) {
  const text = value?.kind === "text" ? value.text : "";
  const maxLength = field.maxLength ?? CHARACTERISTIC_VALUE_MAX;
  const inputMode = field.type === "number" ? "decimal" : "text";

  return (
    <div className="space-y-2">
      <label
        htmlFor={`char-${field.id}`}
        className="text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        {field.label}
        {field.unit ? (
          <span className="ml-1 font-normal text-slate-500">({field.unit})</span>
        ) : null}
      </label>
      <Input
        id={`char-${field.id}`}
        value={text}
        inputMode={inputMode}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={field.placeholder}
        onChange={(event) =>
          onChange({ kind: "text", text: event.target.value.slice(0, maxLength) })
        }
        className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
      />
    </div>
  );
}

function ToggleField({
  field,
  value,
  disabled,
  onChange,
}: {
  field: CharacteristicFieldDef;
  value: CharacteristicFieldValue | undefined;
  disabled?: boolean;
  onChange: (next: CharacteristicFieldValue) => void;
}) {
  const enabled = value?.kind === "toggle" ? value.enabled : null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-950">
      <FieldLabel>{field.label}</FieldLabel>
      <div className="flex gap-2">
        <Badge
          variant={enabled === true ? "default" : "outline"}
          className={cn(
            "min-h-10 cursor-pointer px-4 py-2 text-sm",
            disabled && "pointer-events-none opacity-60",
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() =>
            !disabled &&
            onChange({
              kind: "toggle",
              enabled: enabled === true ? null : true,
            })
          }
        >
          Да
        </Badge>
        <Badge
          variant={enabled === false ? "default" : "outline"}
          className={cn(
            "min-h-10 cursor-pointer px-4 py-2 text-sm",
            disabled && "pointer-events-none opacity-60",
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={() =>
            !disabled &&
            onChange({
              kind: "toggle",
              enabled: enabled === false ? null : false,
            })
          }
        >
          Нет
        </Badge>
      </div>
    </div>
  );
}

function renderField(
  field: CharacteristicFieldDef,
  value: CharacteristicFieldValue | undefined,
  disabled: boolean | undefined,
  otherPlaceholder: string,
  onFieldChange: (next: CharacteristicFieldValue) => void,
) {
  if (field.type === "chips") {
    return (
      <ChipField
        field={field}
        value={value}
        disabled={disabled}
        otherPlaceholder={otherPlaceholder}
        onChange={onFieldChange}
      />
    );
  }
  if (field.type === "select") {
    return (
      <SelectField
        field={field}
        value={value}
        disabled={disabled}
        otherPlaceholder={otherPlaceholder}
        onChange={onFieldChange}
      />
    );
  }
  if (field.type === "toggle") {
    return (
      <ToggleField
        field={field}
        value={value}
        disabled={disabled}
        onChange={onFieldChange}
      />
    );
  }
  return (
    <TextOrNumberField
      field={field}
      value={value}
      disabled={disabled}
      onChange={onFieldChange}
    />
  );
}

export function ListingCharacteristicsFields({
  fields,
  values,
  onChange,
  disabled = false,
}: ListingCharacteristicsFieldsProps) {
  const { t } = useTranslation();
  const [showAdditional, setShowAdditional] = useState(false);

  const { primary, additional } = useMemo(() => {
    return {
      primary: fields.filter((field) => field.group === "primary"),
      additional: fields.filter((field) => field.group === "additional"),
    };
  }, [fields]);

  if (fields.length === 0) {
    return null;
  }

  const otherPlaceholder = t("listingCharacteristics.otherPlaceholder");

  function handleFieldChange(field: CharacteristicFieldDef, next: CharacteristicFieldValue) {
    onChange((previous) => updateField(previous, field.id, next));
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {t("listingCharacteristics.title")}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t("listingCharacteristics.description")}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t("listingCharacteristics.usedForAi")}
        </p>
      </div>

      <div className="space-y-4">
        {primary.map((field) => (
          <div key={field.id}>
            {renderField(
              field,
              values[field.id],
              disabled,
              otherPlaceholder,
              (next) => handleFieldChange(field, next),
            )}
          </div>
        ))}
      </div>

      {additional.length > 0 ? (
        <div className="space-y-3">
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className="h-10 px-0 text-sm font-medium text-slate-600 hover:bg-transparent hover:text-slate-900 dark:text-slate-300"
            onClick={() => setShowAdditional((prev) => !prev)}
          >
            {showAdditional
              ? t("listingCharacteristics.showLess")
              : t("listingCharacteristics.showMore")}
          </Button>
          {showAdditional ? (
            <div className="space-y-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              {additional.map((field) => (
                <div key={field.id}>
                  {renderField(
                    field,
                    values[field.id],
                    disabled,
                    otherPlaceholder,
                    (next) => handleFieldChange(field, next),
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
