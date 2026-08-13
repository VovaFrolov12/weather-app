"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import {
  addSearchHistoryItem,
  getLastLocation,
  getSearchHistory,
  getTemperatureUnit,
  removeSearchHistoryItem,
  saveLastLocation,
  saveTemperatureUnit,
} from "@/lib/storage";
import { toHistoryItem, uniqueCities } from "@/lib/utils";
import type {
  AppStatus,
  GeoLocation,
  SearchHistoryItem,
  TemperatureUnit,
  WeatherData,
} from "@/lib/types";

export function useWeather() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("metric");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inited = useRef(false);

  async function loadWeather(
    location: SearchHistoryItem,
    options?: { addToHistory?: boolean },
  ) {
    const addToHistory = options?.addToHistory ?? true;

    setStatus("loading");
    setErrorMessage(null);
    setSuggestions([]);

    try {
      const params = new URLSearchParams({
        lat: String(location.lat),
        lon: String(location.lon),
        name: location.name,
        country: location.country,
      });
      if (location.state) params.set("state", location.state);

      const response = await fetch(`/api/weather?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось загрузить погоду");
      }

      const result = data as WeatherData;
      const historyItem = toHistoryItem(result.location);

      setWeather(result);
      saveLastLocation(historyItem);

      if (addToHistory) {
        setHistory(addSearchHistoryItem(historyItem));
      }

      setStatus("ready");
    } catch (error) {
      setWeather(null);
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Ошибка загрузки данных",
      );
    }
  }

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    const savedUnit = getTemperatureUnit();
    const savedHistory = getSearchHistory();
    const last = getLastLocation();

    startTransition(() => {
      setUnit(savedUnit);
      setHistory(savedHistory);
    });

    if (last) {
      void Promise.resolve().then(() =>
        loadWeather(last, { addToHistory: false }),
      );
    }
  }, []);

  async function searchCity(query: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/geocode?q=${encodeURIComponent(trimmed)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка поиска");
      }

      const locations = uniqueCities((data.locations ?? []) as GeoLocation[]);

      if (locations.length === 0) {
        setSuggestions([]);
        setStatus("not_found");
        setWeather(null);
        return;
      }

      if (locations.length === 1) {
        await loadWeather(toHistoryItem(locations[0]));
        return;
      }

      setSuggestions(locations);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Ошибка поиска города",
      );
    } finally {
      setIsSearching(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("geo_unsupported");
      setErrorMessage("Браузер не поддерживает геолокацию");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    const onSuccess = async (position: GeolocationPosition) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `/api/geocode?lat=${latitude}&lon=${longitude}`,
        );
        const data = await response.json();

        if (!response.ok || !data.locations?.[0]) {
          throw new Error(data.error || "Не удалось определить город");
        }

        await loadWeather(toHistoryItem(data.locations[0]));
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Ошибка определения местоположения",
        );
      }
    };

    const ask = (attempt: number) => {
      const options: PositionOptions =
        attempt === 0
          ? { enableHighAccuracy: false, timeout: 10000, maximumAge: 60_000 }
          : { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };

      navigator.geolocation.getCurrentPosition(
        onSuccess,
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setStatus("geo_denied");
            setErrorMessage("Доступ к геолокации запрещён");
            return;
          }

          if (
            attempt === 0 &&
            (error.code === error.POSITION_UNAVAILABLE ||
              error.code === error.TIMEOUT)
          ) {
            ask(1);
            return;
          }

          if (error.code === error.TIMEOUT) {
            setStatus("error");
            setErrorMessage("Не удалось определить местоположение. Попробуйте ещё раз.");
            return;
          }

          setStatus("error");
          setErrorMessage(
            "Не удалось получить координаты. Попробуйте позже или найдите город вручную.",
          );
        },
        options,
      );
    };

    ask(0);
  }

  function changeUnit(next: TemperatureUnit) {
    setUnit(next);
    saveTemperatureUnit(next);
  }

  function removeFromHistory(location: SearchHistoryItem) {
    setHistory(removeSearchHistoryItem(location));
  }

  return {
    status,
    errorMessage,
    suggestions,
    weather,
    unit,
    history,
    isSearching,
    searchCity,
    selectLocation: loadWeather,
    removeFromHistory,
    useMyLocation,
    changeUnit,
  };
}
