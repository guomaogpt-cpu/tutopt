"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

  function openPicker() {
    onOpenPickerChange(pickerId);
  }

  function togglePicker() {
    if (isOpen) {
      closePicker();
    } else {
      openPicker();
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
    <div ref={rootRef} className={`space-y-2 ${isOpen ? "relative z-50" : ""}`}>
      <p className="text-sm font-medium text-slate-700">{label}</p>

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={togglePicker}
          className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left text-sm shadow-sm transition hover:border-blue-300 hover:shadow-md disabled:opacity-60"
        >
          <span className={selected ? "font-medium text-slate-900" : "text-slate-400"}>
            {selected?.label ?? placeholder}
          </span>
          <span className={`text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}>▾</span>
        </button>

        {isOpen ? (
          <div
            role="listbox"
            className={`absolute z-50 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-scale-in ${
              dropUp ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {searchable ? (
              <div className="border-b border-slate-100 p-3">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Поиск..."
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            ) : null}

            <ul className="max-h-60 overflow-y-auto overscroll-contain p-2">
              {optional ? (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      closePicker();
                    }}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-slate-500 hover:bg-slate-50"
                  >
                    Не выбрано
                  </button>
                </li>
              ) : null}
              {filtered.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      closePicker();
                    }}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-blue-50 ${
                      option.id === value ? "bg-blue-50 font-medium text-blue-700" : "text-slate-800"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-3 py-4 text-center text-sm text-slate-500">Ничего не найдено</li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
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
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              value === option.id
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
