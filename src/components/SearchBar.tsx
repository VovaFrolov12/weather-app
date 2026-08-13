"use client";

import { FormEvent, useEffect, useEffectEvent, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  disabled?: boolean;
}

export function SearchBar({ onSearch, isSearching, disabled }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 450);

  const requestSearch = useEffectEvent((value: string) => {
    onSearch(value);
  });

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      requestSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="city-search" className="sr-only">
        Поиск города
      </label>
      <div className="flex gap-2">
        <input
          id="city-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Введите название"
          disabled={disabled}
          autoComplete="off"
          className="w-full rounded-2xl border border-sky-900/10 bg-white/80 px-4 py-3 text-ink shadow-sm outline-none transition placeholder:text-ink/40 focus:border-teal-500 focus:ring-2 focus:ring-teal-300/50 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !query.trim()}
          className="shrink-0 rounded-2xl bg-accent px-4 py-3 font-medium text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? "..." : "Найти"}
        </button>
      </div>
    </form>
  );
}
