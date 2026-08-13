"use client";

import Image from "next/image";
import { useWeather } from "@/hooks/useWeather";
import { CitySuggestions } from "@/components/CitySuggestions";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";
import { HourlyForecast } from "@/components/HourlyForecast";
import { LocationButton } from "@/components/LocationButton";
import { SearchBar } from "@/components/SearchBar";
import { SearchHistory } from "@/components/SearchHistory";
import { StatusMessage } from "@/components/StatusMessage";
import { UnitToggle } from "@/components/UnitToggle";

export function WeatherApp() {
  const {
    status,
    errorMessage,
    suggestions,
    weather,
    unit,
    history,
    isSearching,
    searchCity,
    selectLocation,
    removeFromHistory,
    useMyLocation,
    changeUnit,
  } = useWeather();

  const busy = status === "loading";

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <header className="fade-in">
        <div className="flex items-start justify-between gap-3">
          <Image
            src="/logo.svg"
            alt="Employ City"
            width={114}
            height={43}
            className="h-11 w-auto"
          />
          <UnitToggle unit={unit} onChange={changeUnit} />
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Прогноз погоды
        </h1>
        <p className="mt-2 max-w-xl text-ink/65">
          Погода сейчас, по часам и на несколько дней вперёд.
        </p>
      </header>

      <section className="fade-in flex flex-col gap-3">
        <SearchBar
          onSearch={searchCity}
          isSearching={isSearching}
          disabled={busy}
        />
        <LocationButton onClick={useMyLocation} disabled={busy} />
      </section>

      <SearchHistory
        items={history}
        onSelect={selectLocation}
        onRemove={removeFromHistory}
      />
      <CitySuggestions locations={suggestions} onSelect={selectLocation} />
      <StatusMessage status={status} message={errorMessage} />

      {weather && status === "ready" && (
        <div className="flex flex-col gap-6">
          <CurrentWeather
            location={weather.location}
            current={weather.current}
            unit={unit}
          />
          <HourlyForecast
            items={weather.forecast.list}
            unit={unit}
            timezone={weather.forecast.city.timezone}
          />
          <DailyForecast
            items={weather.forecast.list}
            unit={unit}
            timezone={weather.forecast.city.timezone}
          />
        </div>
      )}
    </div>
  );
}
