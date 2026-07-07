"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type PickerOption = {
  id: string;
  label: string;
};

type OptionPickerProps = {
  label: string;
  value: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  optional?: boolean;
  error?: string;
  pickerId: string;
  openPickerId: string | null;
  onOpenPickerChange: (pickerId: string | null) => void;
};

const DROPDOWN_MAX_HEIGHT = 240;

export function OptionPicker({
  label,
  value,
  options,
  onChange,
  placeholder = "Выберите значение",
  disabled = false,
  searchable = false,
  optional = false,
  error,
  pickerId,
  openPickerId,
  onOpenPickerChange,
}: OptionPickerProps) {
  const [query, setQuery] = useState("");
  const [dropUp, setDropUp] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isOpen = openPickerId === pickerId;

  const selected = options.find((option) => option.id === value);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  function closePicker() {
    onOpenPickerChange(null);
    setQuery("");
  }

  function togglePicker() {
    if (isOpen) {
      closePicker();
    } else {
      onOpenPickerChange(pickerId);
    }
  }

  useEffect(() => {
    if (!isOpen || !triggerRef.current) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldDropUp = spaceBelow < DROPDOWN_MAX_HEIGHT + 16 && spaceAbove > spaceBelow;
    setDropUp(shouldDropUp);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenPickerChange(null);
        setQuery("");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenPickerChange(null);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onOpenPickerChange]);

  return (
    <div ref={rootRef} className={cn("space-y-2", isOpen && "relative z-50")}>
      <p className="text-sm font-medium text-foreground">{label}</p>

      <div className="relative">
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={togglePicker}
          className="h-11 w-full justify-between px-4 font-normal"
        >
          <span className={cn("truncate", selected ? "font-medium text-foreground" : "text-muted-foreground")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className={cn("size-4 shrink-0 transition", isOpen && "rotate-180")} />
        </Button>

        {isOpen ? (
          <Card
            role="listbox"
            className={cn(
              "absolute z-50 w-full overflow-hidden shadow-lg animate-scale-in",
              dropUp ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            {searchable ? (
              <div className="border-b p-3">
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Поиск..."
                  autoFocus
                />
              </div>
            ) : null}

            <ul className="max-h-60 overflow-y-auto overscroll-contain p-2">
              {optional ? (
                <li>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      onChange("");
                      closePicker();
                    }}
                    className="h-auto w-full justify-start px-3 py-2.5 text-muted-foreground"
                  >
                    Не выбрано
                  </Button>
                </li>
              ) : null}
              {filtered.map((option) => (
                <li key={option.id}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      onChange(option.id);
                      closePicker();
                    }}
                    className={cn(
                      "h-auto w-full justify-start px-3 py-2.5",
                      option.id === value && "bg-accent font-medium text-accent-foreground",
                    )}
                  >
                    {option.label}
                  </Button>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-muted-foreground">Ничего не найдено</li>
              ) : null}
            </ul>
          </Card>
        ) : null}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

type ChipPickerProps = {
  label: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ChipPicker({ label, value, options, onChange, disabled = false }: ChipPickerProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option.id}
            variant={value === option.id ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-sm font-medium transition",
              disabled && "pointer-events-none opacity-60",
            )}
            onClick={() => !disabled && onChange(option.id)}
            onKeyDown={(event) => {
              if (!disabled && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                onChange(option.id);
              }
            }}
            role="button"
            tabIndex={disabled ? -1 : 0}
          >
            {option.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
