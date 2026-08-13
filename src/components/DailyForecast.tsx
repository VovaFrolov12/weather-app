"use client";

import { WeatherIcon } from "@/components/WeatherIcon";
import { formatTemperature, groupForecastByDay } from "@/lib/utils";
import type { ForecastItem, TemperatureUnit } from "@/lib/types";

interface DailyForecastProps {
  items: ForecastItem[];
  unit: TemperatureUnit;
  timezone: number;
}

export function DailyForecast({ items, unit, timezone }: DailyForecastProps) {
  const days = groupForecastByDay(items, 5, timezone);

  return (
    <section className="fade-in">
      <h2 className="mb-3 text-xl font-semibold text-ink">Дневной прогноз</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {days.map((day) => (
          <li
            key={day.date}
            className="rounded-2xl border border-sky-900/10 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
          >
            <p className="text-sm font-medium capitalize text-ink/70">
              {day.dayLabel}
            </p>
            <div className="my-2">
              <WeatherIcon
                icon={day.icon}
                description={day.description}
                size="md"
              />
            </div>
            <p className="text-sm capitalize text-ink/65">{day.description}</p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {formatTemperature(day.tempMax, unit)} /{" "}
              <span className="font-medium text-ink/55">
                {formatTemperature(day.tempMin, unit)}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
