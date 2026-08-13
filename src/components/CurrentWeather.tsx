"use client";

import { WeatherIcon } from "@/components/WeatherIcon";
import {
  formatCity,
  formatTemperature,
  formatWindSpeed,
} from "@/lib/utils";
import type { CurrentWeatherResponse, GeoLocation, TemperatureUnit } from "@/lib/types";

interface CurrentWeatherProps {
  location: GeoLocation;
  current: CurrentWeatherResponse;
  unit: TemperatureUnit;
}

export function CurrentWeather({ location, current, unit }: CurrentWeatherProps) {
  const condition = current.weather[0];

  return (
    <section className="fade-in rounded-2xl border border-sky-900/10 bg-white/80 p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-[0.18em] text-accent/80">
            Сейчас
          </p>
          <h2 className="mt-1 break-words text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {formatCity(location)}
          </h2>
          <p className="mt-2 capitalize text-ink/70">
            {condition?.description ?? "Нет описания"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {condition?.icon && (
            <WeatherIcon
              icon={condition.icon}
              description={condition.description}
              size="lg"
            />
          )}
          <p className="text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {formatTemperature(current.main.temp, unit)}
          </p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
        <div>
          <dt className="text-ink/50">Ощущается как</dt>
          <dd className="mt-1 text-lg font-medium text-ink">
            {formatTemperature(current.main.feels_like, unit)}
          </dd>
        </div>
        <div>
          <dt className="text-ink/50">Влажность</dt>
          <dd className="mt-1 text-lg font-medium text-ink">
            {current.main.humidity}%
          </dd>
        </div>
        <div>
          <dt className="text-ink/50">Ветер</dt>
          <dd className="mt-1 text-lg font-medium text-ink">
            {formatWindSpeed(current.wind.speed, unit)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
