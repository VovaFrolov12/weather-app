"use client";

import type { TemperatureUnit } from "@/lib/types";

interface UnitToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const btn =
    "rounded-lg px-3 py-1.5 transition aria-pressed:bg-accent aria-pressed:text-white text-ink/70 hover:text-ink";

  return (
    <div
      className="inline-flex shrink-0 self-start rounded-xl border border-sky-900/10 bg-white/70 p-1 text-sm"
      role="group"
      aria-label="Единицы температуры"
    >
      <button
        type="button"
        onClick={() => onChange("metric")}
        className={btn}
        aria-pressed={unit === "metric"}
      >
        °C
      </button>
      <button
        type="button"
        onClick={() => onChange("imperial")}
        className={btn}
        aria-pressed={unit === "imperial"}
      >
        °F
      </button>
    </div>
  );
}
