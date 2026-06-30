"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type HomeSearchBarProps = {
  id?: string;
  placeholder?: string;
  className?: string;
};

export function HomeSearchBar({
  id = "home-search",
  placeholder = "Что ищете оптом?",
  className = "",
}: HomeSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    const href = trimmed
      ? `/listings?q=${encodeURIComponent(trimmed)}`
      : "/listings";
    router.push(href);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label htmlFor={id} className="sr-only">
        Поиск оптовых объявлений
      </label>
      <div className="relative">
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-5 pr-14 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          aria-label="Искать"
          className="absolute inset-y-0 right-0 inline-flex w-14 items-center justify-center rounded-r-2xl text-slate-500 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
