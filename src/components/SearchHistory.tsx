"use client";

import { cityKey, formatCity } from "@/lib/utils";
import type { SearchHistoryItem } from "@/lib/types";

interface SearchHistoryProps {
  items: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onRemove: (item: SearchHistoryItem) => void;
}

export function SearchHistory({
  items,
  onSelect,
  onRemove,
}: SearchHistoryProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label="История поиска" className="fade-in">
      <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-ink/55">
        История
      </h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const label = formatCity(item);

          return (
            <li
              key={cityKey(item)}
              className="inline-flex items-center gap-0.5 rounded-full border border-sky-900/10 bg-white/70 py-0.5 pr-1 pl-3 text-sm text-ink transition hover:border-teal-600/40 hover:bg-white"
            >
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="py-0.5"
              >
                {label}
              </button>
              <button
                type="button"
                className="flex h-5 w-5 items-center justify-center rounded-full text-base leading-none text-ink/50 transition hover:bg-ink/10 hover:text-ink"
                aria-label={`Удалить ${label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove(item);
                }}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
