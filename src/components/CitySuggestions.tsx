"use client";

import { cityKey, formatCity, toHistoryItem } from "@/lib/utils";
import type { GeoLocation, SearchHistoryItem } from "@/lib/types";

interface CitySuggestionsProps {
  locations: GeoLocation[];
  onSelect: (location: SearchHistoryItem) => void;
}

export function CitySuggestions({ locations, onSelect }: CitySuggestionsProps) {
  if (locations.length === 0) return null;

  return (
    <section
      aria-label="Результаты поиска"
      className="fade-in rounded-2xl border border-sky-900/10 bg-white/80 p-3 shadow-sm"
    >
      <h2 className="mb-2 px-1 text-sm font-medium text-ink/60">
        Выберите город
      </h2>
      <ul>
        {locations.map((location, index) => (
          <li
            key={`${cityKey(location)}-${index}`}
            className="border-t border-sky-900/10 first:border-t-0"
          >
            <button
              type="button"
              onClick={() => onSelect(toHistoryItem(location))}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-teal-50"
            >
              <span className="font-medium text-ink">{formatCity(location)}</span>
              <span className="text-xs text-ink/45">
                {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
