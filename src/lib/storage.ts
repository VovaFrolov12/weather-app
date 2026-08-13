import type { SearchHistoryItem, TemperatureUnit } from "./types";

const LAST_CITY = "lastCity";
const HISTORY = "history";
const UNIT = "unit";
const MAX_HISTORY = 8;

function ready(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getLastLocation(): SearchHistoryItem | null {
  if (!ready()) return null;

  try {
    const raw = localStorage.getItem(LAST_CITY);
    return raw ? (JSON.parse(raw) as SearchHistoryItem) : null;
  } catch {
    return null;
  }
}

export function saveLastLocation(location: SearchHistoryItem): void {
  if (!ready()) return;
  localStorage.setItem(LAST_CITY, JSON.stringify(location));
}

export function clearLastLocation(): void {
  if (!ready()) return;
  localStorage.removeItem(LAST_CITY);
}

export function getSearchHistory(): SearchHistoryItem[] {
  if (!ready()) return [];

  try {
    const raw = localStorage.getItem(HISTORY);
    return raw ? (JSON.parse(raw) as SearchHistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addSearchHistoryItem(
  location: SearchHistoryItem,
): SearchHistoryItem[] {
  if (!ready()) return [];

  const current = getSearchHistory();
  const filtered = current.filter(
    (item) => !(item.lat === location.lat && item.lon === location.lon),
  );
  const next = [location, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY, JSON.stringify(next));
  return next;
}

export function removeSearchHistoryItem(
  location: SearchHistoryItem,
): SearchHistoryItem[] {
  if (!ready()) return [];

  const next = getSearchHistory().filter(
    (item) => !(item.lat === location.lat && item.lon === location.lon),
  );
  localStorage.setItem(HISTORY, JSON.stringify(next));

  const last = getLastLocation();
  if (
    last &&
    last.lat === location.lat &&
    last.lon === location.lon
  ) {
    clearLastLocation();
  }

  return next;
}

export function getTemperatureUnit(): TemperatureUnit {
  if (!ready()) return "metric";
  const value = localStorage.getItem(UNIT);
  return value === "imperial" ? "imperial" : "metric";
}

export function saveTemperatureUnit(unit: TemperatureUnit): void {
  if (!ready()) return;
  localStorage.setItem(UNIT, unit);
}
