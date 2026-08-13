"use client";

import { WeatherIcon } from "@/components/WeatherIcon";
import { formatTemperature, getHourlyForecast } from "@/lib/utils";
import type { ForecastItem, TemperatureUnit } from "@/lib/types";

interface HourlyForecastProps {
  items: ForecastItem[];
  unit: TemperatureUnit;
  timezone: number;
}

export function HourlyForecast({ items, unit, timezone }: HourlyForecastProps) {
  const hourly = getHourlyForecast(items, 8, timezone);

  return (
    <section className="fade-in">
      <h2 className="mb-3 text-xl font-semibold text-ink">Почасовой прогноз</h2>
      <div className="no-scrollbar -mx-1 overflow-x-auto pb-1">
        <ul className="flex min-w-max gap-3 px-1">
          {hourly.map((item, index) => (
            <li
              key={`${item.time}-${index}`}
              className="flex w-[104px] flex-col items-center gap-1 rounded-2xl border border-sky-900/10 bg-white/80 px-3 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <p className="text-xs font-medium text-ink/55">{item.time}</p>
              <WeatherIcon
                icon={item.icon}
                description={item.description}
                size="sm"
              />
              <p className="text-base font-semibold text-ink">
                {formatTemperature(item.temp, unit)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
