"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/catalog");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-2">
        <label htmlFor="home-search" className="sr-only">
          Поиск оптовых объявлений
        </label>
        <input
          id="home-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Например: цемент, рис, упаковка, перчатки..."
          className="min-h-12 flex-1 rounded-xl border-0 bg-transparent px-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-blue-600 px-6 text-sm font-medium text-white transition hover:bg-blue-700 sm:min-w-[140px]"
        >
          Найти
        </button>
      </div>
    </form>
  );
}
